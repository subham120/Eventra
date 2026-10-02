import axios from 'axios'
import { getToken, logout } from './auth'

// Base URL for backend API (uses VITE_API_URL if configured, otherwise defaults to localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Axios instance configured with base URL and timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Request interceptor: Attach JWT Bearer token to Authorization header if logged in
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: On 401 Unauthorized from protected calls, remove token & user and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 from a protected call (not auth login endpoint itself)
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

// Helper function to extract friendly error message according to project specifications
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

// Fetch all events from the backend
export async function getEvents() {
  const response = await api.get('/events')
  return response.data
}

// Fetch a single event by its MongoDB ID
export async function getEventById(id) {
  const response = await api.get(`/events/${id}`)
  return response.data
}

// Register a new user account
export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData)
  return response.data
}

// Authenticate user credentials and receive JWT token
export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

// Fetch all events created by the logged-in organizer
export async function getMyEvents() {
  const response = await api.get('/events/my-events')
  return response.data
}

// Create a new event (organizer only)
export async function createEvent(eventData) {
  const response = await api.post('/events', eventData)
  return response.data
}

// Update an existing event (organizer only)
export async function updateEvent(id, eventData) {
  const response = await api.put(`/events/${id}`, eventData)
  return response.data
}

// Delete an event (organizer only)
export async function deleteEvent(id) {
  const response = await api.delete(`/events/${id}`)
  return response.data
}

// Book tickets for an event
export async function createBooking(eventId, quantity) {
  const response = await api.post('/bookings', { eventId, quantity })
  return response.data
}

// Fetch all bookings for the logged-in user
export async function getMyBookings() {
  const response = await api.get('/bookings/my-bookings')
  return response.data
}

// Cancel a booking and restore event ticket availability
export async function cancelBooking(bookingId) {
  const response = await api.put(`/bookings/${bookingId}/cancel`)
  return response.data
}
