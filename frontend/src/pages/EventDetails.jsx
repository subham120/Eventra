import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, User, AlertCircle } from 'lucide-react'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getEventById, getErrorMessage } from '../services/api'
import { getUser, getToken } from '../services/auth'

// EventDetails page: Detailed event view displaying MongoDB data and ticket booking CTA
export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State management using the required fetch pattern
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Fetch event details by id
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEventById(id)
        setEvent(data)
      } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          setError('Event not found.')
        } else {
          setError(getErrorMessage(err))
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, reloadKey])

  // Retry handler for network or server errors
  const handleRetry = () => {
    setError('')
    setLoading(true)
    setReloadKey(reloadKey + 1)
  }

  // Handle booking click: navigate to booking page (route protection will handle auth gate)
  const handleBookTickets = () => {
    navigate(`/booking/${event._id}`)
  }

  // Helper to format date into "18 Oct 2026"
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // 1. Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loading message="Loading event..." />
      </div>
    )
  }

  // 2. Error state (always shows Back to Events; Retry only shown for non-"not found" errors)
  if (error) {
    const isNotFound = error === 'Event not found.'
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <ErrorMessage
            message={error}
            onRetry={!isNotFound ? handleRetry : undefined}
          />
          <div className="mt-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Guard against null event after loading
  if (!event) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top Navigation Back Link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Main Event Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image with category badge */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xs">
            {!imageError && event.image ? (
              <img
                src={event.image}
                alt={event.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Ticket className="w-16 h-16 opacity-40" />
              </div>
            )}
            
            {/* Category Badge on image */}
            <div className="absolute top-4 right-4 bg-indigo-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs">
              {event.category}
            </div>
          </div>

          {/* Right Column: Event Details & Booking */}
          <div className="flex flex-col space-y-6">
            
            {/* Title & Category */}
            <div>
              <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Event Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {event.description}
            </p>

            {/* Key Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-gray-100 text-sm text-gray-700">
              
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Date</span>
                  <span className="font-semibold text-gray-900">{formatDate(event.date)}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Time</span>
                  <span className="font-semibold text-gray-900">{event.time}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Location</span>
                  <span className="font-semibold text-gray-900 truncate">{event.location}</span>
                </div>
              </div>

              {/* Organizer */}
              {event.organizer && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-medium">Organized By</span>
                    <span className="font-semibold text-gray-900 truncate">
                      {typeof event.organizer === 'object' ? event.organizer?.name : event.organizer}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Price, Ticket Availability & Booking Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-gray-400 font-medium">Ticket Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {event.price === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `₹${event.price}`
                    )}
                  </span>
                  {event.availableTickets === 0 ? (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      Sold Out
                    </span>
                  ) : event.availableTickets >= 1 && event.availableTickets <= 5 ? (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      Only {event.availableTickets} tickets left
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {event.availableTickets} tickets available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: Book Tickets or Sold Out */}
              {event.availableTickets > 0 ? (
                <button
                  type="button"
                  onClick={handleBookTickets}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Book Tickets
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-200 text-gray-500 text-sm font-semibold rounded-xl cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
