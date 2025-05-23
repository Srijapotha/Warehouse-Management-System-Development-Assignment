import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function Settings() {
  const [settings, setSettings] = useState({
    lowStockThreshold: 10,
    dateFormat: 'MM/DD/YYYY',
    defaultMarketplace: 'Amazon',
    autoMapNewSKUs: true,
    enableNotifications: true,
    theme: 'light',
  })
  
  const [loading, setLoading] = useState(true)
  const [saveInProgress, setSaveInProgress] = useState(false)

  useEffect(() => {
    // Simulate loading settings from storage or API
    const loadSettings = setTimeout(() => {
      const savedSettings = localStorage.getItem('wmsSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(loadSettings)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSave = async () => {
    setSaveInProgress(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      localStorage.setItem('wmsSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaveInProgress(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        lowStockThreshold: 10,
        dateFormat: 'MM/DD/YYYY',
        defaultMarketplace: 'Amazon',
        autoMapNewSKUs: true,
        enableNotifications: true,
        theme: 'light',
      }
      
      setSettings(defaultSettings)
      localStorage.setItem('wmsSettings', JSON.stringify(defaultSettings))
      toast.info('Settings reset to defaults')
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure your warehouse management system preferences
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Inventory Settings</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Configure how inventory is managed and displayed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                Low Stock Threshold
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="lowStockThreshold"
                  id="lowStockThreshold"
                  min="0"
                  value={settings.lowStockThreshold}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Products with stock below this threshold will be marked as low stock.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="defaultMarketplace" className="block text-sm font-medium text-gray-700">
                Default Marketplace
              </label>
              <div className="mt-1">
                <select
                  id="defaultMarketplace"
                  name="defaultMarketplace"
                  value={settings.defaultMarketplace}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Shopify">Shopify</option>
                  <option value="eBay">eBay</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Etsy">Etsy</option>
                </select>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The default marketplace to use when creating new SKU mappings.
              </p>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="autoMapNewSKUs"
                  name="autoMapNewSKUs"
                  type="checkbox"
                  checked={settings.autoMapNewSKUs}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="autoMapNewSKUs" className="font-medium text-gray-700">
                  Auto-map new SKUs
                </label>
                <p className="text-gray-500">
                  Automatically attempt to map new SKUs based on naming patterns and existing mappings.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Display Settings</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Configure how data is displayed in the interface.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                Date Format
              </label>
              <div className="mt-1">
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <div className="mt-1">
                <select
                  id="theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="enableNotifications"
                  name="enableNotifications"
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                  Enable Notifications
                </label>
                <p className="text-gray-500">
                  Show notifications for important events like low stock alerts and processing completions.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveInProgress}
              className="btn btn-primary"
            >
              {saveInProgress ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}