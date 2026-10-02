import { categories } from '../data/categories'
import { Calendar, RotateCcw } from 'lucide-react'

// FilterBar component: Category pills, date picker, price dropdown, and clear filters action
export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
  selectedPrice,
  onPriceChange,
  onClear
}) {
  // All category names including "All"
  const categoryList = ['All', ...categories.map((c) => c.name)]

  return (
    <div className="space-y-4">
      
      {/* Category Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categoryList.map((cat) => {
          const isActive = selectedCategory === cat || (!selectedCategory && cat === 'All')
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Secondary Controls: Date picker, Price filter, Clear button */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-xs shadow-2xs">
          <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-gray-700 focus:outline-hidden cursor-pointer"
          />
        </div>

        {/* Price Dropdown */}
        <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-xs shadow-2xs">
          <select
            value={selectedPrice}
            onChange={(e) => onPriceChange(e.target.value)}
            className="bg-transparent text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="under-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="above-1000">Above ₹1000</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory || selectedDate || selectedPrice) && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}

      </div>

    </div>
  )
}
