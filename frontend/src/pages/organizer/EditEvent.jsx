import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, ShieldAlert } from 'lucide-react'
import { getUser } from '../../services/auth'
import { getEventById, updateEvent, getErrorMessage } from '../../services/api'
import EventForm from '../../components/EventForm'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function EditEvent() {
  const { id } = useParams()
  const user = getUser()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    getEventById(id)
      .then((data) => {
        if (isMounted) {
          setEvent(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getErrorMessage(err))
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }

  }, [id, user?.role, reloadKey])

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

  const handleUpdate = async (formData) => {
    setSubmitting(true)
    setErrorMessage('')

    try {
      await updateEvent(id, formData)
      navigate('/organizer')
    } catch (err) {
      if (err.response?.status === 403) {
        setErrorMessage('You can only edit your own events.')
      } else {
        setErrorMessage(getErrorMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Edit Event</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the event schedule, location, or available tickets.
        </p>
      </div>

      {loading ? (
        <Loading message="Loading event details..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <EventForm
          mode="edit"
          initialValues={event}
          submitting={submitting}
          errorMessage={errorMessage}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}
