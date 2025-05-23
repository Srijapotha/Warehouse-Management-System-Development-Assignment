import { useState, useEffect } from 'react'
import BaserowConnector from '../components/Database/BaserowConnector'
import SchemaVisualizer from '../components/Database/SchemaVisualizer'
import { toast } from 'react-toastify'

// Mock tables data
const mockTables = [
  {
    id: 'table1',
    name: 'Products',
    fields: [
      { id: 'field1', name: 'id', type: 'UUID', primary: true },
      { id: 'field2', name: 'name', type: 'Text' },
      { id: 'field3', name: 'sku', type: 'Text' },
      { id: 'field4', name: 'msku', type: 'Text' },
      { id: 'field5', name: 'price', type: 'Decimal' },
      { id: 'field6', name: 'stock_quantity', type: 'Integer' },
      { id: 'field7', name: 'created_at', type: 'Timestamp' },
    ],
  },
  {
    id: 'table2',
    name: 'Orders',
    fields: [
      { id: 'field8', name: 'id', type: 'UUID', primary: true },
      { id: 'field9', name: 'order_number', type: 'Text' },
      { id: 'field10', name: 'customer_id', type: 'UUID' },
      { id: 'field11', name: 'order_date', type: 'Date' },
      { id: 'field12', name: 'total_amount', type: 'Decimal' },
      { id: 'field13', name: 'status', type: 'Text' },
    ],
  },
  {
    id: 'table3',
    name: 'OrderItems',
    fields: [
      { id: 'field14', name: 'id', type: 'UUID', primary: true },
      { id: 'field15', name: 'order_id', type: 'UUID' },
      { id: 'field16', name: 'product_id', type: 'UUID' },
      { id: 'field17', name: 'quantity', type: 'Integer' },
      { id: 'field18', name: 'price', type: 'Decimal' },
    ],
  },
]

export default function DatabaseManager() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [tables, setTables] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we have stored connection details
    const storedConnection = localStorage.getItem('baserowConnection')
    if (storedConnection) {
      const parsed = JSON.parse(storedConnection)
      setConnectionDetails(parsed)
      setIsConnected(true)
      loadTables()
    }
  }, [])

  const handleConnect = (details) => {
    setIsLoading(true)
    
    // Simulate connection and loading tables
    setTimeout(() => {
      setConnectionDetails(details)
      setIsConnected(true)
      localStorage.setItem('baserowConnection', JSON.stringify(details))
      loadTables()
      setIsLoading(false)
      toast.success('Connected to Baserow successfully!')
    }, 1500)
  }

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect from Baserow?')) {
      setConnectionDetails(null)
      setIsConnected(false)
      setTables([])
      localStorage.removeItem('baserowConnection')
      toast.info('Disconnected from Baserow')
    }
  }

  const loadTables = () => {
    setIsLoading(true)
    
    // Simulate loading tables from API
    setTimeout(() => {
      setTables(mockTables)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Database Manager</h1>
          <p className="mt-2 text-sm text-gray-700">
            Connect to Baserow and manage your warehouse database schema
          </p>
        </div>
        {isConnected && (
          <div className="mt-4 sm:mt-0">
            <button onClick={handleDisconnect} className="btn btn-outline">
              Disconnect
            </button>
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="mt-6">
          <BaserowConnector onConnect={handleConnect} />
        </div>
      ) : (
        <div className="mt-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Connected to Baserow</h3>
                <p className="mt-1 text-sm text-gray-500">
                  User: {connectionDetails.username}
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <span className="h-2 w-2 rounded-full bg-success-500 mr-1.5"></span>
                  Connected
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <SchemaVisualizer tables={tables} />
          )}
        </div>
      )}
    </div>
  )
}