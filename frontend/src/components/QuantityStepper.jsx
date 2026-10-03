import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({
  quantity,
  onChange,
  max,
  min = 1,
}) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1)
    }
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white shadow-xs">

      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="p-2 sm:px-3 text-indigo-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-lg cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm font-bold text-gray-900 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="p-2 sm:px-3 text-indigo-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-r-lg cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
