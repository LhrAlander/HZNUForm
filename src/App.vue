<template lang="pug">
#app
  router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "~normalize.css";
@import "./assets/fonts/iconfont.css";
@import "./assets/scss/common.scss";
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  min-width: 1600px;
  min-height: 800px;
  font-family: "Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#app {
  height: 100%;
  // font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #d9e0e7;
}
</style>
