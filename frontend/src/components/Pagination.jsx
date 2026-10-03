import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {

  if (totalPages <= 1) {
    return null
  }

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  )
}
