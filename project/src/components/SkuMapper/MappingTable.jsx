import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function MappingTable({ mappings, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('sku')
  const [sortDirection, setSortDirection] = useState('asc')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedMappings = [...mappings].sort((a, b) => {
    const fieldA = a[sortField]?.toLowerCase() || ''
    const fieldB = b[sortField]?.toLowerCase() || ''
    
    if (sortDirection === 'asc') {
      return fieldA.localeCompare(fieldB)
    } else {
      return fieldB.localeCompare(fieldA)
    }
  })

  const startEditing = (mapping) => {
    setEditingId(mapping.id)
    setEditData({ ...mapping })
  }

  const saveEdit = () => {
    onEdit(editData)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  // Pagination
  const totalPages = Math.ceil(sortedMappings.length / itemsPerPage)
  const paginatedMappings = sortedMappings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center">
                      SKU
                      {sortField === 'sku' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('msku')}
                  >
                    <div className="flex items-center">
                      MSKU
                      {sortField === 'msku' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('marketplace')}
                  >
                    <div className="flex items-center">
                      Marketplace
                      {sortField === 'marketplace' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th scope="col" className="relative px-3 py-3.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedMappings.map((mapping) => (
                  <tr key={mapping.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {editingId === mapping.id ? (
                        <input
                          type="text"
                          name="sku"
                          value={editData.sku}
                          onChange={handleChange}
                          className="form-input rounded-md shadow-sm w-full sm:text-sm border-gray-300"
                        />
                      ) : (
                        mapping.sku
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {editingId === mapping.id ? (
                        <input
                          type="text"
                          name="msku"
                          value={editData.msku}
                          onChange={handleChange}
                          className="form-input rounded-md shadow-sm w-full sm:text-sm border-gray-300"
                        />
                      ) : (
                        mapping.msku
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {editingId === mapping.id ? (
                        <input
                          type="text"
                          name="marketplace"
                          value={editData.marketplace}
                          onChange={handleChange}
                          className="form-input rounded-md shadow-sm w-full sm:text-sm border-gray-300"
                        />
                      ) : (
                        mapping.marketplace
                      )}
                    </td>
                    <td className="relative whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                      {editingId === mapping.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={saveEdit}
                            className="text-success-600 hover:text-success-900"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-error-600 hover:text-error-900"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(mapping)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(mapping.id)}
                            className="text-error-600 hover:text-error-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-md">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedMappings.length)}
                </span>{' '}
                of <span className="font-medium">{sortedMappings.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDownIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDownIcon className="h-5 w-5 -rotate-90" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}