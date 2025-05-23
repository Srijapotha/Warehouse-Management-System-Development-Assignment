import { useState } from 'react'

export default function AddMappingForm({ onAdd }) {
  const [formData, setFormData] = useState({
    sku: '',
    msku: '',
    marketplace: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }
    if (!formData.msku.trim()) {
      newErrors.msku = 'MSKU is required'
    }
    if (!formData.marketplace.trim()) {
      newErrors.marketplace = 'Marketplace is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    
    if (Object.keys(newErrors).length === 0) {
      onAdd({ ...formData, id: Date.now().toString() })
      setFormData({ sku: '', msku: '', marketplace: '' })
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Mapping</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`form-input ${errors.sku ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
            </div>
            {errors.sku && <p className="mt-2 text-sm text-error-600">{errors.sku}</p>}
          </div>

          <div>
            <label htmlFor="msku" className="block text-sm font-medium text-gray-700">
              MSKU
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="msku"
                id="msku"
                value={formData.msku}
                onChange={handleChange}
                className={`form-input ${errors.msku ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
            </div>
            {errors.msku && <p className="mt-2 text-sm text-error-600">{errors.msku}</p>}
          </div>

          <div>
            <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700">
              Marketplace
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="marketplace"
                id="marketplace"
                value={formData.marketplace}
                onChange={handleChange}
                className={`form-input ${errors.marketplace ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
            </div>
            {errors.marketplace && <p className="mt-2 text-sm text-error-600">{errors.marketplace}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Add Mapping
          </button>
        </div>
      </form>
    </div>
  )
}