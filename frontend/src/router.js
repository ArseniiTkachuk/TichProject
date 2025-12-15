import { createRouter, createWebHistory } from 'vue-router'

import Auth from './pages/auth.vue' // сторінка авторизації 
import Home from './pages/home.vue' // головна сторінка

const routes = [
  { path: '/', redirect: '/auth' },

  { path: '/auth', name: 'Auth', component: Auth }, // маршрут авторизації
  { path: '/home', name: 'Home', component: Home }, // маршрут головної сторінки

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Перевірка авторизації перед кожним переходом
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("tokenAuthTeacher")

  // маршрути, які можна відвідувати без авторизації
  const publicPages = ['/auth', ]

  // якщо маршрут не публічний
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    alert("Спочатку авторизуйтеся")
    return next('/auth') // якщо не авторизований → на auth
  }


  next()
})

export default router
