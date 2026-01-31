import axios from 'axios'
import { useLoadingStore } from '@/stores/loading'
import { showToast } from '@/services/toastService'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL
})

api.interceptors.request.use(config => {
  const loading = useLoadingStore()
  loading.start()
  return config
})

api.interceptors.response.use(
  response => {
    const loading = useLoadingStore()
    loading.stop()
    return response
  },
  err => {
    const loading = useLoadingStore()
    loading.stop()

    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;

      // Масив повідомлень
      let messages = []

      if (Array.isArray(data)) {
        messages = data.map(e => e.msg)
      } else if (data.message) {
        messages = [data.message]
      } else {
        messages = [err.message]
      }

      // Відповідно до статусу
      switch (status) {
        case 400:
          messages.forEach(msg => showToast(`Помилка: ${msg}`, 'error'))
          break
        case 401:
          showToast('Потрібна авторизація', 'error')
          router.push("/register")
          break
        case 403:
          showToast('Недостатньо прав', 'error')
          break
        case 404:
          showToast(`Помилка: ${message}`, 'error')
          break
        case 500:
          showToast('Помилка сервера', 'error')
          break
        default:
          showToast('Помилка!', 'error')
      }
    } else {
      // сервер недоступний / немає інтернету
      showToast('Немає зʼєднання з сервером', 'error')
    }


    return Promise.reject(err)
  }
)

export default api
