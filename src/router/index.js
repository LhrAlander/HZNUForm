import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/pages/login')
const Reg = () => import('@/pages/reg')
const Contact = () => import('@/pages/contact')
const App = () => import('@/pages/app')
const EditApp = () => import('@/pages/app/editApp')
const EditForm = () => import('@/pages/form/editForm')
const ViewForm = () => import('@/pages/form/viewForm')
const FormData = () => import('@/pages/form/formData')

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
    path: '/contact',
    name: 'contact',
    component: Contact
  },
  {
    path: '/app',
    name: 'app',
    component: App
  },
  {
    path: '/edit/app/:id',
    name: 'editApp',
    component: EditApp
  },
  {
    path: '/view/app/:id',
    name: 'viewApp',
    component: EditApp
  },
  {
    path: '/edit/form/:appId/:groupId/:formId',
    name: 'editForm',
    component: EditForm
  },
  {
    path: '/add/form/:appId',
    name: 'addForm',
    component: EditForm
  },
  {
    path: '/view/form',
    name: 'viewForm',
    component: ViewForm
  },
  {
    path: '/submit/form/:id',
    name: 'submitForm',
    component: ViewForm
  },
  {
    path: '/form/data/:appId/:groupId/:formId',
    name: 'formData',
    component: FormData
  },
  {
    path: '*',
    component: Login
  }
]

export default new Router({
  routes: publicRouters
})
