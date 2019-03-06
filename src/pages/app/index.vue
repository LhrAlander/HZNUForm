<template lang="pug">
.apps
  f-header
  .apps-wrapper
    .app-item(v-for="app in apps" :key="app.id" :data-name="app.name" @click="goApp(app)")
      .app-item-bar(:style="{ background: app.color }")
      .app-item-icon
        i.iconfont(:class="'icon-app' + app.icon" :style="{ color: app.color }")
      .app-item-set
        i.el-icon-delete(@click.stop="handleDelApp(app)")
        el-popover(
          popper-class="app-style-set"
          width="280"
          trigger="click")
          .app-item-stylecolor
            .app-color-item(v-for="c in colors" :key="c" :style="{ background: c }" @click="changeColor(app, c)")
          .app-item-styleicon
            .app-icon-item(v-for="iconIndex in 10" :key="iconIndex" :style="{ background: app.color }" @click="changeIcon(app, iconIndex)")
              i.iconfont(:class="'icon-app'+iconIndex")
          i.iconfont.icon-shezhi(slot="reference" @click.stop="")
        //- i.iconfont.icon-fuzhi(title="复制应用" @click.stop="handleCopyApp(app)")
        el-popover(
          trigger="click"
          popper-class="app-name-set"
          v-model="app.nameVisible"
          width="230")
          el-input(v-model="app.name")
          //- .btn-group
          //-   el-button(@click="app.nameVisible = false") 取消
          //-   el-button(type="primary" @click="app.nameVisible = false") 确定
          i.el-icon-edit(slot="reference" title="修改名称" @click.stop="app.nameVisible = true")
    .app-item.add(data-name="新建应用" @click="handleAddApp") +
</template>

<script>
import FHeader from 'components/Fheader'

export default {
  components: {
    FHeader
  },
  data () {
    return {
      colors: ['#f96d64', '#f5c547', '#52ce87', '#4ec2e9', '#5d9cee', '#ac92ec'],
      apps: [
        {
          id: 1,
          name: '测试',
          icon: 1,
          color: '#f96d64',
          nameVisible: false
        },
        {
          id: 2,
          name: '项目管理',
          icon: 2,
          color: '#f5c547',
          nameVisible: false
        }
      ],
      test: '测试',
      changeNamePop: false,
      visible2: true
    }
  },
  methods: {
    changeColor (app, color) {
      console.log(app, color)
      app.color = color
    },
    changeIcon (app, index) {
      app.icon = index
    },
    handleAddApp (app) {
      this.$prompt('应用名称', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputPlaceholder: '',
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
      }).catch(() => {
      })
    },
    handleDelApp (app) {
      this.$confirm('表单、报表以及数据将一并删除，且无法还原。', `您确定要删除“${app.name}”吗?`, {
        type: 'error'
      })
        .then(() => {
          this.$message({
            message: '应用已删除',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message('取消删除')
        })
    },
    goApp (app) {
      this.$router.push({ name: 'editApp', params: { id: app.id } })
    }
  }
}
</script>

<style lang="scss">
.apps {
  .apps-wrapper {
    width: 80%;
    margin: 80px auto 0;
    display: flex;
    flex-wrap: wrap;
  }
  .app-item {
    width: 300px;
    height: 180px;
    background: #fff;
    margin: 30px 35px;
    position: relative;
    cursor: pointer;
    &.add {
      font-weight: normal;
      font-size: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &::after {
      content: attr(data-name);
      color: #333;
      font-size: 14px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 180%);
    }
    &-bar {
      height: 10px;
    }
    &-icon {
      text-align: center;
      line-height: 150px;
      .iconfont {
        font-size: 50px;
      }
    }
    &-set {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: #0DB3A6;
      font-size: 22px;
      color: #fff;
      line-height: 50px;
      padding: 0 10px;
      .icon-shezhi,
      .icon-fuzhi,
      .el-icon-edit {
        float: right;
        font-size: 25px;
        margin-left: 10px;
        line-height: 50px;
      }
    }
  }
}
.app-style-set {
  .app-item-stylecolor {
    padding-bottom: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
  }
  .app-item-styleicon {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .app-icon-item {
      width: 48px;
      height: 46px;
      margin-bottom: 3px;
      text-align: center;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
        line-height: 45px;
        color: #fff;
      }
    }
  }
  .app-color-item {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
.app-name-set {
  .btn-group {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 110px;
      height: 36px;
      padding: 0;
      line-height: 36px;
      text-align: center;
    }
  }
}
</style>
