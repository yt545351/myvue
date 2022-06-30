<template>
  <el-container style="height: 100%">
    <!-- 左侧菜单 -->
    <el-aside width="initial" style="background: #545c64; height: 100%">
      <el-menu @select="handleSelect" :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
        <div style="height: 50px; text-align: center; line-height: 50px">
          <span style="color: #ffd04b">{{ name }}</span>
        </div>
        <el-menu-item v-for="menu in menuList" :key="menu.route" :index="menu.route" v-show="menu.show">
          <i :class="menuIconMap[menu.route]"></i>
          <span slot="title">{{ menu.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头栏 -->
      <el-header>
        <el-card class="box-card" style="margin: 5px">
          <el-breadcrumb separator="">
            <i :class="shrinkIcon" style="float: left" @click="isShrink()"></i>
            <el-breadcrumb-item>
              &nbsp;{{ activeMenuLabel }}
            </el-breadcrumb-item>
            <el-link style="float: right" @click="quit()">退出登陆</el-link>
            <Marquee :proclamation="proclamation"></Marquee>
          </el-breadcrumb>
        </el-card>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
          <el-card class="box-card" style="height: 100%; margin: 5px">
            <router-view></router-view>
          </el-card>
        </el-scrollbar>
      </el-main>
    </el-container>
    <!-- 公告dialog -->
    <el-dialog :title="proclamation.title" :visible.sync="showProclamation">
      <el-input style="border:0;resize: none;" v-model="proclamation.content" type="textarea"
        :autosize="{ minRows: 20, maxRows: 20 }" readonly auto-complete="off">
      </el-input>
    </el-dialog>
  </el-container>
</template>
<script>
import Marquee from '@/components/myMarquee'
export default {
  components: {
    Marquee
  },
  data () {
    return {
      name: 'My System',
      // 是否收缩菜单栏
      isCollapse: false,
      // 默认选中菜单
      activeMenu: '',
      // 默认选中菜单name
      activeMenuLabel: '首页',
      // 最新公告对象
      proclamation: {},
      // 是否打开公告dialog
      showProclamation: false,
      // 收缩菜单按钮图标
      shrinkIcon: 'el-icon-s-fold',
      // 菜单列表
      menuList: [],
      // 菜单图标
      menuIconMap: {
        '/home': 'el-icon-s-home',
        '/tabulation': 'el-icon-s-data',
        '/proclamation': 'el-icon-reading',
        '/chart': 'el-icon-picture-outline',
        '/system': 'el-icon-setting'
      }
    }
  },
  created () {
    // 刷新页面isLogin会清空
    // this.$store.state.User.isLogin

    // 刷新页面isLogin不会清空
    // sessionStorage.getItem("isLogin")

    // 获取isLogin,判断是否登陆
    const isLogin = sessionStorage.getItem('isLogin')

    if (isLogin === false || isLogin === null) {
      // false:跳转到login页面
      this.$router.push({ path: '/' })
    } else {
      // 获取选中的菜单
      const activeMenu = sessionStorage.getItem('activeMenu')
      // 判断选中菜单是否为 "" 或 null
      if (activeMenu !== '' && activeMenu != null) {
        // 赋值获取到的选中菜单
        this.activeMenu = activeMenu
      } else {
        // 默认选中home
        this.activeMenu = '/home'
      }

      // 获取用户的菜单列表，权限
      this.menuList = JSON.parse(sessionStorage.getItem('menuList'))
    }
  },
  mounted () {
    this.getConfig()
    this.queryOneProclamation()
  },
  methods: {
    getConfig () {
      // this.axios.get('/config/config-dev.json').then(res => {
      //   console.log(res)
      // })
    },
    // 是否收缩菜单栏
    isShrink () {
      this.isCollapse = this.isCollapse !== true
      this.shrinkIcon = this.shrinkIcon === 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
    // 选中菜单
    handleSelect (key) {
      this.menuList.forEach((menu) => {
        if (key === menu.route) {
          this.activeMenuLabel = menu.name
        }
      })
      this.activeMenu = key
      this.$store.commit('setActiveMenu', key)
    },
    // 退出登陆
    quit () {
      // 清空vuex中的用户数据
      this.$store.commit('setIsLogin', false)
      this.$store.commit('setUsername', '')
      this.$store.commit('setMenuList', {})
      this.$store.commit('setActiveMenu', '')
      this.$router.push({ path: '/' })
    },
    // 获取最新公告
    queryOneProclamation () {
      this.$http.post('/api/proclamation/getOne').then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.proclamation = data
        }
      })
    }
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 100%;
  height: 100%;
}
</style>
