<template lang="pug">
.editform
  .editform-head
    .editform-head-left
      .editform-head-left-goback
        i.el-icon-arrow-left(@click="goback")
        span.app-name 立项表单
        i.el-icon-edit(@click="rename")
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
        el-button.save-btn(type="primary") 保存
      .publish-form
        el-button.publish-btn(type="success") 发布
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

export default {
  components: {
    draggable,
    FormItem,
    WidgetSet
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
      currentSelect: -1
    }
  },
  computed: {
    selectedWidget () {
      let resArr = this.formData.filter(_ => _.widget && _.widget.id === this.currentSelect)
      if (resArr.length) return resArr[0]
      return null
    }
  },
  methods: {
    goback () {
      this.$router.push({ name: 'editApp', params: { id: 1 } })
    },
    rename () {
      this.$prompt('修改名称', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputPlaceholder: '',
        inputErrorMessage: '表单名称不能为空'
      }).then(({ value }) => {
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
}
</style>
