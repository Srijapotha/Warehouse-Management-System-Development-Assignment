import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Dropzone({ onDrop, acceptedFiles, onRemove, maxFiles = 10, maxSize = 10485760 }) {
  const onDropHandler = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles)
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxFiles,
    maxSize,
  })

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop files here, or click to select files
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports CSV, Excel, and JSON files (Max {maxFiles} files, {maxSize / 1024 / 1024}MB each)
          </p>
        </div>
      </div>

      {acceptedFiles?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
          <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
            {acceptedFiles.map((file, index) => (
              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <DocumentIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => onRemove(index)}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}