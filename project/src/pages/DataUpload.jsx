import { useState } from 'react'
import { toast } from 'react-toastify'
import Dropzone from '../components/FileUpload/Dropzone'
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function DataUpload() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processedFiles, setProcessedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles])
  }

  const handleRemoveFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file to process')
      return
    }

    setProcessing(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 300)

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate processed results
      const newProcessedFiles = files.map((file) => ({
        name: file.name,
        status: Math.random() > 0.8 ? 'warning' : 'success',
        message: Math.random() > 0.8 ? 'Some SKUs could not be mapped' : 'File processed successfully',
        skus: Math.floor(Math.random() * 100) + 5,
        date: new Date().toLocaleString(),
      }))

      setProcessedFiles([...newProcessedFiles, ...processedFiles])
      setFiles([])
      toast.success(`${newProcessedFiles.length} files processed successfully`)
    } catch (error) {
      toast.error('Error processing files: ' + error.message)
    } finally {
      clearInterval(progressInterval)
      setUploadProgress(100)
      setTimeout(() => {
        setProcessing(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Upload</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload and process sales data files from various marketplaces
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Upload Files</h2>
        <p className="mt-1 text-sm text-gray-500">
          Drag and drop your sales data files. We support CSV, Excel (XLSX, XLS), and JSON formats.
        </p>

        <Dropzone
          onDrop={handleDrop}
          acceptedFiles={files}
          onRemove={handleRemoveFile}
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleProcessFiles}
            disabled={processing || files.length === 0}
            className="btn btn-primary"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Process Files'
            )}
          </button>
        </div>

        {processing && (
          <div className="mt-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary-600">
                    Processing Files
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {processedFiles.length > 0 && (
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Processed Files</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        File Name
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        SKUs Processed
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {processedFiles.map((file, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {file.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            {file.status === 'success' ? (
                              <CheckCircleIcon className="h-5 w-5 text-success-500 mr-1.5" />
                            ) : (
                              <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 mr-1.5" />
                            )}
                            <span
                              className={
                                file.status === 'success'
                                  ? 'text-success-800'
                                  : 'text-warning-800'
                              }
                            >
                              {file.message}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {file.skus}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {file.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}