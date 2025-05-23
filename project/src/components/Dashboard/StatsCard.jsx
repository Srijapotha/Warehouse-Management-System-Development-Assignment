import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

export default function StatsCard({ title, value, change, changeType, icon: Icon }) {
  const isPositive = changeType === 'increase'
  
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${isPositive ? 'bg-success-100' : 'bg-error-100'}`}>
          <Icon className={`h-6 w-6 ${isPositive ? 'text-success-600' : 'text-error-600'}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-error-600'} flex items-center`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">from last month</span>
      </div>
    </div>
  )
}