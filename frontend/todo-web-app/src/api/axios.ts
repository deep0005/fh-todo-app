import axios from 'axios'
import { tokenUtils } from '../utils/token'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor — attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      tokenUtils.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default apiClient