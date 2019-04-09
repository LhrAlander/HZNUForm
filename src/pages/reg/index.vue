<template lang="pug">
.g-reg
  .g-reg-box
    .reg-info
      .hznu-logo
      .hznu-title 注册
      span.reg-tip 已有账号？
      span.reg-ref(@click="goLogin") 登录
      el-form(:model="regForm", :rules="rules", ref="regForm", label-position="left", label-width="0px")
        el-form-item(prop="name")
          el-input(type="text", v-model="regForm.name" class="reg-box-input")
            template(slot="prefix") 昵称
        el-form-item(prop="phone")
          el-input(type="text", v-model="regForm.phone" class="reg-box-input")
            template(slot="prefix") 手机
        el-form-item.reg-box-pwd(prop="checkPass")
          el-input(type="password", v-model="regForm.checkPass", class="reg-box-input")
            template(slot="prefix") 密码
        el-form-item(class="reg-box-submit")
          el-button(
            type="primary"
            :loading="reging"
            :disabled="submitDisabled"
            size="small"
            @click.native.prevent="handleSubmit") 注册
    .reg-bg
</template>

<script>
import { regAPI } from '@/api/index'
import { saveLoginInfo } from '@/utils/storage.js'

export default {
  data () {
    return {
      reging: false,
      showError: false,
      regForm: {
        name: '',
        checkPass: '',
        phone: ''
      },
      rules: {
        phone: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        name: [
          { required: true, message: ' ', trigger: 'blur' }
        ]
      }
    }
  },
   computed: {
    submitDisabled () {
      return this.regForm.account === '' || this.regForm.checkPass === ''
    }
  },
  mounted () {
    console.log(this.$route, this.$router)
  },
  methods: {
    goLogin () {
      this.$router.push({ name: 'login' })
    },
    async handleSubmit (e) {
      try {
        let user = {
          email: '',
          password: this.regForm.checkPass,
          phone: this.regForm.phone,
          username: this.regForm.name
        }
        let userInfo = await regAPI(user)
        saveLoginInfo(userInfo)
        this.$router.push({ name: 'contact' })
        console.log(regRes)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.g-reg {
  height: 100%;
  box-sizing: border-box;
  padding: 30px 50px;
  position: relative;
  background: url("~@/assets/image/loginBg.png") no-repeat;
  // background: url("~@/assets/image/hznu03.jpg") no-repeat;
  background-size: 100% 100%;
  &-box {
    width: 920px;
    height: 570px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background:#fff;
    box-shadow:0 16px 34px 0 rgba(199,199,199,0.56);
    border-radius:10px;
    display: flex;
    .reg-info,
    .reg-bg {
      width: 50%;
      height: 100%;
      box-sizing: border-box;
    }
    .reg-info {
      padding: 30px 50px 0 50px;
      .hznu-logo {
        width: 70px;
        height: 70px;
        background: url("~@/assets/image/hznulogo.png");
        background-size: 100% 100%;
      }
      .reg-tip {
        font-size: 12px;
        color: #777;
      }
      .reg-ref {
        font-size: 12px;
        color: #478cff;
        cursor: pointer;
      }
      .hznu-title {
        margin-top: 54px;
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: bold;
        color: #171c20;
        letter-spacing: 0.44px;
        .sub-title {
          font-size: 12px;
          color: #8a92a5;
          font-weight: normal;
          margin-top: 10px;
        }
      }
      .el-form {
        margin-top: 25px;
      }
      .el-input {
        &__inner {
          border: none;
          border-bottom: 1px solid;
          border-radius: 0;
          border-color: #d3dae5;
          padding-left: 50px;
          color: #171c20;
          font-size: 12px;
          background-color: transparent;
        }
      }
      .reg-box-pwd {
        margin-bottom: 5px;
      }
      .reg-box-checkbox {
        margin-bottom: 50px;
        .err-tip {
          font-size: 12px;
          color: #ff4747;
          float: right;
        }
        .el-checkbox {
          &__label {
            color: #8a92a5;
            font-size: 12px;
          }
        }
      }
      .reg-box-submit {
        .el-button {
          width: 188px;
          height: 44px;
          margin-top: 25px;
          border-radius: 6px;
          line-height: 44px;
          padding: 0;
          font-size: 16px;
          background: #338af6;
          &.is-disabled:hover {
            background: #338af6;
          }
          span {
            letter-spacing: 5px;
          }
        }
      }
    }
    .reg-bg {
      border-radius: 0 10px 10px 0;
      background: url("~@/assets/image/hznu01.jpg");
      background-position: 60%;
      background-size: auto 100%;
    }
  }
}
</style>
