<template>
  <div class="login">
    <el-card class="box-card">
      <h1>Login</h1>
      <el-form ref="form" label-width="80px">
        <el-form-item label="账 号:">
          <el-input v-model="loginInfo.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密 码:">
          <el-input v-model="loginInfo.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-button @click="login()">登陆</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { AES_ENCRYPT } from '@/utils/utils'
export default {
  data () {
    return {
      loginInfo: {
        username: '',
        password: ''
      }
    }
  },
  mounted () {
    // 登录页阻止回退
    sessionStorage.clear()
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate',
      function () {
        history.pushState(null, null, document.URL)
      },
      false
    )
  },
  methods: {
    login () {
      this.$http.post('/api/user/login', {
        username: this.loginInfo.username,
        password: AES_ENCRYPT(this.loginInfo.password)
      }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          if (data.status === true) {
            this.$message({
              message: data.message,
              type: data.status === true ? 'success' : 'warning'
            })
            this.$store.commit('setIsLogin', data.status)
            this.$store.commit('setUsername', this.loginInfo.username)
            // 获取用户信息
            this.getUserMenu()
          } else {
            this.$message({
              message: data.message,
              type: data.status === true ? 'success' : 'warning'
            })
          }
        }
      })
    },
    getUserMenu () {
      this.$http.post('/api/user/getUserMenu', {
        username: this.loginInfo.username
      }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$store.commit('setMenuList', data.menu_json)
          // 跳转页面
          this.$router.push({ path: '/main' })
        }
      })
    }
  }
}
</script>
<style scoped>
.box-card {
  width: 400px;
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -150px 0 0 -150px;
}
</style>
