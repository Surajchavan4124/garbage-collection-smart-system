import axios from 'axios'
import { toast } from 'react-toastify'

const api = axios.create({
  baseURL: "https://ecosyz-backend.onrender.com/api",
  withCredentials: true,
})

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (!window.location.pathname.startsWith('/login')) {
          toast.error("Session timeout please login again")
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        }
      } else if (error.response.status === 403 && error.response.data?.errorCode === 'SUBSCRIPTION_EXPIRED') {
        if (!window.location.pathname.startsWith('/login') && !sessionStorage.getItem('subscription-expired-reloaded')) {
          sessionStorage.setItem('subscription-expired-reloaded', 'true');
          toast.error("Subscription expired. Contact company for renewal.")
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
