import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/pages/login')
const Reg = () => import('@/pages/reg')

Vue.use(Router)

// 公共路由
export const publicRouters = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg
  },
  {
    path: '/test',
    component: Login
  },
  {
    path: '*',
    component: Login
  }
]

export default new Router({
  routes: publicRouters
})
