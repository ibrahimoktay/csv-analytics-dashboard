import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface DateRangeFilterProps {
  minDate: Date | null
  maxDate: Date | null
  startDate: Date | null
  endDate: Date | null
  onDateChange: (start: Date | null, end: Date | null) => void
}

function DateRangeFilter({ minDate, maxDate, startDate, endDate, onDateChange }: DateRangeFilterProps) {
  const [localStart, setLocalStart] = useState<string>('')
  const [localEnd, setLocalEnd] = useState<string>('')

  useEffect(() => {
    setLocalStart(startDate ? format(startDate, 'yyyy-MM-dd') : '')
    setLocalEnd(endDate ? format(endDate, 'yyyy-MM-dd') : '')
  }, [startDate, endDate])

  const handleStartChange = (value: string) => {
    setLocalStart(value)
    const newStart = value ? new Date(value) : null
    onDateChange(newStart, endDate)
  }

  const handleEndChange = (value: string) => {
    setLocalEnd(value)
    const newEnd = value ? new Date(value + 'T23:59:59') : null
    onDateChange(startDate, newEnd)
  }

  const handleClear = () => {
    setLocalStart('')
    setLocalEnd('')
    onDateChange(null, null)
  }

  const handleSetRange = (days: number) => {
    if (!maxDate) return
    const end = maxDate
    const start = new Date(end)
    start.setDate(start.getDate() - days)
    onDateChange(start, end)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">From:</label>
        <input
          type="date"
          value={localStart}
          onChange={(e) => handleStartChange(e.target.value)}
          min={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
          max={localEnd || (maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">To:</label>
        <input
          type="date"
          value={localEnd}
          onChange={(e) => handleEndChange(e.target.value)}
          min={localStart || (minDate ? format(minDate, 'yyyy-MM-dd') : undefined)}
          max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
        <button
          onClick={() => handleSetRange(7)}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          7d
        </button>
        <button
          onClick={() => handleSetRange(14)}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          14d
        </button>
        <button
          onClick={() => handleSetRange(30)}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          30d
        </button>
        <button
          onClick={handleClear}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          All
        </button>
      </div>
    </div>
  )
}

export default DateRangeFilter
