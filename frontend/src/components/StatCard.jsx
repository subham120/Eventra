export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        <div className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
          {label}
        </div>
      </div>
    </div>
  )
}
