import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Ticket, ArrowRight } from 'lucide-react'
import { getMyBookings, cancelBooking, getErrorMessage } from '../services/api'

export default function MyBookings() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancellingId(id)
      setError('')
      await cancelBooking(id)

      await fetchBookings()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCancellingId(null)
    }
  }

  const formatBookingDate = (dateStr) => {
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-500 font-medium">
        Loading bookings...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto bg-red-50 text-red-600 rounded-2xl p-6 text-center border border-red-100">
          <p className="font-semibold mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchBookings}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            You haven't booked any events yet.
          </p>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your reserved event passes and booking receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => {
          const event = booking.event
          const isCancelled = booking.status === 'cancelled'
          const isCancelling = cancellingId === booking._id

          return (
            <div
              key={booking._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">

                <div className="flex gap-4 items-start">
                  {event?.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                      <Ticket className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                        {event ? event.title : 'Event no longer available'}
                      </h2>

                      {isCancelled ? (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Cancelled
                        </span>
                      ) : (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          Confirmed
                        </span>
                      )}
                    </div>

                    {event ? (
                      <div className="text-xs text-gray-500 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{event.date}</span>
                          <span className="text-gray-300">•</span>
                          <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        This event has been removed by the organizer.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                    </span>
                    <span className="text-gray-400 block pt-0.5">
                      Booked on {formatBookingDate(booking.bookingDate || booking.createdAt)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Total Paid</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking._id)}
                    disabled={isCancelling}
                    className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
