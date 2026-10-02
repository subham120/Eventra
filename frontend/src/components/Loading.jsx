import { Loader2 } from 'lucide-react'

// Loading component: Displays a centered spinner and message while fetching data
export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
