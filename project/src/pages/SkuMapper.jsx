import { useState, useEffect } from 'react'
import AddMappingForm from '../components/SkuMapper/AddMappingForm'
import MappingTable from '../components/SkuMapper/MappingTable'
import { toast } from 'react-toastify'

// Mock data for initial mappings
const initialMappings = [
  { id: '1', sku: 'GOLDEN-APPLE', msku: 'APPLE-001', marketplace: 'Amazon' },
  { id: '2', sku: 'GLD', msku: 'APPLE-001', marketplace: 'Shopify' },
  { id: '3', sku: 'REDAPPLE', msku: 'APPLE-002', marketplace: 'Amazon' },
  { id: '4', sku: 'RED-A', msku: 'APPLE-002', marketplace: 'Shopify' },
  { id: '5', sku: 'WIDGET-BLUE', msku: 'WIDGET-001', marketplace: 'Amazon' },
  { id: '6', sku: 'BLUE-W', msku: 'WIDGET-001', marketplace: 'Shopify' },
  { id: '7', sku: 'WIDGET-RED', msku: 'WIDGET-002', marketplace: 'Amazon' },
  { id: '8', sku: 'RED-W', msku: 'WIDGET-002', marketplace: 'Shopify' },
  { id: '9', sku: 'GADGET-SMALL', msku: 'GADGET-001', marketplace: 'Amazon' },
  { id: '10', sku: 'SMALL-G', msku: 'GADGET-001', marketplace: 'Shopify' },
  { id: '11', sku: 'GADGET-LARGE', msku: 'GADGET-002', marketplace: 'Amazon' },
  { id: '12', sku: 'LARGE-G', msku: 'GADGET-002', marketplace: 'Shopify' },
]

export default function SkuMapper() {
  const [mappings, setMappings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate loading data from API or database
    const loadData = setTimeout(() => {
      setMappings(initialMappings)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(loadData)
  }, [])

  const handleAdd = (newMapping) => {
    // Check if SKU already exists for the same marketplace
    const exists = mappings.some(
      (m) => m.sku === newMapping.sku && m.marketplace === newMapping.marketplace
    )
    
    if (exists) {
      toast.error('This SKU already exists for the selected marketplace.')
      return
    }
    
    setMappings([...mappings, newMapping])
    toast.success('Mapping added successfully')
  }

  const handleEdit = (updatedMapping) => {
    setMappings(
      mappings.map((mapping) =>
        mapping.id === updatedMapping.id ? updatedMapping : mapping
      )
    )
    toast.success('Mapping updated successfully')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      setMappings(mappings.filter((mapping) => mapping.id !== id))
      toast.success('Mapping deleted successfully')
    }
  }

  // Filter mappings based on search term
  const filteredMappings = mappings.filter(
    (mapping) =>
      mapping.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.msku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.marketplace.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">SKU Mapper</h1>
          <p className="mt-2 text-sm text-gray-700">
            Map Stock Keeping Units (SKUs) to Master SKUs (MSKUs) across different marketplaces
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKUs, MSKUs, or marketplaces..."
              className="form-input pr-10 sm:text-sm block w-full"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <AddMappingForm onAdd={handleAdd} />

      {isLoading ? (
        <div className="mt-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded w-full mb-2"></div>
          ))}
        </div>
      ) : (
        <MappingTable 
          mappings={filteredMappings} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  )
}