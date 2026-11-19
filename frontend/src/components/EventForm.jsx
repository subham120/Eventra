import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Link2, Loader2, CheckCircle2 } from 'lucide-react'
import { categories } from '../data/categories'
import FormInput from './FormInput'
import { uploadImage, compressImage, getErrorMessage, getImageUrl } from '../services/api'

export default function EventForm({
  mode = 'create',
  initialValues,
  onSubmit,
  submitting = false,
  errorMessage = '',
}) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

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

  const [imageMode, setImageMode] = useState('upload') // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState('')
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
      if (initialValues.image && !initialValues.image.includes('/uploads/')) {
        setImageMode('url')
      }
    }
  }, [initialValues])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationError) setValidationError('')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP, or GIF).')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please choose a smaller image.')
      return
    }

    setUploadingImage(true)
    try {
      // 1. Instant client-side compression to lightweight JPEG/PNG
      const compressedDataUrl = await compressImage(file)

      // 2. Persist to server /api/upload
      const data = await uploadImage(compressedDataUrl)
      if (data?.url) {
        setFormData((prev) => ({ ...prev, image: data.url }))
      } else {
        throw new Error('Upload succeeded but no image URL was returned.')
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setUploadError(
          'Image upload route not found on the running server. Please restart your backend server terminal (press Ctrl+C, then run npm run dev or npm start) so the new upload route is activated.'
        )
      } else {
        setUploadError(getErrorMessage(err) || 'Failed to upload image. Please try again.')
      }
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }))
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
          Event Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of your event, schedule, highlights, and guidelines..."
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
            Event Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={mode === 'create' ? new Date().toISOString().split('T')[0] : undefined}
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
          label="Ticket Price (₹) (0 for free)"
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

      {/* Event Banner Image Upload / URL */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Banner Image (Optional)
          </label>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setImageMode('upload'); setUploadError('') }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                imageMode === 'upload'
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
            <button
              type="button"
              onClick={() => { setImageMode('url'); setUploadError('') }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                imageMode === 'url'
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
            {uploadError}
          </div>
        )}

        {/* Current / Uploaded Image Preview */}
        {formData.image ? (
          <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
            <div className="aspect-video w-full max-h-64 overflow-hidden relative bg-slate-900">
              <img
                src={getImageUrl(formData.image)}
                alt="Event banner preview"
                className="w-full h-full object-cover"
                onError={() => setUploadError('Unable to load preview for this image.')}
              />
            </div>
            <div className="p-3.5 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {formData.image.startsWith('data:')
                    ? 'Banner image ready'
                    : formData.image.includes('/uploads/')
                    ? 'Custom banner uploaded'
                    : formData.image}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {imageMode === 'upload' && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Change Image
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : imageMode === 'upload' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
              id="event-image-upload"
            />
            <label
              htmlFor="event-image-upload"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0]
                if (file) {
                  const fakeEvent = { target: { files: [file] } }
                  handleFileChange(fakeEvent)
                }
              }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-2xl bg-gray-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer group"
            >
              {uploadingImage ? (
                <div className="flex flex-col items-center py-4 text-indigo-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-sm font-semibold">Uploading banner image...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-500 group-hover:text-indigo-600 group-hover:border-indigo-200 flex items-center justify-center mb-3 shadow-xs transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 text-center mb-1">
                    Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    PNG, JPG, WebP or GIF (max 5MB)
                  </p>
                </>
              )}
            </label>
          </div>
        ) : (
          <FormInput
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
          />
        )}
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/organizer')}
          disabled={submitting || uploadingImage}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}
