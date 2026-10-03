import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function CategoryCard({ category }) {
  const IconComponent = category.icon

  return (
    <Link
      to={`/events?category=${encodeURIComponent(category.name)}`}
      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3.5">

        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {category.name}
          </h4>
          <p className="text-xs text-gray-400">
            Explore events
          </p>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}
