import { createRouter, createWebHashHistory } from 'vue-router'

import Register from './pages/register.vue' //сторінка реєстрації
import Login from './pages/login.vue' // сторінка входу

import Test from './pages/test.vue' // сторінка проходження тесту

import Home from './pages/home.vue' // головна сторінка
import AuthHome from './pages/authHome.vue' // сторінка профілю

import CreateTest from './pages/createTest.vue' // сторінка створення тесну 
import LoockTest from './pages/loockTest.vue'
import EditProfile from './pages/editProfile.vue'

const routes = [

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
    path: '/checkTest/:id',
    name: 'LoockTest',
    component: LoockTest,
    meta: { gradientBg: true }
  },

  {
    path: '/editProfile',
    name: 'EditProfile',
    component: EditProfile,
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
  const userId = localStorage.getItem("usetId")

  // маршрути, які можна відвідувати без авторизації
  const publicPages = ['/register', '/login', '/', 'teste/:id']

  // якщо маршрут не публічний
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token && !userId) {
    alert("Спочатку авторизуйтеся")
    return next('/register') // якщо не авторизований 
  }


  next()
})

export default router
