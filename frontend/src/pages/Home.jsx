import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import EventCard from '../components/EventCard'
import OrganizerCTA from '../components/OrganizerCTA'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { categories } from '../data/categories'
import { getEvents, getErrorMessage } from '../services/api'

export default function Home() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

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

  const handleRetry = () => {
    setError('')
    setLoading(true)
    setReloadKey(reloadKey + 1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchText.trim())}`)
    } else {
      navigate('/events')
    }
  }

  const handleTagClick = (tag) => {
    navigate(`/events?search=${encodeURIComponent(tag)}`)
  }

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = events.filter((e) => !e.date || e.date >= today)
  const featuredEvents = upcomingEvents.slice(0, 4)

  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Find Your <span className="text-indigo-600">Next Event</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Discover college festivals, technical hackathons, esports tournaments, and hands-on workshops happening across campuses.
          </p>

          <div className="pt-2 max-w-2xl mx-auto">
            <SearchBar
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder="Search events by title, keyword, or college..."
            />
          </div>

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

        </div>
      </section>

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </section>

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

        {loading ? (
          <Loading message="Loading featured events..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No events available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrganizerCTA />
      </section>

    </div>
  )
}
