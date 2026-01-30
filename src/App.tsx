import { useState } from 'react'
import { UsageEvent } from './types/usage'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'

function App() {
  const [data, setData] = useState<UsageEvent[]>([])

  const handleDataLoaded = (parsedData: UsageEvent[]) => {
    setData(parsedData)
  }

  const handleClearData = () => {
    setData([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CSV Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">AI Usage Analytics & Insights</p>
            </div>
            {data.length > 0 && (
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.length === 0 ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <Dashboard data={data} />
        )}
      </main>
    </div>
  )
}

export default App
