<template lang="pug">
.editapp
  .editapp-head
    .editapp-head-left
      .editapp-head-left-goback
        i.el-icon-arrow-left(@click="goback")
        span.app-name {{ app.name || '' }}
    .editapp-head-right
      my-avatar
  .editapp-aside
    .editapp-aside-operate(v-if="canCreate")
      .editapp-aside-addgroup(v-if="!changeOrder" @click="handleAddGroup")
        i.iconfont.icon-xinjianfenzu
        |新建分组
      .editapp-aside-changeorder(v-if="!changeOrder" @click="changeOrder=true")
        i.iconfont.icon-tiaozhengshunxu
        |调整顺序
      .editapp-aside-saveorder(v-if="changeOrder" @click="handleSaveOrder")
        i.el-icon-check
        |完成调整
    .editapp-aside-list
      el-collapse
        draggable(v-model="groups"  @start="drag=true" @end="drag=false" :options="{ group:'group', disabled: !changeOrder }")
          el-collapse-item.editapp-aside-item(
            v-if="group.groupId !== 0"
            v-for="group in app.groups"
            :key="group.groupId")
            template(slot="title")
              i.iconfont.icon-wenjianjia
              |{{ group.name }}
            .editapp-group-operate
              .editapp-group-rename(@click="handleRenameGroup(group)")
                i.el-icon-edit
                |修改名称
              .editapp-group-delete(@click="handleDeleteGroup(group)")
                i.el-icon-delete
                |删除分组
            draggable(v-model="group.forms"  @start="drag=true" @end="drag=false" :options="{ group:'forms', disabled: !changeOrder }")
              .editapp-group-form(
                v-for="form in group.forms"
                :key="form.formId"
                @click="viewForm(group.groupId, form)")
                i.iconfont.icon-biaodan
                |{{ form.formName }}
                i.edit-icon.el-icon-edit(@click.stop="handleRenameForm(form)")
                i.edit-icon.el-icon-delete(@click.stop="handleDeleteForm(form)")
      draggable(v-model="unGroupForms"  @start="drag=true" @end="drag=false" :options="{ group:'forms', disabled: !changeOrder }")
        .editapp-ungroup-form(
          v-for="form in unGroupForms"
          :key="form.formId"
          @click.stop="viewForm(0, form)")
          i.iconfont.icon-biaodan
          |{{ form.formName }}
          i.edit-icon.el-icon-edit(v-if="canCreate" @click.stop="handleRenameForm(form)")
          i.edit-icon.el-icon-delete(v-if="canCreate" @click.stop="handleDeleteForm(form)")
  .editapp-content
    .editapp-add-wrapper
      .editapp-add-form(v-if="canCreate" @click="handleCreateForm")
        .editapp-add-icon.new-form
        .editapp-add-title 新建表单
        .editapp-add-message 表单可用来搜集数据，适合进行数据上报
    //- .editapp-set
    //-   el-button(type="primary" plain) 应用设置
</template>

<script>
import draggable from 'vuedraggable'
import MyAvatar from '@/components/Avatar'

import { getItem } from '@/utils/storage.js'

import {
  getAppsAPI,
  addAppGroupAPI,
  updateAppGroupAPI,
  deleteFormAPI,
  deleteAppGroupAPI,
  moveFormAPI
} from '@/api/index.js'

export default {
  components: {
    draggable,
    MyAvatar
  },
  data () {
    return {
      groups: [],
      changeOrder: false,
      app: {}
    }
  },
  computed: {
    unGroupForms: {
      get () {
        if (!this.app || !this.app.groups) return []
        let groups = this.app.groups.filter(_ => _.groupId === 0)
        if (!groups.length || !groups[0].forms) return []
        return groups[0].forms
      },
      set (v) {
        console.log(v)
        this.app.groups.filter(_ => _.groupId === 0)[0].forms = v
      }
    },
    canCreate () {
      return this.$route.name === 'editApp'
    }
  },
  mounted () {
    this.getCurrentApp()
  },
  methods: {
    async getCurrentApp () {
      let { creator } = getItem('currentTeam')
      let apps = await getAppsAPI(creator)
      this.flushAppData(apps)
    },
    goback () {
      this.$router.push({ name: 'app' })
    },
    viewForm (agid, form) {
      if (this.canCreate) {
        this.$router.push({ name: 'editForm', params: { appId: this.app.appId, groupId: agid, formId: form.formId } })
      } else {
        this.$router.push({ name: 'submitForm', params: { id: form.formId } })
      }
    },
    handleDeleteForm (form) {
      this.$confirm('删除将清空数据，且无法还原。', `您确定要删除“${form.formName}”吗?`, {
        type: 'error'
      })
        .then(() => {
          deleteFormAPI(form.formId)
            .then(res => {
              console.log(res)
              this.flushAppData(res)
              this.$message({
                message: '已删除',
                type: 'success'
              })
            })
        })
        .catch(() => {
          this.$message('取消删除')
        })
    },
    handleRenameForm (form) {
      this.$prompt('修改名称', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputPlaceholder: form.formName,
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        // updateAppGroupAPI({ name: value, appid: this.app.appId })
        //   .then(res => {
        //     console.log(res)
        //     this.$message({
        //       type: 'success',
        //       message: '修改成功'
        //     })
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    handleDeleteGroup (group) {
      this.$confirm(`您确定要删除“${group.name}”吗?`, {
        type: 'warning'
      })
        .then(() => {
          deleteAppGroupAPI(group.groupId)
            .then(res => {
              this.flushAppData(res)
              this.$message({
                message: '已删除',
                type: 'success'
              })
            })
        })
        .catch(() => {
          this.$message('取消删除')
        })
    },
    handleRenameGroup (group) {
      console.log(group)
      this.$prompt('修改名称', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputPlaceholder: group.name,
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        let params = {
          appid: this.app.appId,
          id: group.groupId,
          name: value
        }
        updateAppGroupAPI(params)
          .then(res => {
            console.log(res)
            this.flushAppData(res)
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    handleAddGroup () {
      this.$prompt('新建分组', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputPlaceholder: '请输入分组名称',
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        addAppGroupAPI({ name: value, appid: this.app.appId })
          .then(res => {
            this.flushAppData(res)
            this.$message({
              type: 'success',
              message: '新建成功'
            })
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新建'
        })
      })
    },
    handleSaveOrder () {
      let promiseArr = []
      this.app.groups.forEach(({ groupId, forms }) => {
        forms.forEach(({ formId }) => {
          console.log(groupId, formId)
          promiseArr.push(moveFormAPI({ groupId, formId }))
        })
      })
      Promise.all(promiseArr)
        .then(res => {
          console.log('rrr', res)
          this.changeOrder = false
        })
    },
    handleCreateForm () {
      this.$router.push({ name: 'addForm', params: { appId: this.$route.params.id } })
    },
    flushAppData ({ data }) {
      let appId = this.$route.params.id
      this.app = data.find(_ => parseInt(_.appId) === parseInt(appId))
    }
  }
}
</script>

<style lang="scss">
.editapp {
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
    .el-icon-arrow-left {
      font-size: 20px;
      font-weight: bold;
      margin-right: 10px;
      cursor: pointer;
    }
    .iconfont.icon-avatar {
      font-size: 30px;
    }
  }
  &-aside {
    width: 280px;
    position: relative;
    display: inline-block;
    z-index: 2;
    min-height: calc( 100% - 60px);
    background: #fff;
    border-right: 1px solid #e0e0e0;
    &-operate {
      display: flex;
    }
    &-addgroup,
    &-changeorder {
      width: 50%;
      height: 40px;
      position: relative;
      background: #f3f6fc;
      font-size: 14px;
      color: #737373;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      .iconfont {
        color: #178cdf;
        font-size: 18px;
        margin-right: 5px;
      }
      &:hover {
        color: #178cdf;
      }
    }
    &-saveorder {
      height: 40px;
      width: 100%;
      line-height: 40px;
      text-align: center;
      color: #333;
      cursor: pointer;
      .el-icon-check {
        color: #178cdf;
        margin-right: 10px;
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 1px solid #178cdf;
        border-radius: 50%;
        text-align: center;
        line-height: 18px;
      }
    }
    &-addgroup::after {
      content: '';
      position: absolute;
      display: block;
      width: 2px;
      height: 18px;
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
      background: #d9e0e7;
    }
    &-item {
      padding: 0 20px;
      font-size: 14px;
      position: relative;
      .iconfont {
        color: #409EFF;
        margin-right: 10px;
      }
    }
    .editapp-group-form,
    .editapp-ungroup-form {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      color: #333;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      &:hover .edit-icon {
        display: block;
      }
      .edit-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        display: none;
      }
      .el-icon-edit {
        right: 25px
      }
      .el-icon-delete {
        color: #d84636;
        right: 0;
      }
      .icon-biaodan {
        color: #5DA0CC;
      }
      .icon-baobiao {
        color: #7EC29C;
      }
    }
    .editapp-group-operate {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      font-size: 15px;
      .editapp-group-rename,
      .editapp-group-delete {
        width: 100%;
        text-align: center;
        cursor: pointer;
        .el-icon-edit,
        .el-icon-delete {
          margin-right: 4px;
        }
      }
      .editapp-group-delete {
        color: #d84636;
      }
    }
    .editapp-ungroup-form {
      .icon-biaodan {
        margin-right: 10px;
      }
      .icon-baobiao {
        margin-right: 10px;
      }
      .el-icon-edit {
        right: 45px
      }
      .el-icon-delete {
        right: 20px;
      }
    }
  }
  &-content {
    position: absolute;
    background: #fff;
    left: 280px;
    right: 0;
    top: 60px;
    bottom: 0;
    .editapp-add-wrapper {
      margin: 40px auto;
      text-align: center;
      .editapp-add-form,
      .editapp-add-report {
        width: 220px;
        height: 260px;
        margin: 10px;
        display: inline-block;
        vertical-align: middle;
        background: #F8FAF9;
        cursor: pointer;
      }
      .editapp-add-icon {
        margin: 60px auto 30px;
        width: 56px;
        height: 68px;
        background-repeat: no-repeat;
        background: url("~@/assets/image/createIcons.png");
        background-size: 56px 272px;
        &.new-form {
          background-position: 0 0;
        }
        &.new-report {
          background-position: 0 -136px;
        }
      }
      .editapp-add-title {
        margin: 40px 0 15px;
        font-size: 16px;
      }
      .editapp-add-message {
        padding: 0 20px;
        font-size: 12px;
        color: #989898;
        text-align: left;
      }
    }
    .editapp-set {
      max-width: 840px;
      border-top: solid 1px #ECECEC;
      margin: auto;
      text-align: center;
      .el-button {
        margin-top: 60px;
        line-height: 45px;
        width: 150px;
        font-size: 16px;
        padding: 0;
      }
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
