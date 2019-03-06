<template lang="pug">
.contact-overview
  .contact-overview-item(
    v-for="struct in structs"
    :key="struct.id")
    .contact-item-name(:style="{ 'background-color': struct.color }") {{ struct.label[0] }}
    .contact-item-label(:title="struct.label") {{ struct.label }}
    .contact-item-operate
      .contact-operate-view(@click="handleViewClick(struct.id)" title="查看人员")
        i.el-icon-view
      .contact-operate-delete(@click="handleDeleteClick(struct.id)" title="删除分组")
        i.el-icon-delete
  .contact-overview-item.add-contact-item(@click="handleAddClick")
    .contact-item-name
      i.el-icon-plus
    .contact-item-label 新建分组
</template>

<script>
import { getContactsAPI, addContactAPI, delContactAPI } from '@/api/index.js'

const colors = ['#07689f', '#10ddc2', '#384259', '#393e46', '#1f4e5f', '#00adb5', '#284184', '#39065a']

export default {
  data () {
    return {
      structs: []
    }
  },
  mounted () {
    this.getContacts()
  },
  methods: {
    async getContacts () {
      try {
        let contacts = await getContactsAPI()
        this.flushStructData(contacts.data)
      } catch (error) {
        console.log(error)
      }
    },
    handleAddClick () {
      this.$prompt('', '新建分组', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        console.log(value)
        addContactAPI({ groupName: value })
          .then(res => {
            console.log(res)
            this.flushStructData(res.data)
            this.$message({
              type: 'success',
              message: `创建分组${value}成功`
            })
          })
          .catch(() => {
            this.$message.error('创建失败')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        })
      })
    },
    handleDeleteClick (id) {
      console.log('delete')
      this.$confirm('此操作将永久删除该分组, 是否继续?', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delContactAPI({ id })
          .then(delRes => {
            this.flushStructData(delRes.data)
            this.$message({
              type: 'success',
              message: `删除分组成功`
            })
          })
          .catch(() => {
            this.$message.error('删除失败')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    flushStructData (data) {
      this.structs = data.map(_ => {
        return {
          label: _.groupName,
          id: _.id,
          phone: _.phone,
          color: colors[_.id % 8]
        }
      })
    },
    handleViewClick (id) {
      this.$emit('viewMember', id)
    }
  }
}
</script>

<style lang="scss">
.contact-overview {
  width: 80%;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 180px;
    margin: 40px 50px;
    position: relative;
    cursor: pointer;
    &.add-contact-item {
      .contact-item-name {
        color: #f3f3f3;
        border: 3px dashed #f3f3f3;
        .el-icon-plus {
          font-size: 100px;
          line-height: 168px;
        }
      }
    }
    &:hover .contact-item-operate {
      height: 168px;
      background: rgba(0, 0, 0, 0.6);
    }
    .contact-item-operate {
      position: absolute;
      top: 0;
      left: 6px;
      width: 168px;
      height: 0;
      overflow: hidden;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0);
      transition: all 100ms;
      .contact-operate-view,
      .contact-operate-delete {
        width: 84px;
        height: 84px;
        font-size: 40px;
        margin: 0 auto;
        text-align: center;
        line-height: 84px;
        color: #fff;
      }
    }
    .contact-item-name {
      width: 168px;
      height: 168px;
      margin: 0 auto;
      border-radius: 50%;
      font-size: 60px;
      color: #fff;
      text-align: center;
      line-height: 168px;
    }
    .contact-item-label {
      font-size: 26px;
      margin-top: 12px;
      color: #303133;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}
</style>
