import { useState, useCallback, useRef } from 'react'
import Papa from 'papaparse'
import { UsageEvent, RawCSVRow } from '../types/usage'

interface FileUploadProps {
  onDataLoaded: (data: UsageEvent[]) => void
}

function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSVRow = (row: RawCSVRow): UsageEvent => {
    return {
      timestamp: parseInt(row.timestamp) || 0,
      model: row.model || '',
      kind: row.kind || '',
      maxMode: row.maxMode === 'True' || row.maxMode === 'true',
      requestsCosts: parseFloat(row.requestsCosts) || 0,
      isTokenBasedCall: row.isTokenBasedCall === 'True' || row.isTokenBasedCall === 'true',
      userEmail: row.userEmail || '',
      readable_timestamp: row.readable_timestamp || '',
      inputTokens: parseInt(row.inputTokens) || 0,
      outputTokens: parseInt(row.outputTokens) || 0,
      cacheWriteTokens: parseInt(row.cacheWriteTokens) || 0,
      cacheReadTokens: parseInt(row.cacheReadTokens) || 0,
      totalCents: parseFloat(row.totalCents) || 0,
    }
  }

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    const results: UsageEvent[] = []
    let rowCount = 0

    Papa.parse<RawCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      chunk: (chunk) => {
        const parsedRows = chunk.data.map(parseCSVRow)
        results.push(...parsedRows)
        rowCount += chunk.data.length
        // Estimate progress based on bytes processed
        const bytesProcessed = chunk.meta.cursor
        const totalBytes = file.size
        setProgress(Math.min(95, Math.round((bytesProcessed / totalBytes) * 100)))
      },
      complete: () => {
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          onDataLoaded(results)
        }, 300)
      },
      error: (err) => {
        setIsLoading(false)
        setError(`Error parsing CSV: ${err.message}`)
      },
    })
  }, [onDataLoaded])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full max-w-2xl p-12 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
            : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
          }
          ${isLoading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center text-center">
          {isLoading ? (
            <>
              <div className="w-16 h-16 mb-4">
                <svg className="animate-spin w-full h-full text-primary-500" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Processing CSV...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse from your computer
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Supports CSV files with usage event data</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl w-full">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p className="font-medium mb-2">Expected CSV columns:</p>
        <code className="text-xs bg-gray-100 px-3 py-1 rounded">
          timestamp, model, kind, userEmail, totalCents, inputTokens, outputTokens, ...
        </code>
      </div>
    </div>
  )
}

export default FileUpload
