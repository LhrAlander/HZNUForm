<template lang="pug">
.contact-members
  .contact-members-title 杭州国际服务工程学院
  .contact-members-operate
    .contact-members-addbtn.contact-operate-btn
      i.el-icon-plus
      |添加用户
    .contact-members-changebtn.contact-operate-btn
      i.el-icon-edit
      |调整分组
    .contact-members-delbtn.contact-operate-btn
      i.el-icon-delete
      |删除成员
    el-input.contact-members-search(
      v-model="searchTxt"
      suffix-icon="el-icon-search"
      placeholder="搜索成员")
  .contact-members-table
    el-table(:data="members" style="width: 100%" height="531")
      el-table-column(type="selection" width="55")
      el-table-column(prop="name" label="姓名")
      el-table-column(prop="phone" label="手机")
      el-table-column(prop="mail" label="邮箱")
</template>

<script>
export default {
  data () {
    return {
      searchTxt: '',
      members: [
        {
          name: '林海瑞',
          phone: '13588737694',
          mail: 'AlanderLt@163.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '林海瑞',
          phone: '13588737694',
          mail: 'AlanderLt@163.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        },
        {
          name: '姜晓红',
          phone: '13588737693',
          mail: '1147816814@qq.com'
        }
      ]
    }
  },
  methods: {
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
}
</style>
