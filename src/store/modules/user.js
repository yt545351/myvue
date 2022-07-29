const user = {
  state: {
    isLogin: false,
    username: '',
    menuList: {},
    roleName: '',
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
    'setRoleName' (state, roleName) {
      sessionStorage.setItem('roleName', roleName)
      state.roleName = roleName
    },
    'setActiveMenu' (state, activeMenu) {
      sessionStorage.setItem('activeMenu', activeMenu)
      state.activeMenu = activeMenu
    }
  }
}
export default user
