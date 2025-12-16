import { createRouter, createWebHistory } from 'vue-router'

import Register from './pages/register.vue' //сторінка реєстрації
import Login from './pages/login.vue' // сторінка входу

import Test from './pages/test.vue' // сторінка проходження тесту

import Home from './pages/home.vue' // головна сторінка
import AuthHome from './pages/authHome.vue' // сторінка профілю

import CreateTest from './pages/createTest.vue' // сторінка створення тесну 

const routes = [

  { path: '/', name: 'Home', component: Home }, // маршрут головної сторінки
  { path: '/register', name: 'Register', component: Register }, // маршрут реєстрації
  { path: '/login', name: 'Login', component: Login }, //маршрут входу
  { path: '/home', name: 'AuthHome', component: AuthHome }, // маршрут головної сторінки авторизованого користувача
  { path: '/test/:id', name: 'Test', component: Test }, // Маршрут для тестів
  { path: '/createTest', name: 'CreateTest', component: CreateTest }, // маршрут для створення тестів

]

const router = createRouter({
  history: createWebHistory(),
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
