import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Ticket } from 'lucide-react'
import { getEventById, createBooking, getErrorMessage } from '../services/api'
import QuantityStepper from '../components/QuantityStepper'

// Booking page: Allows users to select ticket quantity, view cost summary, and book tickets
export default function Booking() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  // Component states
  const [event, setEvent] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch event details on component mount or eventId change
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')

    getEventById(eventId)
      .then((data) => {
        if (isMounted) {
          setEvent(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err.response && (err.response.status === 400 || err.response.status === 404)) {
            setError('Event not found.')
          } else {
            setError(getErrorMessage(err))
          }
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [eventId])

  // Handle booking submission
  const handleConfirmBooking = async (e) => {
    if (e) e.preventDefault()
    // Prevent double submission if already in flight
    if (submitting) return

    setSubmitting(true)
    setError('')

    try {
      // Send ONLY eventId and quantity as required by security guidelines
      await createBooking(event._id, quantity)
      navigate('/my-bookings')
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  // 1. Loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500 font-medium">
        Loading event...
      </div>
    )
  }

  // 2. Error state when event could not be loaded
  if (error && !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">
          {error}
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Events</span>
        </Link>
      </div>
    )
  }

  // Guard against missing event
  if (!event) return null

  // 3. Sold Out state: if no tickets left, show Sold Out and a link to /events instead of the booking form
  if (event.availableTickets === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sold Out</h2>
          <p className="text-sm text-gray-500 mb-6">
            This event is currently sold out. No tickets are available.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
        </div>
      </div>
    )
  }

  const price = event.price || 0
  const totalPrice = price * quantity

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Back Link to Event Details */}
      <Link
        to={`/events/${event._id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Event Details</span>
      </Link>

      {/* Main Checkout Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
            Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
            Book Your Tickets
          </h1>
        </div>

        {/* Friendly Error Box for submit errors, insufficient tickets, etc. */}
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Event Preview Summary - Stacked on mobile, side-by-side on lg */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full lg:w-32 h-40 lg:h-32 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-full lg:w-32 h-40 lg:h-32 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Ticket className="w-10 h-10" />
            </div>
          )}

          <div className="space-y-2 flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>
            <div className="text-xs text-emerald-600 font-semibold pt-1">
              {event.availableTickets} tickets available
            </div>
          </div>
        </div>

        {/* Ticket Selector */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700 block">Quantity</span>
              <span className="text-xs text-gray-400">Available: {event.availableTickets}</span>
            </div>
            <QuantityStepper
              quantity={quantity}
              onChange={setQuantity}
              max={event.availableTickets}
              min={1}
            />
          </div>

          {/* Pricing Summary (Display Only) */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Price per ticket:</span>
              <span className="font-semibold text-gray-900">₹{price}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantity:</span>
              <span className="font-semibold text-gray-900">{quantity}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Calculation:</span>
              <span className="font-semibold text-gray-900">₹{price} × {quantity} = ₹{totalPrice}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-extrabold text-indigo-600">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Submit Booking Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>

      </div>

    </div>
  )
}
