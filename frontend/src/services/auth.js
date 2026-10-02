// Storage keys for authentication tokens and user data
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// Save JWT token and user profile into localStorage
export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Retrieve JWT token from localStorage
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Retrieve parsed user profile from localStorage (returns null if absent or invalid)
export function getUser() {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

// Clear authentication data from localStorage on logout
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
