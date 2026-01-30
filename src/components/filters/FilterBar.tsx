import DateRangeFilter from './DateRangeFilter'
import MultiSelectFilter from './MultiSelectFilter'
import { FilterState } from '../../types/usage'

interface FilterBarProps {
  filters: FilterState
  uniqueModels: string[]
  uniqueUsers: string[]
  dateRange: { min: Date | null; max: Date | null }
  onDateChange: (start: Date | null, end: Date | null) => void
  onModelChange: (models: string[]) => void
  onUserChange: (users: string[]) => void
  onClearFilters: () => void
  totalRecords: number
  filteredRecords: number
}

function FilterBar({
  filters,
  uniqueModels,
  uniqueUsers,
  dateRange,
  onDateChange,
  onModelChange,
  onUserChange,
  onClearFilters,
  totalRecords,
  filteredRecords,
}: FilterBarProps) {
  const hasActiveFilters = 
    filters.dateRange.start !== null || 
    filters.dateRange.end !== null || 
    filters.models.length > 0 || 
    filters.users.length > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <DateRangeFilter
          minDate={dateRange.min}
          maxDate={dateRange.max}
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onDateChange={onDateChange}
        />

        <div className="h-8 w-px bg-gray-200" />

        <MultiSelectFilter
          label="Models"
          options={uniqueModels}
          selected={filters.models}
          onChange={onModelChange}
          placeholder="All models"
        />

        <MultiSelectFilter
          label="Users"
          options={uniqueUsers}
          selected={filters.users}
          onChange={onUserChange}
          placeholder="All users"
        />

        {hasActiveFilters && (
          <>
            <div className="h-8 w-px bg-gray-200" />
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing <span className="font-semibold text-gray-900">{filteredRecords.toLocaleString()}</span>
            {filteredRecords !== totalRecords && (
              <> of <span className="font-semibold text-gray-900">{totalRecords.toLocaleString()}</span></>
            )}
            {' '}records
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
