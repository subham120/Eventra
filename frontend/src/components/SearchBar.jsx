import { Search } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by title, club or topic..."
}) {

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">

        <div className="flex items-center flex-1 px-3 gap-2.5">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full py-2 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs shrink-0 cursor-pointer text-center"
        >
          Search
        </button>

      </div>
    </form>
  )
}
