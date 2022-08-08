import '@/assets/css/all.css'// 设置全局样式
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// import SuperFlow from 'vue-super-flow'
// import 'vue-super-flow/lib/index.css'
import { getConfig, getLocalConfig } from './utils/utils'

// Vue.use(SuperFlow)
Vue.prototype.$http = axios
Vue.use(Element)
Vue.config.productionTip = false

// 请求公共封装ip地址
const startApp = function () {
  if (process.env.VUE_APP_CONFIG === undefined) { // 本地环境配置
    Vue.prototype.$config = getLocalConfig()
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  } else { // dev/prod配置
    axios.get(`/${process.env.VUE_APP_CONFIG}.json`)
      .then((res) => {
        // 基础地址
        Vue.prototype.$config = getConfig(res.data)
        new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

startApp()
