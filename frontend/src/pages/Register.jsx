import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Sparkles } from 'lucide-react'
import FormInput from '../components/FormInput'
import { registerUser } from '../services/api'

// Register page: Allows new users and organizers to create an account
export default function Register() {
  const navigate = useNavigate()

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })

  // Feedback and loading state
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission with client-side validation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 1. All fields required
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('All fields are required.')
      return
    }

    // 2. Email format validation
    const emailPattern = /^\S+@\S+\.\S+$/
    if (!emailPattern.test(formData.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    // 3. Password minimum length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // 4. Password confirmation match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // 5. Submit valid payload to backend API
    setSubmitting(true)
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Header with icon and title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Sign up to discover campus events and manage your tickets.
          </p>
        </div>

        {/* Error message box */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Success message box */}
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-100">
            {success}
          </div>
        )}

        {/* Registration Form */}
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

          {/* Account Role Selector */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              I want to join as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              <option value="user">User (Attend events & book tickets)</option>
              <option value="organizer">Organizer (Host & publish events)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </div>

      </div>
    </div>
  )
}
