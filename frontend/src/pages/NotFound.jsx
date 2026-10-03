import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
