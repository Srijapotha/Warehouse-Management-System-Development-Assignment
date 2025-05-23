import { useState } from 'react'

export default function RecentActivity({ activities }) {
  const [displayCount, setDisplayCount] = useState(5)
  
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 5)
  }

  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {activities.slice(0, displayCount).map((activity) => (
            <li key={activity.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${activity.iconBg}`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                </div>
                <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                  {activity.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {displayCount < activities.length && (
        <div className="mt-6">
          <button
            onClick={handleShowMore}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  )
}