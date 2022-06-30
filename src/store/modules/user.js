const user = {
  state: {
    isLogin: false,
    username: '',
    menuList: {},
    activeMenu: '',
    config: {}
  },
  mutations: {
    'setIsLogin' (state, isLogin) {
      sessionStorage.setItem('isLogin', isLogin)
      state.isLogin = isLogin
    },
    'setUsername' (state, username) {
      sessionStorage.setItem('username', username)
      state.username = username
    },
    'setMenuList' (state, menuList) {
      sessionStorage.setItem('menuList', menuList)
      state.menuList = menuList
    },
    'setActiveMenu' (state, activeMenu) {
      sessionStorage.setItem('activeMenu', activeMenu)
      state.activeMenu = activeMenu
    }
  }
}
export default user
