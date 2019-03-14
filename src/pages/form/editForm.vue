<template lang="pug">
.editform
  .editform-head
    .editform-head-left
      .editform-head-left-goback
        i.el-icon-arrow-left(@click="goback")
        span.app-name {{ formName }}
        i.el-icon-edit(@click="rename")
    .editform-head-mid
      .editform-head-form 表单设计
      .editform-head-data(@click="goFormData") 数据管理
    .editform-head-right
      my-avatar
  .editform-aside
    .editform-aside-items
      .editform-aside-itemtitle 基础字段
      draggable.editform-aside-block.simple(v-model="baseWidget" :options="widgetDragOp" @end="handleCloneWidget")
        .editform-aside-item-label(
          v-for="widget in baseWidget"
          :key="widget.id")
          i.iconfont(:class="'icon-'+widget.icon")
          |{{ widget.label }}
    .editform-aside-items
      .editform-aside-itemtitle 增强字段
      draggable.editform-aside-block(v-model="complexWidget" :options="widgetDragOp" @end="handleCloneWidget")
        .editform-aside-item-label(
          v-for="widget in complexWidget"
          :key="widget.id")
          i.iconfont(:class="'icon-'+widget.icon")
          |{{ widget.label }}
  .editform-form
    .editform-form-operate
      .view-form(@click="goView")
        i.el-icon-view
        |预览
      .save-form
        el-button.save-btn(type="primary" @click="saveForm") 保存
      .publish-form
        el-button.publish-btn(type="success" @click="publishVisiable=true") 发布
    draggable.editform-form-content(v-model="formData" :options="formItemDragOp" @end="changeFormItemOrder")
      form-item(
        v-for="(formItem, index) in formData"
        :key="index"
        :info="formItem"
        :class="{ selected: formItem.widget && currentSelect === formItem.widget.id }"
        @selected="handleSelectFormItem"
        @delete="handleDeleteFormItem")
  .editform-param
    .editform-param-title 字段属性
    widget-set(:info="selectedWidget" @changeParams="setWidget")
  el-dialog(
    title="发布"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="publishVisiable"
    :before-close="handleClosePublish"
    width="500px")
    el-tree(
      :data="structs"
      show-checkbox
      node-key="id"
      :props="treeProps"
      :default-checked-keys="authArr"
      ref="structTree"
    )
    .end-time
      el-date-picker(
        v-model="endTime"
        type="date"
        placeholder="选择截止日期")
    .contact-struct-btns
      el-button.change-struct-btn(type="info" @click="handleCancelPublish") 取消
      el-button.change-struct-btn(type="primary" @click="handleConfirmPublish") 确定
</template>

<script>
import {
  INPUT,
  TEXTAREA,
  RADIO,
  CHECKBOX,
  SELECT,
  DATE,
  ADDRESS,
  PHONE,
  EMAIL
} from '@/config.js'
import draggable from 'vuedraggable'
import FormItem from './components/formItem'
import WidgetSet from './components/param'
import MyAvatar from '@/components/Avatar'

import { getLoginUser } from '@/utils/storage.js'

import {
  addFormAPI,
  getFormDetailAPI,
  updateFormAPI,
  getContactsAPI
} from '@/api/index.js'

export default {
  components: {
    draggable,
    FormItem,
    WidgetSet,
    MyAvatar
  },
  data () {
    return {
      baseWidget: [
        {
          label: '单行文本',
          id: INPUT,
          icon: 'wenben',
          widget: null
        },
        {
          label: '多行文本',
          id: TEXTAREA,
          icon: 'wenben',
          widget: null
        },
        {
          label: '单选按钮',
          id: RADIO,
          widget: null,
          icon: 'danxuan'
        },
        {
          label: '多选框',
          id: CHECKBOX,
          widget: null,
          icon: 'duoxuan'
        },
        {
          label: '下拉菜单',
          id: SELECT,
          widget: null,
          icon: 'xiala'
        },
        {
          label: '日期',
          id: DATE,
          widget: null,
          icon: 'riqi'
        }
      ],
      complexWidget: [
        {
          label: '地址',
          id: ADDRESS,
          widget: null,
          icon: 'dizhi'
        },
        {
          label: '手机',
          id: PHONE,
          widget: null,
          icon: 'shouji'
        },
        {
          label: '邮箱',
          id: EMAIL,
          widget: null,
          icon: 'youxiang'
        }
      ],
      formData: [],
      widgetDragOp: {
        group: {
          name: 'widget',
          pull: 'clone',
          put: false,
          revertClone: true
        },
        sort: false
      },
      formItemDragOp: {
        group: 'widget'
      },
      currentSelect: -1,
      publishVisiable: false,
      structs: [], // 发布给组织
      endTime: 946656000000,
      formName: '未命名表单',
      formId: -1,
      treeProps: {
        label: function (data, node) {
          console.log(data, node)
          return data.groupName
        }
      },
      authArr: []
    }
  },
  computed: {
    selectedWidget () {
      let resArr = this.formData.filter(_ => _.widget && _.widget.id === this.currentSelect)
      if (resArr.length) return resArr[0]
      return null
    },
    mode () {
      return this.$route.name
    },
    saveParams () {
      let { phone } = getLoginUser()
      let agId = this.mode === 'addForm' ? '0' : this.$route.params.groupId
      let endTime = +new Date(this.endTime)
      let p = {
        appId: this.$route.params.appId,
        creator: phone,
        agId,
        data: JSON.stringify(this.formData),
        endTime,
        type: 1,
        name: this.formName,
        authArr: this.authArr.join(',')
      }
      if (this.mode === 'editForm') {
        p.id = this.$route.params.formId
      }
      return p
    }
  },
  mounted () {
    this.initFormData()
  },
  methods: {
    goback () {
      this.$router.push({ name: 'editApp', params: { id: this.$route.params.appId } })
    },
    async initFormData () {
      let contacts = await getContactsAPI()
      this.structs = contacts.data
      if (this.$route.params.formId) {
        let id = this.$route.params.formId
        let formDetail = await getFormDetailAPI(id)
        this.flushFormData(formDetail)
      }
    },
    rename () {
      this.$prompt('修改名称', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputPlaceholder: '',
        inputErrorMessage: '表单名称不能为空'
      }).then(({ value }) => {
        this.formName = value
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    async saveForm () {
      if (this.mode === 'addForm') {
        let saveRes = await addFormAPI(this.saveParams)
        this.flushFormData(saveRes)
      } else if (this.mode === 'editForm') {
        let saveRes = await updateFormAPI(this.saveParams)
        this.flushFormData(saveRes)
      }
    },
    handleCloneWidget (e) {
      const target = /simple/.test(e.target.className) ? this.baseWidget : this.complexWidget
      const widget = target[e.oldIndex]
      const replace = {
        label: widget.label,
        desc: '',
        required: false,
        widget: {
          id: +new Date(),
          type: widget.id,
          items: []
        }
      }
      this.initFormItem(replace)
      this.formData.splice(e.newIndex, 1, replace)
    },
    // 初始化添加控件的时候初始化该控件属性
    initFormItem (item) {
      let whiteList = [INPUT, TEXTAREA, EMAIL, PHONE, DATE]
      let widget = item.widget
      if (whiteList.includes(widget.type)) return
      // this.$set(widget, 'items', [])
      widget.items = [
        {
          label: '选项1',
          value: '选项1'
        },
        {
          label: '选项2',
          value: '选项2'
        },
        {
          label: '选项3',
          value: '选项3'
        }
      ]
      if (widget.type === PHONE) {
        widget.validator = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
      }
      if (widget.type === EMAIL) {
        widget.validator = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      }
    },
    changeFormItemOrder (e) {
      this.formData.forEach((_, i) => {
        _.index = i
      })
    },
    handleSelectFormItem (formItem) {
      this.currentSelect = formItem.widget.id
    },
    handleDeleteFormItem (formItem) {
      const index = this.formData.findIndex(_ => _.widget.id === formItem.widget.id)
      if (index > -1) {
        this.formData.splice(index, 1)
      }
    },
    setWidget (more) {
      function packObj (source, obj) {
        let keys = Object.keys(obj)
        keys.forEach(k => {
          if (!source[k] || typeof source[k] !== 'object') {
            // source[k] = obj[k]
            this.$set(source, k, obj[k])
          } else if (typeof source[k] === 'object') {
            packObj.call(this, source[k], obj[k])
          }
        })
      }
      let pre = this.formData.filter(_ => _.widget && _.widget.id === this.currentSelect)[0]
      packObj.call(this, pre, more)
    },
    goView () {
      let formData = JSON.stringify(this.formData)
      localStorage.setItem('viewForm', formData)
      const { href } = this.$router.resolve({ name: 'viewForm' })
      window.open(href, '_blank')
    },
    goFormData () {
      this.$router.push({ name: 'formData', param: { appId: 1, formId: 2 } })
    },
    handleClosePublish (done) {
      done()
    },
    handleCancelPublish () {
      let el = this.$refs.structTree
      let structs = el.getCheckedKeys()
      el.setCheckedNodes(structs)
      this.publishVisiable = false
      this.endTime = ''
    },
    async handleConfirmPublish () {
      let el = this.$refs.structTree
      this.authArr = el.getCheckedKeys()
      if (this.mode === 'addForm') {
        let saveRes = await addFormAPI(this.saveParams)
        this.flushFormData(saveRes)
      } else {
        let updateRes = await updateFormAPI(this.saveParams)
        this.flushFormData(updateRes)
      }
      this.publishVisiable = false
    },
    flushFormData ({ data }) {
      this.formName = data.name
      this.formId = data.id
      this.endTime = data.endTime
      this.authArr = data.authArr.split(',')
      this.formData = JSON.parse(data.data)
    }
  }
}
</script>

<style lang="scss">
.editform {
  height: 100%;
  position: relative;
  &-head {
    height: 60px;
    line-height: 60px;
    position: relative;
    z-index: 3;
    padding: 0 20px;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    background: #fff;
    box-shadow: 0 2px 5px 0 hsla(0,0%,39%,.15);
    display: flex;
    justify-content: space-between;
    &-mid {
      display: flex;
      font-size: 16px;
      font-weight: normal;
      .editform-head-form {
        margin-right: 10px;
        border-bottom: solid 4px #409EFF;
        color: #409EFF;
      }
      .editform-head-form,
      .editform-head-data {
        cursor: pointer;
      }
    }
    .icon-avatar {
      font-size: 30px;
    }
    .el-icon-arrow-left {
      font-size: 20px;
      font-weight: bold;
      margin-right: 10px;
      cursor: pointer;
    }
    .el-icon-edit {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  &-aside {
    box-sizing: border-box;
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    width: 250px;
    padding: 8px 0;
    background: #fff;
    border-right: 1px solid #e0e0e0;
    &-items {
      .editform-aside-itemtitle {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
    &-block {
      padding: 0 10px 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .editform-aside-item-label {
        box-sizing: border-box;
        width: 49%;
        height: 26px;
        margin-bottom: 5px;
        line-height: 26px;
        color: #333;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px;
        background: rgb(244, 246, 252);
        cursor: pointer;
        .iconfont {
          color: #749FD1;
          margin-right: 6px;
          margin-left: 8px;
          font-size: 14px;
        }
      }
    }
  }
  &-param {
    box-sizing: border-box;
    position: absolute;
    top: 60px;
    bottom: 0;
    right: 0;
    width: 300px;
    background: #fff;
    border-left: 1px solid #e0e0e0;
    &-title {
      height: 45px;
      line-height: 28px;
      font-size: 14px;
      color: #333;
      border-bottom: solid 1px #e0e0e0;
      padding: 8px 0;
      text-align: center;
    }
  }
  &-form {
    box-sizing: border-box;
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 250px;
    right: 300px;
    background: #fff;
    &-operate {
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      border-bottom: solid 1px #e0e0e0;
      padding: 8px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .view-form {
        font-size: 14px;
        color: #409EFF;
        cursor: pointer;
        .el-icon-view {
          margin-right: 5px;
          color: #409EFF;
          font-size: 16px;
        }
      }
      .el-button {
        padding: 0;
        width: 80px;
        height: 30px;
        margin-left: 20px;
      }
      .publish-btn {
        margin-right: 20px;
      }
    }
    &-content {
      position: absolute;
      top: 45px;
      bottom: 0;
      left: 0;
      right: 0;
      .editform-form-emptyitem {
        height: 35px;
        border-top: 1px dashed #4388de;
        border-bottom: 1px dashed #4388de;
      }
    }
  }
  .el-dialog {
    border-radius: 10px;
    &__header {
      height:49px;
      padding: 0 14px;
      line-height: 49px;
      background:#2d353c;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__title {
      color: #fff;
      font-size:16px;
    }
    &__headerbtn {
      width:26px;
      height:26px;
      position: inherit;
      border-radius: 13px;
      background:#fff;
      .el-dialog__close {
        color: #2d353c;
        font-weight: bold;
      }
    }
    .end-time {
      margin: 20px 0;
    }
  }
  .el-tree {
    height: 300px;
    overflow: scroll;
  }
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius:4px;
    background-color: #909399;
  }
}
</style>
