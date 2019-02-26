<template lang="pug">
.contact-overview
  .contact-overview-item(
    v-for="struct in structs"
    :key="struct.label")
    .contact-item-name(:style="{ 'background-color': struct.color }") {{ struct.label[0] }}
    .contact-item-label(:title="struct.label") {{ struct.label }}
    .contact-item-operate
      .contact-operate-view(@click="handleViewClick" title="查看人员")
        i.el-icon-view
      .contact-operate-delete(@click="handleDeleteClick" title="删除分组")
        i.el-icon-delete
  .contact-overview-item.add-contact-item(@click="handleAddClick")
    .contact-item-name
      i.el-icon-plus
    .contact-item-label 新建分组
</template>

<script>
const colors = ['#07689f', '#10ddc2', '#384259', '#393e46', '#1f4e5f', '#00adb5', '#284184', '#39065a']

export default {
  data () {
    return {
      structs: [
        {
          label: '杭州国际服务工程学院',
          color: colors[0]
        },
        {
          label: '阿里巴巴商学院',
          color: colors[3]
        },
        {
          label: '理学院',
          color: colors[7]
        },
        {
          label: '后勤部门',
          color: colors[1]
        },
        {
          label: '教务处',
          color: colors[4]
        }
      ]
    }
  },
  methods: {
    handleAddClick () {
      this.$prompt('', '新建分组', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: `创建分组${value}成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        })
      })
    },
    handleDeleteClick () {
      console.log('delete')
      this.$confirm('此操作将永久删除该分组, 是否继续?', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleViewClick () {
      this.$emit('viewMember', { structId: 1 })
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
