import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, ArrowRight, Ticket } from 'lucide-react'

export default function EventCard({ event }) {

  const [imageError, setImageError] = useState(false)

  const formatFullDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const monthBadge = () => {
    try {
      return new Date(event.date).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
    } catch {
      return 'EVENT'
    }
  }

  const dayBadge = () => {
    try {
      return new Date(event.date).getDate()
    } catch {
      return '•'
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col group">

      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {!imageError && event.image ? (
          <img
            src={event.image}
            alt={event.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <Ticket className="w-12 h-12 opacity-40" />
          </div>
        )}

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-xl px-2.5 py-1 text-center shadow-xs">
          <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            {monthBadge()}
          </span>
          <span className="block text-sm font-extrabold text-gray-900 leading-none">
            {dayBadge()}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-indigo-900/80 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-xs">
          {event.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">

        <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{formatFullDate(event.date)}</span>
            <span className="text-gray-300">•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-gray-400 font-medium">Ticket Price</span>
            <span className="text-base font-bold text-gray-900">
              {event.price === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `₹${event.price}`
              )}
            </span>
            {event.availableTickets && (
              <span className="ml-2 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                {event.availableTickets} left
              </span>
            )}
          </div>

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  )
}
