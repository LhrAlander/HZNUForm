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
      draggable.editform-aside-block(v-model="baseWidget" :options="widgetDragOp" @end="handleCloneWidget")
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
    draggable.editform-form-content(v-model="formData" :options="formItemDragOp" @end="changeFormItemOrder")
      form-item(
        v-for="(formItem, index) in formData"
        :key="index"
        :info="formItem")
  .editform-param
</template>

<script>
import {
  INPUT,
  TEXTAREA,
  NUMBER,
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

export default {
  components: {
    draggable,
    FormItem
  },
  data () {
    return {
      baseWidget: [
        {
          label: '单行文本',
          id: INPUT,
          icon: 'wenben'
        },
        {
          label: '多行文本',
          id: TEXTAREA,
          icon: 'wenben'
        },
        {
          label: '数字',
          id: NUMBER,
          icon: 'shuzi'
        },
        {
          label: '单选按钮',
          id: RADIO,
          icon: 'danxuan'
        },
        {
          label: '多选框',
          id: CHECKBOX,
          icon: 'duoxuan'
        },
        {
          label: '下拉菜单',
          id: SELECT,
          icon: 'xiala'
        },
        {
          label: '日期',
          id: DATE,
          icon: 'riqi'
        }
      ],
      complexWidget: [
        {
          label: '地址',
          id: ADDRESS,
          icon: 'dizhi'
        },
        {
          label: '手机',
          id: PHONE,
          icon: 'shouji'
        },
        {
          label: '邮箱',
          id: EMAIL,
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
      }
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
      console.log('clone', e)
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.formData.forEach((_, i) => {
        _.index = i
        if (!_.widget) {
          _.widget = {
            type: _.id,
            id: +new Date()
          }
          delete _.icon
        }
      })
    },
    changeFormItemOrder (e) {
      this.formData.forEach((_, i) => {
        _.index = i
      })
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
    border-right: 1px solid #e0e0e0;
    background: #fff;
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
    border-left: 1px solid #e0e0e0;
    background: #fff;
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
