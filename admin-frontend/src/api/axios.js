import axios from 'axios'
import { toast } from 'react-toastify'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? "http://localhost:10000/api" : "http://localhost:10000/api"),
  withCredentials: true,
})

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Avoid infinite loops if already on login
        if (!window.location.pathname.toLowerCase().includes('/login')) {
          if (!sessionStorage.getItem('reloaded-for-401')) {
            sessionStorage.setItem('reloaded-for-401', 'true');
            toast.error("Session timeout please login again");
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
        } else {
          sessionStorage.removeItem('reloaded-for-401');
        }
      } else if (error.response.status === 403 && error.response.data?.errorCode === 'SUBSCRIPTION_EXPIRED') {
        // Handle Subscription Expiry Lockout globally
        if (!window.location.pathname.toLowerCase().includes('/login') && !sessionStorage.getItem('subscription-expired-reloaded')) {
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
