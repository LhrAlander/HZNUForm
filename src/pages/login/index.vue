<template lang="pug">
.g-login
  .g-login-box
    .login-info
      .hznu-logo
      .hznu-title 杭州师范大学云表单
        .sub-title HZNU FORM
          sup +
      el-form(:model="loginForm", :rules="rules", ref="loginForm", label-position="left", label-width="0px")
        el-form-item(prop="account")
          el-input(type="text", v-model="loginForm.account" class="login-box-input")
            template(slot="prefix") 账号
        el-form-item.login-box-pwd(prop="checkPass")
          el-input(type="password", v-model="loginForm.checkPass", class="login-box-input")
            template(slot="prefix") 密码
        el-form-item(class="login-box-checkbox")
          el-checkbox(v-model="loginForm.remember", checked, class="remember") 下次自动登录
          span.err-tip(v-if="!showError", class="login-box-error") 账号或密码错误
        el-form-item(class="login-box-submit")
          el-button(type="primary", :loading="logining", :disabled="submitDisabled", size="small", @click.native.prevent="handleSubmit") 登录
    .login-bg
</template>

<script>
export default {
  data () {
    return {
      logining: false,
      showError: false,
      loginForm: {
        account: '',
        checkPass: '',
        remember: true
      },
      rules: {
        account: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: ' ', trigger: 'blur' }
        ]
      }
    }
  },
   computed: {
    submitDisabled () {
      if (this.loginForm.account === '' || this.loginForm.checkPass === '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    handleSubmit (ev) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.logining = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.logining = false
            this.$router.push({ path: '/' })
          }).catch(({response}) => {
            this.logining = false
            if (response.data.code === 3400032) {
              this.$message.error('该用户已被冻结')
            } else {
              this.showError = true
            }
          })
        } else {
          this.showError = true
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.g-login {
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
    .login-info,
    .login-bg {
      width: 50%;
      height: 100%;
      box-sizing: border-box;
    }
    .login-info {
      padding: 30px 50px 0 50px;
      .hznu-logo {
        width: 70px;
        height: 70px;
        background: url("~@/assets/image/hznulogo.png");
        background-size: 100% 100%;
      }
      .hznu-title {
        margin-top: 54px;
        margin-bottom: 50px;
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
      .el-input {
        &__inner {
          border: none;
          border-bottom: 1px solid;
          border-radius: 0;
          border-color: #d3dae5;
          padding-left: 50px;
          color: #171c20;
          font-size: 12px;
        }
      }
      .login-box-pwd {
        margin-bottom: 5px;
      }
      .login-box-checkbox {
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
      .login-box-submit {
        .el-button {
          width: 188px;
          height: 44px;
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
    .login-bg {
      border-radius: 0 10px 10px 0;
      background: url("~@/assets/image/hznu01.jpg");
      background-position: 60%;
      background-size: auto 100%;
    }
  }
}
</style>
