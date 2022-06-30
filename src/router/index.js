import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/main_'
import Login from '@/views/login_'
import Activiti from '@/views/activiti/index_'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/activiti',
    name: 'Activiti',
    component: Activiti
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index_'),
        nameCN: '首页'
      },
      {
        path: '/tabulation',
        name: 'Tabulation',
        component: () => import('@/views/tabulation/index_'),
        nameCN: '表格'
      },
      {
        path: '/proclamation',
        name: 'Proclamation',
        component: () => import('@/views/proclamation/index_'),
        nameCN: '公告'
      },
      {
        path: '/chart',
        name: 'Chart',
        component: () => import('@/views/chart/index_'),
        nameCN: '图表'
      },
      {
        path: '/work',
        name: 'Work',
        component: () => import('@/views/work/index_'),
        nameCN: '工作流'
      },
      {
        path: '/system',
        name: 'System',
        component: () => import('@/views/system/index_'),
        nameCN: '系统'
      }
    ]

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
