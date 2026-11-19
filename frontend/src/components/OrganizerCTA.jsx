import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { getUser } from '../services/auth'

export default function OrganizerCTA() {
  const user = getUser()
  const isOrganizer = user?.role === 'organizer'

  return (
    <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-8 sm:p-12 shadow-md">

      <div
        className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl">

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Have an event to organize?
        </h2>

        <p className="text-sm sm:text-base text-indigo-100 leading-relaxed mb-8">
          Create and publish events, set ticket capacity and prices, and manage your events through the organizer portal.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link
            to={isOrganizer ? '/organizer/events/create' : '/register/organizer'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 hover:bg-gray-100 text-sm font-bold rounded-xl transition-all shadow-xs"
          >
            <span>Create an Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={isOrganizer ? '/organizer' : '/register'}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <span>{isOrganizer ? 'Dashboard' : 'Learn More'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-indigo-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Create & Manage Events</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Free & Paid Tickets</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Simple Booking Management</span>
          </div>
        </div>

      </div>

    </div>
  )
}
