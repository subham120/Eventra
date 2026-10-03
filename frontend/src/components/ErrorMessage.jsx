import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center shadow-xs">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
      <p className="text-sm font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          Retry
        </button>
      )}
    </div>
  )
}
