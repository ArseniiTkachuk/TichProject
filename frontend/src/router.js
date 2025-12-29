import { createRouter, createWebHashHistory } from 'vue-router'

import Register from './pages/register.vue' //сторінка реєстрації
import Login from './pages/login.vue' // сторінка входу

import Test from './pages/test.vue' // сторінка проходження тесту

import Home from './pages/home.vue' // головна сторінка
import AuthHome from './pages/authHome.vue' // сторінка профілю

import CreateTest from './pages/createTest.vue' // сторінка створення тесну 
import LoockTest from './pages/loockTest.vue'
import EditProfile from './pages/editProfile.vue'
import EditTest from './pages/editTest.vue'
import StudentTestResult from './pages/studentTestResult.vue'

import testMsg from './pages/Tests/testMsg.vue'

const routes = [

  {
    path: '/testMsg',
    name: 'TestMsg',
    component: testMsg,
    meta: { gradientBg: true }
  },

  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { gradientBg: false }
  },

  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { gradientBg: false }
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { gradientBg: false }
  },

  {
    path: '/home',
    name: 'AuthHome',
    component: AuthHome,
    meta: { gradientBg: true }
  },

  {
    path: '/test/:id',
    name: 'Test',
    component: Test,
    meta: { gradientBg: true }
  },

  {
    path: '/createTest',
    name: 'CreateTest',
    component: CreateTest,
    meta: { gradientBg: true }
  },

  {
    path: '/editTest/:id',
    name: 'EditTest',
    component: EditTest,
    meta: { gradientBg: true }
  },

  {
    path: '/loockTest/:id',
    name: 'LoockTest',
    component: LoockTest,
    meta: { gradientBg: true }
  },

  {
    path: '/editProfile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { gradientBg: true }
  },

  {
    path: '/test/:id/result/:slug',
    name: 'StudentTestResult',
    component: StudentTestResult,
    meta: { gradientBg: true }
  }

]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})



// Перевірка авторизації перед кожним переходом
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("tokenAuthTeacher")

  const publicPages = ['Home', 'Register', 'Login', 'Test']
  const authRequired = !publicPages.includes(to.name)

  if (authRequired && !token) {
    alert("Спочатку авторизуйтеся")
    return next({ name: 'Register' })
  }

  next()
})


export default router
