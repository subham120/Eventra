import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ShieldAlert } from 'lucide-react'
import { getUser } from '../../services/auth'
import { createEvent, getErrorMessage } from '../../services/api'
import EventForm from '../../components/EventForm'

// CreateEvent page: Allows organizers to publish a new event
export default function CreateEvent() {
  const user = getUser()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 1. Unauthenticated gate: Must be logged in
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-sm text-gray-500 mb-6">Please log in to access this page.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // 2. Role gate: Must have role "organizer"
  if (user.role !== 'organizer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">You need an organizer account to access this page.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Handle form submission
  const handleCreate = async (formData) => {
    setSubmitting(true)
    setErrorMessage('')

    try {
      await createEvent(formData)
      navigate('/organizer')
    } catch (err) {
      setErrorMessage(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Create New Event</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to publish your event on Eventra.
        </p>
      </div>

      <EventForm
        mode="create"
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={handleCreate}
      />
    </div>
  )
}
