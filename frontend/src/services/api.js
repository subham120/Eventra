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
  if (!err) {
    return 'Something went wrong. Please try again.'
  }
  if (typeof err === 'string') {
    return err
  }
  if (err.response) {
    if (err.response.status === 413) {
      return 'Image is too large. Please select an image under 10MB.'
    }
    if (err.response.data?.message) {
      return err.response.data.message
    }
    if (err.response.status === 401) {
      return 'Please log in to continue.'
    }
    if (err.response.status === 403) {
      return "You don't have permission to do that."
    }
    if (err.response.status === 404) {
      return 'Requested resource not found.'
    }
    if (err.response.status >= 500) {
      return 'Server error. Please try again later.'
    }
  }
  if (err.message) {
    if (err.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    if (err.message.includes('Network Error')) {
      return 'Cannot reach the server. Please check your connection or restart the backend server.'
    }
    return err.message
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

export async function getOrganizerStats() {
  try {
    const response = await api.get('/bookings/organizer')
    return response.data
  } catch (err) {
    console.warn('Organizer stats endpoint fallback:', err?.message)
    return {
      totalIncome: 0,
      totalTicketsSold: 0,
      totalBookings: 0,
      bookings: [],
      eventSalesMap: {},
    }
  }
}

export function getImageUrl(imagePath) {
  if (!imagePath) return ''
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath
  }
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000'
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export function compressImage(file, maxWidth = 1400, maxHeight = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided.'))

    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file.'))
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.max(1, Math.round(width * ratio))
          height = Math.max(1, Math.round(height * ratio))
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(e.target.result)
        }

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const finalMime = file.type === 'image/png' && file.size > 2 * 1024 * 1024 ? 'image/jpeg' : outputMime
        const dataUrl = canvas.toDataURL(finalMime, quality)
        resolve(dataUrl)
      }
      img.onerror = () => {
        resolve(e.target.result)
      }
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(fileOrDataUrl) {
  let base64String = ''
  if (typeof fileOrDataUrl === 'string') {
    base64String = fileOrDataUrl
  } else {
    base64String = await compressImage(fileOrDataUrl)
  }

  const response = await api.post('/upload', {
    image: base64String,
  })
  return response.data
}
