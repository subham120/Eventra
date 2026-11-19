import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import FormInput from '../components/FormInput'
import { registerUser, getErrorMessage } from '../services/api'
import { getUser } from '../services/auth'
import logo from '../assets/logo.png'

export default function Register({ role = 'user' }) {
  const navigate = useNavigate()
  const user = getUser()

  if (user?.role === 'organizer') {
    return <Navigate to="/organizer/events/create" replace />
  }
  if (user && role === 'user') {
    return <Navigate to="/" replace />
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOrganizer = role === 'organizer'
  const Icon = isOrganizer ? CalendarPlus : UserPlus
  const title = isOrganizer ? 'Create your organizer account' : 'Create your account'
  const subtitle = isOrganizer
    ? 'Sign up to create events and manage their bookings.'
    : 'Sign up to discover campus events and manage your tickets.'
  const submitButtonText = isOrganizer ? 'Create Organizer Account' : 'Create Account'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('All fields are required.')
      return
    }

    const emailPattern = /^\S+@\S+\.\S+$/
    if (!emailPattern.test(formData.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
      })

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredEmail: formData.email.trim(),
            registeredMessage: 'Account created successfully! Please log in to continue.',
          },
          replace: true,
        })
      }, 1500)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">

        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-center text-sm font-semibold">
          <Link
            to="/register"
            className={`py-2 rounded-lg transition-colors ${
              !isOrganizer
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendee
          </Link>
          <Link
            to="/register/organizer"
            className={`py-2 rounded-lg transition-colors ${
              isOrganizer
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Organizer
          </Link>
        </div>

        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group mb-1">
            <img
              src={logo}
              alt="Eventra Logo"
              className="w-12 h-12 object-contain mx-auto drop-shadow-xs group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            autoComplete="name"
          />

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type your password"
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {submitting ? 'Creating account...' : submitButtonText}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Login
          </Link>
        </div>

      </div>
    </div>
  )
}
