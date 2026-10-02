import { Navigate } from 'react-router-dom'
import { getToken } from '../services/auth'

// ProtectedRoute component: Protects private routes from unauthenticated access.
// If the user does not have a token saved in localStorage, they are redirected to /login.
export default function ProtectedRoute({ children }) {
  const token = getToken()

  // If not logged in, redirect to login page replacing history entry
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If token exists, render the protected component
  return children
}
