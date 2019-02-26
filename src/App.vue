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
html,
body {
  height: 100%;
  min-width: 1600px;
  min-height: 800px;
}
#app {
  height: 100%;
  font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #d9e0e7;
}
</style>
