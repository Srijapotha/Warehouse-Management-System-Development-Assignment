import { useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function NaturalLanguageQuery({ onSubmit, isLoading, examples }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query)
    }
  }

  const handleExampleClick = (example) => {
    setQuery(example)
    onSubmit(example)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Ask Your Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        Ask questions in plain English and get insights from your warehouse data
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Show top selling products last month"
              className="form-input pr-10 w-full"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <SparklesIcon 
                className={`h-5 w-5 ${isLoading ? 'text-primary-400 animate-pulse' : 'text-gray-400'}`} 
                aria-hidden="true" 
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary ml-2"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h4>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}