import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, SearchX, RotateCcw } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getEvents, getErrorMessage } from '../services/api'

export default function Events() {

  const [searchParams, setSearchParams] = useSearchParams()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const parsePage = (param) => {
    const parsed = parseInt(param, 10)
    return !isNaN(parsed) && parsed > 0 ? parsed : 1
  }

  const [searchText, setSearchText] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [currentPage, setCurrentPage] = useState(() => parsePage(searchParams.get('page')))

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

  useEffect(() => {
    const urlCategory = searchParams.get('category') || ''
    const urlSearch = searchParams.get('search') || ''
    const urlPage = parsePage(searchParams.get('page'))
    setSelectedCategory(urlCategory)
    setSearchText(urlSearch)
    setCurrentPage(urlPage)
  }, [searchParams])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (category) {
      newParams.set('category', category)
    } else {
      newParams.delete('category')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (searchText.trim()) {
      newParams.set('search', searchText.trim())
    } else {
      newParams.delete('search')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setCurrentPage(1)
  }

  const handlePriceChange = (price) => {
    setSelectedPrice(price)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchText('')
    setSelectedCategory('')
    setSelectedDate('')
    setSelectedPrice('')
    setCurrentPage(1)
    setSearchParams({})
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const newParams = new URLSearchParams(searchParams)
    if (page > 1) {
      newParams.set('page', page.toString())
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const today = new Date().toISOString().split('T')[0]

  const filteredEvents = events.filter((event) => {
    // Hide past events whose date has already passed
    if (event.date && event.date < today) {
      return false
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      const matchesTitle = event.title?.toLowerCase().includes(query)
      const matchesLocation = event.location?.toLowerCase().includes(query)
      const matchesCategory = event.category?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesLocation && !matchesCategory) {
        return false
      }
    }

    if (selectedCategory && selectedCategory !== 'All') {
      if (event.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }
    }

    if (selectedDate) {
      if (event.date !== selectedDate) {
        return false
      }
    }

    if (selectedPrice) {
      if (selectedPrice === 'free' && event.price !== 0) return false
      if (selectedPrice === 'under-500' && (event.price >= 500 || event.price === 0)) return false
      if (selectedPrice === '500-1000' && (event.price < 500 || event.price > 1000)) return false
      if (selectedPrice === 'above-1000' && event.price <= 1000) return false
    }

    return true
  })

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (e) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const itemsPerPage = isDesktop ? 9 : 10
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const safeCurrentPage = totalPages > 0 && currentPage > totalPages ? 1 : currentPage
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Events
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Find upcoming campus festivals, tech talks, sports tournaments, and student workshops.
          </p>
        </div>

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

      <SearchBar
        value={searchText}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        placeholder="Search by title, club or topic..."
      />

      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedPrice={selectedPrice}
        onPriceChange={handlePriceChange}
        onClear={handleClearFilters}
      />

      {loading ? (
        <Loading message="Loading events..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : events.length === 0 ? (

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

          {paginatedEvents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

    </div>
  )
}
