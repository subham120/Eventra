import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, CheckCircle } from 'lucide-react'
import FormInput from '../components/FormInput'
import { loginUser } from '../services/api'
import { saveAuth, getUser } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  if (user) {
    const destination = location.state?.from?.pathname || (user.role === 'organizer' ? '/organizer' : '/')
    return <Navigate to={destination} replace />
  }

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password.')
      return
    }

    setSubmitting(true)
    try {
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })

      saveAuth(data.token, data.user)

      const target = location.state?.from?.pathname || (data.user.role === 'organizer' ? '/organizer' : '/')
      navigate(target, { replace: true })
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Unable to connect to the server. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Log in to access your booked tickets and account.
          </p>
        </div>

        {location.state?.registeredMessage && !error && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{location.state.registeredMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul@campus.edu"
            autoComplete="email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Register
          </Link>
        </div>

      </div>
    </div>
  )
}
