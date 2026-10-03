import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/categories'
import FormInput from './FormInput'

export default function EventForm({
  mode = 'create',
  initialValues,
  onSubmit,
  submitting = false,
  errorMessage = '',
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    date: initialValues?.date ? initialValues.date.split('T')[0] : '',
    time: initialValues?.time || '',
    location: initialValues?.location || '',
    category: initialValues?.category || '',
    price: initialValues?.price !== undefined ? initialValues.price : '',
    availableTickets: initialValues?.availableTickets !== undefined ? initialValues.availableTickets : '',
    image: initialValues?.image || '',
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        date: initialValues.date ? initialValues.date.split('T')[0] : '',
        time: initialValues.time || '',
        location: initialValues.location || '',
        category: initialValues.category || '',
        price: initialValues.price !== undefined ? initialValues.price : '',
        availableTickets: initialValues.availableTickets !== undefined ? initialValues.availableTickets : '',
        image: initialValues.image || '',
      })
    }
  }, [initialValues])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationError) setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!formData.title.trim()) return setValidationError('Event title is required.')
    if (!formData.description.trim()) return setValidationError('Event description is required.')
    if (!formData.date) return setValidationError('Event date is required.')
    if (!formData.time.trim()) return setValidationError('Event time is required (e.g. 6:00 PM).')
    if (!formData.location.trim()) return setValidationError('Location is required.')
    if (!formData.category) return setValidationError('Please select an event category.')

    const numPrice = formData.price === '' ? 0 : Number(formData.price)
    if (isNaN(numPrice) || numPrice < 0) {
      return setValidationError('Price must be a valid number greater than or equal to 0.')
    }

    const numTickets = Number(formData.availableTickets)
    if (isNaN(numTickets) || !Number.isInteger(numTickets) || numTickets <= 0) {
      return setValidationError('Available tickets must be a whole number greater than 0.')
    }

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      time: formData.time.trim(),
      location: formData.location.trim(),
      category: formData.category,
      price: numPrice,
      availableTickets: numTickets,
      image: formData.image ? formData.image.trim() : '',
    })
  }

  const isEdit = mode === 'edit'
  const submitButtonText = isEdit
    ? submitting ? 'Saving...' : 'Save Changes'
    : submitting ? 'Creating...' : 'Create Event'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">

      {(validationError || errorMessage) && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {validationError || errorMessage}
        </div>
      )}

      <FormInput
        label="Event Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. National Inter-College Hackathon 2026"
        required
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of what attendees can expect..."
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="e.g. 6:00 PM"
          required
        />

        <FormInput
          label="Location / Venue"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Auditorium Hall, Bengaluru"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Ticket Price (₹) — 0 for free"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="0"
          min="0"
        />

        <FormInput
          label="Available Tickets"
          name="availableTickets"
          type="number"
          value={formData.availableTickets}
          onChange={handleChange}
          placeholder="e.g. 100"
          min="1"
          required
        />
      </div>

      <FormInput
        label="Event Banner Image URL (Optional)"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="https://picsum.photos/seed/event/600/400"
      />

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/organizer')}
          disabled={submitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}
