import { useState } from 'react'
import NaturalLanguageQuery from '../components/AIAnalytics/NaturalLanguageQuery'
import QueryResult from '../components/AIAnalytics/QueryResult'
import { toast } from 'react-toastify'

// Sample example queries
const exampleQueries = [
  'Show me top selling products this month',
  'What products are low in stock?',
  'Compare sales across marketplaces',
  'Which SKUs have the most mapping issues?',
  'Show inventory value by product category',
]

export default function AIAnalytics() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [queryResult, setQueryResult] = useState(null)
  const [queryHistory, setQueryHistory] = useState([])

  const handleSubmitQuery = async (query) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, we'll return mock data based on the query
      let result
      
      if (query.toLowerCase().includes('top selling')) {
        result = {
          title: 'Top Selling Products This Month',
          summary: 'These products have had the highest sales volume in the last 30 days.',
          visualization: 'bar',
          data: [
            { label: 'Blue Widget', value: 345 },
            { label: 'Red Gadget', value: 289 },
            { label: 'Golden Apple', value: 258 },
            { label: 'Silver Tool', value: 197 },
            { label: 'Green Device', value: 156 },
          ],
          sql: 'SELECT p.name, SUM(oi.quantity) as sold\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nJOIN orders o ON oi.order_id = o.id\nWHERE o.order_date >= CURRENT_DATE - INTERVAL \'30 days\'\nGROUP BY p.name\nORDER BY sold DESC\nLIMIT 5;',
        }
      } else if (query.toLowerCase().includes('low in stock')) {
        result = {
          title: 'Products Low in Stock',
          summary: 'These products have inventory levels below the minimum threshold.',
          visualization: 'table',
          columns: ['Product', 'SKU', 'Current Stock', 'Reorder Level', 'Status'],
          data: [
            { 
              'Product': 'Blue Widget', 
              'SKU': 'WIDGET-BLUE', 
              'Current Stock': 5, 
              'Reorder Level': 10, 
              'Status': 'Critical' 
            },
            { 
              'Product': 'Red Gadget', 
              'SKU': 'GADGET-RED', 
              'Current Stock': 8, 
              'Reorder Level': 15, 
              'Status': 'Critical' 
            },
            { 
              'Product': 'Green Device', 
              'SKU': 'DEVICE-GREEN', 
              'Current Stock': 12, 
              'Reorder Level': 15, 
              'Status': 'Warning' 
            },
            { 
              'Product': 'Purple Tool', 
              'SKU': 'TOOL-PURPLE', 
              'Current Stock': 14, 
              'Reorder Level': 20, 
              'Status': 'Warning' 
            },
          ],
          sql: 'SELECT p.name as "Product", p.sku as "SKU", p.stock_quantity as "Current Stock", p.reorder_level as "Reorder Level",\nCASE\n  WHEN p.stock_quantity < p.reorder_level * 0.6 THEN \'Critical\'\n  WHEN p.stock_quantity < p.reorder_level THEN \'Warning\'\n  ELSE \'OK\'\nEND as "Status"\nFROM products p\nWHERE p.stock_quantity < p.reorder_level\nORDER BY p.stock_quantity / p.reorder_level ASC;',
        }
      } else if (query.toLowerCase().includes('marketplaces')) {
        result = {
          title: 'Sales Comparison Across Marketplaces',
          summary: 'Sales distribution across different marketplaces in the past 90 days.',
          visualization: 'bar',
          data: [
            { label: 'Amazon', value: 42500 },
            { label: 'Shopify', value: 35800 },
            { label: 'eBay', value: 21200 },
            { label: 'Walmart', value: 18600 },
            { label: 'Etsy', value: 12400 },
          ],
          sql: 'SELECT m.name as marketplace, SUM(o.total_amount) as total_sales\nFROM orders o\nJOIN marketplaces m ON o.marketplace_id = m.id\nWHERE o.order_date >= CURRENT_DATE - INTERVAL \'90 days\'\nGROUP BY m.name\nORDER BY total_sales DESC;',
        }
      } else if (query.toLowerCase().includes('mapping issues')) {
        result = {
          title: 'SKUs with Mapping Issues',
          summary: 'These SKUs have the most reported mapping inconsistencies.',
          visualization: 'table',
          columns: ['SKU', 'MSKU', 'Marketplace', 'Issue Count', 'Last Reported'],
          data: [
            { 
              'SKU': 'WIDGET-RED', 
              'MSKU': 'WIDGET-002', 
              'Marketplace': 'Amazon', 
              'Issue Count': 12, 
              'Last Reported': '2023-10-15' 
            },
            { 
              'SKU': 'GOLDEN-APPLE', 
              'MSKU': 'APPLE-001', 
              'Marketplace': 'Shopify', 
              'Issue Count': 8, 
              'Last Reported': '2023-10-18' 
            },
            { 
              'SKU': 'BLUE-W', 
              'MSKU': 'WIDGET-001', 
              'Marketplace': 'eBay', 
              'Issue Count': 7, 
              'Last Reported': '2023-10-12' 
            },
            { 
              'SKU': 'GADGET-SMALL', 
              'MSKU': 'GADGET-001', 
              'Marketplace': 'Walmart', 
              'Issue Count': 5, 
              'Last Reported': '2023-10-20' 
            },
          ],
          sql: 'SELECT s.sku as "SKU", s.msku as "MSKU", m.name as "Marketplace", COUNT(i.id) as "Issue Count", MAX(i.reported_date) as "Last Reported"\nFROM sku_mappings s\nJOIN mapping_issues i ON s.id = i.sku_mapping_id\nJOIN marketplaces m ON s.marketplace_id = m.id\nGROUP BY s.sku, s.msku, m.name\nORDER BY "Issue Count" DESC\nLIMIT 10;',
        }
      } else if (query.toLowerCase().includes('inventory value')) {
        result = {
          title: 'Inventory Value by Product Category',
          summary: 'Current inventory value broken down by product categories.',
          visualization: 'bar',
          data: [
            { label: 'Electronics', value: 285600 },
            { label: 'Apparel', value: 164200 },
            { label: 'Home Goods', value: 142800 },
            { label: 'Toys', value: 98400 },
            { label: 'Office Supplies', value: 76500 },
          ],
          sql: 'SELECT c.name as category, SUM(p.price * p.stock_quantity) as inventory_value\nFROM products p\nJOIN categories c ON p.category_id = c.id\nGROUP BY c.name\nORDER BY inventory_value DESC;',
        }
      } else {
        result = {
          title: 'Query Analysis',
          summary: `Analysis results for: "${query}"`,
          visualization: 'table',
          columns: ['Metric', 'Value', 'Change'],
          data: [
            { 'Metric': 'Total Sales', 'Value': '$125,430', 'Change': '+12.5%' },
            { 'Metric': 'Average Order Value', 'Value': '$78.25', 'Change': '+3.2%' },
            { 'Metric': 'Inventory Turnover', 'Value': '4.8', 'Change': '-0.7%' },
            { 'Metric': 'Stock-out Events', 'Value': '24', 'Change': '+15.0%' },
          ],
          sql: 'SELECT\n  \'Total Sales\' as "Metric",\n  CONCAT(\'$\', FORMAT(SUM(o.total_amount), \'N0\')) as "Value",\n  CONCAT(\'%\', ROUND(((SUM(o.total_amount) / prev.total_sales) - 1) * 100, 1)) as "Change"\nFROM orders o\nCROSS JOIN (\n  SELECT SUM(total_amount) as total_sales FROM orders WHERE order_date BETWEEN CURRENT_DATE - INTERVAL \'60 days\' AND CURRENT_DATE - INTERVAL \'30 days\'\n) prev\nWHERE o.order_date >= CURRENT_DATE - INTERVAL \'30 days\'\nUNION ALL\n-- more metrics follow similar pattern',
        }
      }
      
      // Add to query history
      setQueryHistory([{ query, timestamp: new Date().toISOString() }, ...queryHistory])
      
      setQueryResult(result)
      toast.success('Query processed successfully')
    } catch (err) {
      setError('Failed to process your query. Please try again or rephrase your question.')
      toast.error('Error processing query')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Ask questions about your warehouse data in plain English
          </p>
        </div>
      </div>

      <div className="mt-6">
        <NaturalLanguageQuery 
          onSubmit={handleSubmitQuery} 
          isLoading={isLoading}
          examples={exampleQueries}
        />
        
        <QueryResult 
          result={queryResult} 
          isLoading={isLoading} 
          error={error}
        />
      </div>

      {queryHistory.length > 0 && (
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Queries</h3>
          <ul className="divide-y divide-gray-200">
            {queryHistory.slice(0, 5).map((item, index) => (
              <li key={index} className="py-3">
                <button
                  onClick={() => handleSubmitQuery(item.query)}
                  className="text-left w-full hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{item.query}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}