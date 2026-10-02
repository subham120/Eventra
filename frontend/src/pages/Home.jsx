import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Ticket, School, Users, CheckCircle2, Sparkles } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import EventCard from '../components/EventCard'
import OrganizerCTA from '../components/OrganizerCTA'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { categories } from '../data/categories'
import { getEvents, getErrorMessage } from '../services/api'

// Home page: Landing page with hero banner, quick category links, featured events, and organizer CTA
export default function Home() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  // Featured events data fetching state
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Fetch events for the Featured Events section
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [reloadKey])

  // Retry handler when fetching events fails
  const handleRetry = () => {
    setError('')
    setLoading(true)
    setReloadKey(reloadKey + 1)
  }

  // Handle hero search submit: Redirect to /events with the search query param
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchText.trim())}`)
    } else {
      navigate('/events')
    }
  }

  // Quick tag click handler
  const handleTagClick = (tag) => {
    navigate(`/events?search=${encodeURIComponent(tag)}`)
  }

  // Take the first 4 events for the featured section
  const featuredEvents = events.slice(0, 4)

  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Top Pill / Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CAMPUS & TECH PULSE 2026 • Discover 120+ active events</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Find Your <span className="text-indigo-600">Next Event</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Discover college festivals, technical hackathons, esports tournaments, and hands-on workshops happening across campuses.
          </p>

          {/* SearchBar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <SearchBar
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder="Search events by title, keyword, or college..."
            />
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-gray-400 font-medium">Trending:</span>
            {['Hackathons', 'Tech Fest', 'Robotics', 'Music Meet', 'Design'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Trust / Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200/80">
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-lg">
                <Ticket className="w-5 h-5" />
                <span>12,400+</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Tickets Booked</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-lg">
                <School className="w-5 h-5" />
                <span>48 Campuses</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Active Universities</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-lg">
                <Users className="w-5 h-5" />
                <span>320+ Clubs</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Student Societies</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>99.8%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Verified Experience</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              EXPLORE BY PASSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse upcoming happenings by your favorite interest
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (2 cols mobile, 4 cols md) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              HANDPICKED HIGHLIGHTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Featured Events
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Don't miss these top-rated experiences this semester
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View all events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic content: Loading, Error, Empty, or Cards Grid */}
        {loading ? (
          <Loading message="Loading featured events..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No events available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. ORGANIZER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrganizerCTA />
      </section>

    </div>
  )
}
