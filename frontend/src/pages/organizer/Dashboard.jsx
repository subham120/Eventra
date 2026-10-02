import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Calendar, Ticket, Edit, Trash2, Lock, ShieldAlert, MapPin, Clock } from 'lucide-react'
import { getUser } from '../../services/auth'
import { getMyEvents, deleteEvent, getErrorMessage } from '../../services/api'
import StatCard from '../../components/StatCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

// Organizer Dashboard: Shows summary stats, recent events, and management links
export default function Dashboard() {
  const user = getUser()

  // State management
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [deleteError, setDeleteError] = useState('')

  // Fetch organizer events on mount or when reloadKey changes
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

  // Handle event deletion with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      setDeleteError('')
      await deleteEvent(id)
      // Update local state immediately so stats and list update without reload
      setEvents((prev) => prev.filter((e) => e._id !== id))
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    }
  }

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

  // Calculate summary metrics
  const totalEvents = events.length
  const totalTickets = events.reduce((sum, e) => sum + (e.availableTickets || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Organizer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user.name}. Manage your published events and track ticket availability.
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <StatCard label="Total Events" value={totalEvents} icon={Calendar} />
        <StatCard label="Total Available Tickets" value={totalTickets} icon={Ticket} />
      </div>

      {/* Delete error alert */}
      {deleteError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      {/* Content Area: Loading / Error / Event List */}
      {loading ? (
        <Loading message="Loading your dashboard..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No events created yet.</h3>
          <p className="text-sm text-gray-500 mb-6">
            Get started by creating your very first event to publish it on Eventra.
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Events</h2>
            <Link
              to="/organizer/events"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all my events &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-200 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {event.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.availableTickets} tickets left
                    </div>
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
