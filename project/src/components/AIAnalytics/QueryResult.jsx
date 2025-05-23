import { useEffect, useState } from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function QueryResult({ result, isLoading, error }) {
  const [chartData, setChartData] = useState(null)
  
  useEffect(() => {
    if (result?.data && result.visualization === 'bar') {
      const data = {
        labels: result.data.map(item => item.label),
        datasets: [
          {
            label: result.title,
            data: result.data.map(item => item.value),
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
          },
        ],
      }
      setChartData(data)
    }
  }, [result])

  if (isLoading) {
    return (
      <div className="mt-6 bg-white shadow-sm rounded-lg p-6 flex flex-col items-center justify-center h-64">
        <div className="animate-pulse-slow flex flex-col items-center justify-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
        <div className="bg-error-50 text-error-700 p-4 rounded-md flex items-start">
          <div className="flex-shrink-0 mr-3">
            <DocumentTextIcon className="h-5 w-5 text-error-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Error Processing Query</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{result.title}</h3>
      
      {result.summary && (
        <p className="text-sm text-gray-600 mb-6">{result.summary}</p>
      )}
      
      {result.visualization === 'table' && result.data && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {result.columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {result.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {result.columns.map((column, colIndex) => (
                    <td key={colIndex} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {result.visualization === 'bar' && chartData && (
        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      )}
      
      {result.sql && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <details className="text-sm">
            <summary className="text-primary-600 cursor-pointer font-medium">View SQL Query</summary>
            <pre className="mt-2 bg-gray-50 p-4 rounded-md overflow-x-auto text-xs text-gray-700">
              {result.sql}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}