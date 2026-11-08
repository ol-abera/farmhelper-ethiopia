import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/token/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  register: (payload) => api.post('/auth/register/', payload),
  login: (payload) => api.post('/auth/login/', payload),
  me: () => api.get('/auth/me/'),
}

export const farmsAPI = {
  list: (params) => api.get('/farms/', { params }),
  get: (id) => api.get(`/farms/${id}/`),
  create: (data) => api.post('/farms/', data),
  update: (id, data) => api.patch(`/farms/${id}/`, data),
  remove: (id) => api.delete(`/farms/${id}/`),
}

export const expensesAPI = {
  list: (params) => api.get('/expenses/', { params }),
  create: (data) => api.post('/expenses/', data),
  update: (id, data) => api.patch(`/expenses/${id}/`, data),
  remove: (id) => api.delete(`/expenses/${id}/`),
}

export const harvestsAPI = {
  list: (params) => api.get('/harvests/', { params }),
  create: (data) => api.post('/harvests/', data),
}

export const salesAPI = {
  list: (params) => api.get('/sales/', { params }),
  create: (data) => api.post('/sales/', data),
}

export const dashboardAPI = {
  summary: () => api.get('/dashboard/summary/'),
}

export const cropsAPI = {
  list: () => api.get('/crops/'),
}
