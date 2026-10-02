import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Calendar, SearchX, RotateCcw } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getEvents } from '../services/api'

// Events page: Search, filter, and paginate through events fetched from MongoDB
export default function Events() {
  // Read and set URL search parameters (e.g. ?category=Technology&search=hackathon)
  const [searchParams, setSearchParams] = useSearchParams()

  // Data fetching state
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Filter state variables
  const [searchText, setSearchText] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch events from backend API using the required fetch pattern
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        setError('Unable to load events. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [reloadKey])

  // Retry handler when data fetching fails
  const handleRetry = () => {
    setError('')
    setLoading(true)
    setReloadKey(reloadKey + 1)
  }

  // Keep state in sync if URL query parameters change (e.g. clicking category link from another page)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || ''
    const urlSearch = searchParams.get('search') || ''
    setSelectedCategory(urlCategory)
    setSearchText(urlSearch)
    setCurrentPage(1)
  }, [searchParams])

  // Filter change handlers that also reset pagination to page 1
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    if (category) {
      searchParams.set('category', category)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setCurrentPage(1)
    if (searchText.trim()) {
      searchParams.set('search', searchText.trim())
    } else {
      searchParams.delete('search')
    }
    setSearchParams(searchParams)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setCurrentPage(1)
  }

  const handlePriceChange = (price) => {
    setSelectedPrice(price)
    setCurrentPage(1)
  }

  // Clear all active filters back to default
  const handleClearFilters = () => {
    setSearchText('')
    setSelectedCategory('')
    setSelectedDate('')
    setSelectedPrice('')
    setCurrentPage(1)
    setSearchParams({})
  }

  // 1. FILTERING LOGIC on the fetched events array
  const filteredEvents = events.filter((event) => {
    // Search text filter: matches title, location, or category
    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      const matchesTitle = event.title?.toLowerCase().includes(query)
      const matchesLocation = event.location?.toLowerCase().includes(query)
      const matchesCategory = event.category?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesLocation && !matchesCategory) {
        return false
      }
    }

    // Category filter: match exact category if specified
    if (selectedCategory && selectedCategory !== 'All') {
      if (event.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }
    }

    // Date filter: compare YYYY-MM-DD strings
    if (selectedDate) {
      if (event.date !== selectedDate) {
        return false
      }
    }

    // Price filter
    if (selectedPrice) {
      if (selectedPrice === 'free' && event.price !== 0) return false
      if (selectedPrice === 'under-500' && (event.price >= 500 || event.price === 0)) return false
      if (selectedPrice === '500-1000' && (event.price < 500 || event.price > 1000)) return false
      if (selectedPrice === 'above-1000' && event.price <= 1000) return false
    }

    return true
  })

  // 2. PAGINATION LOGIC: 6 events per page
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header section with title, subtitle, and total events counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CAMPUS HUB LIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Events
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Find upcoming campus festivals, tech talks, sports tournaments, and student workshops.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-2xs self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-lg font-bold text-gray-900 leading-none">
              {loading ? '...' : filteredEvents.length}
            </span>
            <span className="text-xs text-gray-400">Events Available</span>
          </div>
        </div>
      </div>

      {/* Search Input Bar (always visible) */}
      <SearchBar
        value={searchText}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        placeholder="Search by title, club or topic..."
      />

      {/* Filter Options: Category pills, date picker, price selector (always visible) */}
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedPrice={selectedPrice}
        onPriceChange={handlePriceChange}
        onClear={handleClearFilters}
      />

      {/* Dynamic Content Area: Loading, Error, Empty Database, or Results Grid */}
      {loading ? (
        <Loading message="Loading events..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : events.length === 0 ? (
        /* Empty state when database has 0 events */
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-lg mx-auto p-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No events available yet</h3>
          <p className="text-sm text-gray-500">
            No events available yet. Please check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Results Count Text */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>
              Showing <span className="font-semibold text-gray-900">{paginatedEvents.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
            </span>
            {currentPage > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Events Grid or No Matches Filtered State */}
          {paginatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-lg mx-auto p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No events found</h3>
              <p className="text-sm text-gray-500">
                We couldn't find any events matching your selected filters. Try searching for something else or clear the filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

    </div>
  )
}
