import { useState, useEffect } from 'react'
import { 
  CubeIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  ExclamationCircleIcon,
  DocumentDuplicateIcon,
  TagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import StatsCard from '../components/Dashboard/StatsCard'
import LineChart from '../components/Dashboard/LineChart'
import RecentActivity from '../components/Dashboard/RecentActivity'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock data
  const statsData = [
    { 
      title: 'Total Inventory',
      value: '1,284 units', 
      change: '12%', 
      changeType: 'increase',
      icon: CubeIcon
    },
    { 
      title: 'Pending Orders',
      value: '35', 
      change: '5%', 
      changeType: 'decrease',
      icon: TruckIcon
    },
    { 
      title: 'Sales This Month',
      value: '$12,430', 
      change: '18%', 
      changeType: 'increase',
      icon: CurrencyDollarIcon 
    },
    { 
      title: 'Low Stock Items',
      value: '24 items', 
      change: '7%', 
      changeType: 'increase',
      icon: ExclamationCircleIcon
    },
  ]

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [4500, 5200, 4800, 5900, 6500, 7200, 8000, 8700, 9300, 10200, 11000, 12430],
  }

  const activities = [
    {
      id: 1,
      title: 'New SKU mappings added',
      description: '15 new SKUs mapped to MSKU-123',
      date: '10 min ago',
      icon: TagIcon,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      id: 2,
      title: 'Data imported',
      description: 'Sales data from Amazon marketplace imported',
      date: '2 hours ago',
      icon: DocumentDuplicateIcon,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
    },
    {
      id: 3,
      title: 'Database synced',
      description: 'Database synced with latest warehouse data',
      date: '5 hours ago',
      icon: ArrowPathIcon,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
    {
      id: 4,
      title: 'Low stock alert',
      description: 'Product "Blue Widget" is running low on stock',
      date: 'Yesterday',
      icon: ExclamationCircleIcon,
      iconBg: 'bg-error-100',
      iconColor: 'text-error-600',
    },
    {
      id: 5,
      title: 'New SKU mappings added',
      description: '8 new SKUs mapped to MSKU-456',
      date: 'Yesterday',
      icon: TagIcon,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      id: 6,
      title: 'Data imported',
      description: 'Sales data from Shopify marketplace imported',
      date: '2 days ago',
      icon: DocumentDuplicateIcon,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
    },
    {
      id: 7,
      title: 'Database synced',
      description: 'Database schema updated with new fields',
      date: '3 days ago',
      icon: ArrowPathIcon,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
  ]

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white h-32 rounded-lg shadow-sm"></div>
            ))}
          </div>
          <div className="mt-8 h-64 bg-white rounded-lg shadow-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChart
            title="Monthly Sales"
            data={salesData.data}
            labels={salesData.labels}
          />
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}