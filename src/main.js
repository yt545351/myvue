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

// Vue.use(SuperFlow)
Vue.prototype.$http = axios
Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
