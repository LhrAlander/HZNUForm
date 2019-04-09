<template lang="pug">
.avatar
  el-dropdown(@command="handleCommand")
    i.iconfont.icon-avatar
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(command="team") 切换团队
      el-dropdown-item(command="info") 修改信息
      el-dropdown-item(command="logout") 退出系统
  el-dialog(
    title="选择团队"
    width="300px"
    custom-class="avatar"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="teamDialog")
    .team-item(v-for="t in teams" :key="t.creator" :class="{active:t.creator===team.creator}" @click="changeTeam(t)") {{ t.name }}
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
import { getLoginUser, logout } from '@/utils/storage.js'
import {
  getTeamsAPI,
  editAPI
} from '@/api/index.js'

export default {
  data () {
    return {
      team: {},
      teams: [],
      teamDialog: false,
      infoDialog: false,
      name: '',
      email: '',
      phone: ''
    }
  },
  mounted () {
    this.initInfo()
  },
  methods: {
    async initInfo () {
      let user = getLoginUser()
      this.name = user.username
      this.email = user.email
      this.phone = user.phone
      let teams = await getTeamsAPI()
      this.teams.push({
        creator: this.phone,
        name: this.name
      })
      teams.data.forEach(t => {
        this.teams.push(t)
      })
      let currentTeam = JSON.parse(localStorage.getItem('currentTeam'))
      this.team = currentTeam || this.teams[0]
      localStorage.setItem('currentTeam', JSON.stringify(this.team))
    },
    handleCommand (command) {
      if (command === 'team') {
        this.teamDialog = true
      } else if (command === 'logout') {
        logout()
        this.$router.push({ name: 'login' })
      } else {
        this.infoDialog = true
      }
    },
    changeTeam (t) {
      localStorage.setItem('currentTeam', JSON.stringify(t))
      this.team = t
      this.teamDialog = false
      this.$emit('changeTeam')
    },
    cancelChangeInfo () {
      this.infoDialog = false
      this.initInfo()
    },
    async confirmChangeInfo () {
      let a = {
        email: this.email || '',
        phone: this.phone,
        username: this.name
      }
      await editAPI(a)
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
