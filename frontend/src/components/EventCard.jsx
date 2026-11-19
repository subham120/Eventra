import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, Clock, MapPin, ArrowRight, Ticket } from 'lucide-react'
import { getImageUrl } from '../services/api'

export default function EventCard({ event }) {
  const location = useLocation()
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

  const todayStr = new Date().toISOString().split('T')[0]
  const isPast = Boolean(event?.date && event.date < todayStr)

  return (
    <Link
      to={`/events/${event._id}`}
      state={{ from: `${location.pathname}${location.search}` }}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col group cursor-pointer block"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {!imageError && event.image ? (
          <img
            src={getImageUrl(event.image)}
            alt={event.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Ticket className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" />
          </div>
        )}

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-xs rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-center shadow-xs">
          <span className="block text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            {monthBadge()}
          </span>
          <span className="block text-xs sm:text-sm font-extrabold text-gray-900 leading-none">
            {dayBadge()}
          </span>
        </div>

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-indigo-900/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs truncate max-w-[50%]">
          {event.category}
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 sm:line-clamp-1 mb-1.5 sm:mb-2 leading-snug">
          {event.title}
        </h3>

        <div className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-gray-500 mb-2.5 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{formatFullDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-2.5 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="hidden sm:block text-[11px] text-gray-400 font-medium">Ticket Price</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {event.price === 0 ? (
                  <span className="text-emerald-600">Free</span>
                ) : (
                  `₹${event.price}`
                )}
              </span>
              {isPast ? (
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded-sm">
                  Ended
                </span>
              ) : event.availableTickets > 0 ? (
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded-sm">
                  {event.availableTickets} left
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-medium text-red-600 bg-red-50 px-1 sm:px-1.5 py-0.5 rounded-sm">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          <span
            className="inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-white bg-indigo-600 group-hover:bg-indigo-700 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-colors shadow-xs w-full sm:w-auto"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
