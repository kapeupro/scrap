export default function UsageStats({ usage }) {
  if (!usage) return null

  const percentage = (usage.used / usage.limit) * 100
  const remaining = usage.limit - usage.used

  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{usage.used}</span> / {usage.limit} recherches
      </div>
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${
            percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
