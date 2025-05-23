import { useState } from 'react'

export default function BaserowConnector({ onConnect }) {
  const [apiKey, setApiKey] = useState('')
  const [baserowUrl, setBaserowUrl] = useState('https://api.baserow.io')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async (e) => {
    e.preventDefault()
    
    if (!apiKey) {
      setError('API key is required')
      return
    }
    
    setIsConnecting(true)
    setError('')
    
    try {
      // Simulate connection to Baserow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real implementation, we would make an API call to validate the connection
      // For now, we'll just simulate a successful connection
      onConnect({
        apiKey,
        baserowUrl,
        connected: true,
        username: 'demo_user',
      })
    } catch (err) {
      setError('Failed to connect to Baserow. Please check your API key and try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Connect to Baserow</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleConnect}>
        <div className="space-y-4">
          <div>
            <label htmlFor="baserowUrl" className="block text-sm font-medium text-gray-700">
              Baserow URL
            </label>
            <div className="mt-1">
              <input
                id="baserowUrl"
                name="baserowUrl"
                type="text"
                value={baserowUrl}
                onChange={(e) => setBaserowUrl(e.target.value)}
                className="form-input"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Default is https://api.baserow.io. Change only if you're using a self-hosted instance.
            </p>
          </div>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <div className="mt-1">
              <input
                id="apiKey"
                name="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can find your API key in your Baserow account settings.
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect to Baserow'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}