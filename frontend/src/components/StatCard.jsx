export default function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  badge,
  color = 'indigo',
}) {
  const colorMap = {
    indigo: {
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700',
    },
    emerald: {
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700',
    },
    violet: {
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-600',
      badgeBg: 'bg-violet-50 text-violet-700',
    },
    blue: {
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700',
    },
  }

  const theme = colorMap[color] || colorMap.indigo

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:border-gray-200 transition-all">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs sm:text-sm font-medium text-gray-500 truncate">
          {label}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${theme.iconBg} ${theme.iconText} flex items-center justify-center shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {subtitle && (
            <span className="text-xs text-gray-400">
              {subtitle}
            </span>
          )}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
