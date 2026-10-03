import axios from 'axios'
import { getToken, logout } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      if (!isLoginRequest) {
        logout()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(err) {
  if (!err || !err.response) {
    return 'Cannot reach the server. Please try again later.'
  }
  if (err.response.status === 401) {
    return 'Please log in to continue.'
  }
  if (err.response.status === 403) {
    return "You don't have permission to do that."
  }
  if (err.response.status === 404) {
    return 'Not found.'
  }
  if (err.response.status === 400) {
    return err.response.data?.message || 'Invalid request.'
  }
  return 'Something went wrong. Please try again.'
}

export async function getEvents() {
  const response = await api.get('/events')
  return response.data
}

export async function getEventById(id) {
  const response = await api.get(`/events/${id}`)
  return response.data
}

export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getMyEvents() {
  const response = await api.get('/events/my-events')
  return response.data
}

export async function createEvent(eventData) {
  const response = await api.post('/events', eventData)
  return response.data
}

export async function updateEvent(id, eventData) {
  const response = await api.put(`/events/${id}`, eventData)
  return response.data
}

export async function deleteEvent(id) {
  const response = await api.delete(`/events/${id}`)
  return response.data
}

export async function createBooking(eventId, quantity) {
  const response = await api.post('/bookings', { eventId, quantity })
  return response.data
}

export async function getMyBookings() {
  const response = await api.get('/bookings/my-bookings')
  return response.data
}

export async function cancelBooking(bookingId) {
  const response = await api.put(`/bookings/${bookingId}/cancel`)
  return response.data
}
