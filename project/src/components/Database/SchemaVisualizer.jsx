export default function SchemaVisualizer({ tables }) {
  // This is a simple representation - a real implementation would include a more
  // sophisticated visualization of database relationships and schema
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Database Schema</h3>
      
      {tables.length === 0 ? (
        <p className="text-gray-500 italic">No tables defined yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">{table.name}</h4>
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between text-gray-500 border-b pb-1 mb-2">
                  <span>Field</span>
                  <span>Type</span>
                </div>
                {table.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between py-1">
                    <span className={field.primary ? 'font-medium' : ''}>
                      {field.name} {field.primary && <span className="text-xs text-primary-600">(PK)</span>}
                    </span>
                    <span className="text-gray-600 text-xs">{field.type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="text-xs text-primary-600 hover:text-primary-800">
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-xs text-error-600 hover:text-error-800">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <button className="btn btn-primary">
          Create New Table
        </button>
      </div>
    </div>
  )
}