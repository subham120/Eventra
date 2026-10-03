import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Calendar, MapPin, Clock, Edit, Trash2, Lock, ShieldAlert } from 'lucide-react'
import { getUser } from '../../services/auth'
import { getMyEvents, deleteEvent, getErrorMessage } from '../../services/api'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function OrganizerEvents() {
  const user = getUser()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)
    setDeleteError('')

    getMyEvents()
      .then((data) => {
        if (isMounted) {
          setEvents(data)
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

  }, [user?.role, reloadKey])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      setDeleteError('')
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e._id !== id))
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    }
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage all {events.length} event{events.length === 1 ? '' : 's'} you have organized on Eventra.
          </p>
        </div>
        <Link
          to="/organizer/events/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Event</span>
        </Link>
      </div>

      {deleteError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      {loading ? (
        <Loading message="Loading your events..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No events created yet.</h3>
          <p className="text-sm text-gray-500 mb-6">
            You have not organized any events yet. Create your first event to start accepting ticket bookings.
          </p>
          <Link
            to="/organizer/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Event</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:border-gray-200 transition-colors"
            >

              <div className="aspect-video w-full bg-linear-to-br from-indigo-100 to-indigo-50 relative overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300">
                    <Calendar className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-xs text-indigo-700 shadow-xs">
                  {event.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                    <span className="block text-[11px] text-gray-500">
                      {event.availableTickets} tickets left
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/organizer/events/${event._id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
