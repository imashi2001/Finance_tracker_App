import axios from 'axios'

const STORAGE_KEY = 'financeflow_user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem(STORAGE_KEY)

  if (storedUser) {
    const user = JSON.parse(storedUser)

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }

  return config
})

export { STORAGE_KEY }
export default api
