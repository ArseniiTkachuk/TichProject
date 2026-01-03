import axios from 'axios'
import { useLoadingStore } from '@/stores/loading'
import { showToast } from '@/services/toastService'

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
    showToast("300")
    loading.stop()
    return response
  },
  error => {
    const loading = useLoadingStore()
    loading.stop()
    return Promise.reject(error)
  }
)

export default api
