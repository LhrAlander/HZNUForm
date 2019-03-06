<template lang="pug">
.contact-members
  .contact-members-title 杭州国际服务工程学院
  .contact-members-operate
    .contact-members-goback(@click="$emit('goback')")
      i.el-icon-arrow-left
    .contact-members-addbtn.contact-operate-btn(@click="dialogVisible = true")
      i.el-icon-plus
      |添加用户
    .contact-members-changebtn.contact-operate-btn(@click="changeStructDialog = true")
      i.el-icon-edit
      |调整分组
    .contact-members-delbtn.contact-operate-btn(@click="handleDeleteMembers")
      i.el-icon-delete
      |删除成员
    el-input.contact-members-search(
      v-model="searchTxt"
      @input="handleFilterInput"
      suffix-icon="el-icon-search"
      placeholder="搜索成员")
  .contact-members-table
    el-table(
      :data="tableData"
      style="width: 100%"
      height="531"
      @selection-change="handleTableSelect")
      el-table-column(type="selection" width="55")
      el-table-column(prop="name" label="姓名")
      el-table-column(prop="phone" label="手机")
      el-table-column(prop="mail" label="邮箱")
  .contact-members-page
    el-pagination(
      layout="sizes, prev, pager, next"
      :total="members.length"
      :page-size="pageSize"
      :page-sizes="[10, 50, 100]"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange")
  el-dialog(
    title="添加成员"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleCloseAdd"
    :visible.sync="dialogVisible"
    width="30%")
    el-input(
      type="textarea"
      placeholder="输入手机号来邀请成员，多个成员之间使用逗号、分号或换行隔开"
      :rows="10"
      :autosize="{ minRows: 10, maxRows: 10}"
      v-model="memberPhones"
    )
    .contact-members-dialogbtn
      el-button(type="primary" @click="handleConfirmAdd") 添加成员
  el-dialog(
    title="调整分组"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="changeStructDialog"
    :before-close="handleCloseChange"
    width="300px")
    el-tree(
      :data="structs"
      show-checkbox
      node-key="id"
      ref="structTree"
    )
    .contact-struct-btns
      el-button.change-struct-btn(type="info" @click="handleCancelChange") 取消
      el-button.change-struct-btn(type="primary" @click="handleConfirmChange") 确定
</template>

<script>
import {
  getContactMembersAPI,
  addMemberBatchAPI,
  getContactsAPI,
  deleteMemberAPI
} from '@/api/index.js'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      searchTxt: '',
      members: [],
      filter: '',
      dialogVisible: false,
      changeStructDialog: false,
      memberPhones: '',
      currentSelections: {},
      pageSize: 10,
      currentPage: 1,
      filterTimer: null,
      structs: [],
      selection: []
    }
  },
  computed: {
    tableData () {
      const reg = new RegExp(this.filter)
      const source = this.filter !== ''
        ? this.members.filter(_ => {
          return Object.keys(_).some(k => {
            return reg.test(_[k])
          })
        })
        : this.members
      const start = this.pageSize * (this.currentPage - 1)
      const end = this.pageSize * this.currentPage
      return source.slice(start, end)
    }
  },
  mounted () {
    getContactsAPI()
      .then(res => {
        console.log(res)
        this.structs = res.data.map(_ => {
          return {
            label: _.groupName,
            id: _.id
          }
        }).filter(_ => _.id !== this.id)
      })
    this.getMembers()
  },
  methods: {
    async getMembers () {
      let members = await getContactMembersAPI(this.id)
      this.flushMembersData(members.data)
    },
    handleCloseAdd (done) {
      this.memberPhones = ''
      done()
      this.$message('取消添加')
    },
    handleCloseChange (done) {
      let el = this.$refs.structTree
      let structs = el.getCheckedKeys()
      el.setCheckedNodes(structs)
      done()
      this.$message('取消调整分组')
    },
    handleFilterInput (v) {
      if (this.filterTimer) {
        clearTimeout(this.filterTimer)
      }
      this.filterTimer = setTimeout(() => {
        this.filter = v.trim()
      }, 300)
    },
    async handleConfirmAdd () {
      let phones = this.memberPhones.split(/[\n\r,、，]/)
      this.dialogVisible = false
      this.memberPhones = ''
      let params = {
        cgIds: [this.id],
        id: this.id,
        members: phones
      }
      let users = await addMemberBatchAPI(params)
      this.flushMembersData(users.data)
      this.$message({
        message: '添加用户成功',
        type: 'success'
      })
    },
    handleTableSelect (selection) {
      this.selection = selection.map(_ => {
        return {
          phone: _.phone,
          id: _.id
        }
      })
    },
    handleCurrentPageChange (current) {
      this.currentPage = current
    },
    handlePageSizeChange (size) {
      this.pageSize = size
    },
    handleCancelChange () {
      let el = this.$refs.structTree
      let structs = el.getCheckedKeys()
      el.setCheckedNodes(structs)
      this.changeStructDialog = false
      this.$message('取消调整分组')
    },
    async handleConfirmChange () {
      let el = this.$refs.structTree
      let cgIds = el.getCheckedKeys()
      el.setCheckedNodes(cgIds)
      let params = {
        cgIds,
        id: this.id,
        members: this.selection.map(_ => _.phone)
      }
      let users = await addMemberBatchAPI(params)
      this.flushMembersData(users.data)
      this.changeStructDialog = false
      this.$message({
        message: '调整分组成功',
        type: 'success'
      })
    },
    async handleDeleteMembers () {
      this.$confirm('您确定要删除所选成员？', {
        type: 'error'
      })
        .then(async () => {
          let params = {
            id: this.id,
            memberIds: this.selection.map(_ => _.id)
          }
          let users = await deleteMemberAPI(params)
          this.flushMembersData(users.data)
          this.$message({
            message: '删除成员成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message('取消删除')
        })
    },
    flushMembersData (data) {
      this.members = data.map(_ => {
        return {
          name: _.name,
          id: _.id,
          phone: _.member,
          mail: _.email
        }
      })
    }
  }
}
</script>

<style lang="scss">
.contact-members {
  &-title {
    width: 1000px;
    margin: 40px auto 20px;
    font-size:22px;
    font-weight: bold;
    color:#1d2328;
  }
  &-operate {
    width: 1000px;
    margin: 0 auto 20px;
    display: flex;
    justify-content: space-between;
  }
  .contact-operate-btn {
    width: 177px;
    height: 40px;
    border-radius:4px;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    cursor: pointer;
    margin-right: 11px;
  }
  &-goback {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #222831;
    color: #fff;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    margin-right: 60px;
  }
  &-addbtn {
    background: #4388de;
    .el-icon-plus {
      margin-right: 10px;
    }
  }
  &-changebtn {
    background: #909399;
    .el-icon-edit {
      margin-right: 10px;
    }
  }
  &-delbtn {
    background: #F56C6C;
    .el-icon-delete {
      margin-right: 10px;
    }
  }
  &-search {
    width: 316px;
  }
  &-table {
    width: 1000px;
    margin: 0 auto;
    .el-table {
      border-radius: 4px;
      th {
        padding: 0;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #909399;
        background: #f3f3f3;
      }
      thead {
        height: 50px;
      }
    }
  }
  &-page {
    width: 1000px;
    margin: 25px auto;
    text-align: right;
    .el-pagination {
      padding-right: 0;
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
  }
  .el-tree {
    height: 300px;
    overflow: scroll;
  }
  textarea {
    resize: none;
  }
  &-dialogbtn {
    display: flex;
    justify-content: center;
  }
  .el-button {
    width: 500px;
    height: 46px;
    margin: 50px auto 20px;
  }
  .contact-struct-btns {
    text-align: right;
    .change-struct-btn {
      width: 60px;
      height: 40px;
      padding: 0;
      margin: 30px 0 0;
      & + .change-struct-btn {
        margin-left: 20px;
      }
    }
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
