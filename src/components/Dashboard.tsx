import { UsageEvent } from '../types/usage'
import { useCSVData } from '../hooks/useCSVData'
import SummaryCards from './stats/SummaryCards'
import CostOverTime from './charts/CostOverTime'
import CostByModel from './charts/CostByModel'
import CostByUser from './charts/CostByUser'
import UsageTimeline from './charts/UsageTimeline'
import TokenBreakdown from './charts/TokenBreakdown'
import UserActivity from './charts/UserActivity'
import FilterBar from './filters/FilterBar'

interface DashboardProps {
  data: UsageEvent[]
}

function Dashboard({ data }: DashboardProps) {
  const {
    filteredData,
    stats,
    costOverTime,
    costByModel,
    costByUser,
    tokenBreakdown,
    userActivity,
    filters,
    uniqueModels,
    uniqueUsers,
    dateRange,
    setDateRange,
    setModelFilter,
    setUserFilter,
    clearFilters,
  } = useCSVData(data)

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        uniqueModels={uniqueModels}
        uniqueUsers={uniqueUsers}
        dateRange={dateRange}
        onDateChange={setDateRange}
        onModelChange={setModelFilter}
        onUserChange={setUserFilter}
        onClearFilters={clearFilters}
        totalRecords={data.length}
        filteredRecords={filteredData.length}
      />

      {/* Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostOverTime data={costOverTime} />
        <CostByModel data={costByModel} />
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageTimeline data={costOverTime} />
        <TokenBreakdown data={tokenBreakdown} />
      </div>

      {/* Charts Grid - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostByUser data={costByUser} />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Date Range</span>
              <span className="text-sm font-medium text-gray-900">
                {dateRange.min && dateRange.max 
                  ? `${dateRange.min.toLocaleDateString()} - ${dateRange.max.toLocaleDateString()}`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Models Used</span>
              <span className="text-sm font-medium text-gray-900">{uniqueModels.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Most Used Model</span>
              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {costByModel[0]?.model || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Top Spender</span>
              <span className="text-sm font-medium text-gray-900">
                {costByUser[0]?.displayName || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Cache Hit Rate</span>
              <span className="text-sm font-medium text-green-600">
                {stats.totalTokens > 0 
                  ? `${Math.round((stats.totalCacheReadTokens / stats.totalTokens) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Table - Full Width */}
      <UserActivity data={userActivity} />
    </div>
  )
}

export default Dashboard
