<template lang="pug">
.avatar
  el-dropdown(@command="handleCommand")
    i.iconfont.icon-avatar
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(command="team") 切换团队
      el-dropdown-item(command="info") 修改信息
  el-dialog(
    title="选择团队"
    width="300px"
    custom-class="avatar"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="teamDialog")
    .team-item(v-for="t in teams" :key="t" :class="{active:t===team}" @click="changeTeam(t)") {{ t }}
  el-dialog(
    title="修改信息"
    :append-to-body="true"
    width="300px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="infoDialog")
    .info-input
      el-input(v-model="name")
        template(slot="prepend") 昵称
      el-input(v-model="email")
        template(slot="prepend") 邮箱
      .btn-group
        el-button(type="text" @click="cancelChangeInfo") 取消
        el-button(type="text" @click="confirmChangeInfo") 确定
</template>

<script>
export default {
  data () {
    return {
      team: '林海瑞',
      teams: ['林海瑞', '大大大'],
      teamDialog: false,
      infoDialog: false,
      name: '林海瑞',
      email: 'AlanderLt@163.com'
    }
  },
  mounted () {
    let team = localStorage.getItem('currentTeam')
    if (team) this.team = team
    this.initInfo()
  },
  methods: {
    initInfo () {
      this.name = '林海瑞'
      this.email = 'AlanderLt@163.com'
    },
    handleCommand (command) {
      if (command === 'team') {
        this.teamDialog = true
      } else {
        this.infoDialog = true
      }
    },
    changeTeam (t) {
      localStorage.setItem('currentTeam', t)
      this.team = t
      this.teamDialog = false
    },
    cancelChangeInfo () {
      this.infoDialog = false
      this.initInfo()
    },
    confirmChangeInfo () {
      this.infoDialog = false
      this.$message({ message: '修改成功', type: 'success' })
    }
  }
}
</script>

<style lang="scss">
.avatar.el-dialog {
  .team-item {
    margin: 20px 0;
    font-size: 26px;
    padding: 10px 5px;
    cursor: pointer;
    &.active {
      background-color: #EBF8FB;
      border-left: 5px solid #0DB3A6;
    }
  }
  .el-dialog__body {
    padding: 0 0 10px 0;
    .info-input {
      padding: 20px;
      .el-input {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
