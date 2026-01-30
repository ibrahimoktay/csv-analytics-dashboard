import { useState, useMemo } from 'react'
import { UserActivityData } from '../../utils/dataTransformers'
import { formatNumber } from '../../utils/dataTransformers'

interface UserActivityProps {
  data: UserActivityData[]
}

type SortKey = 'displayName' | 'totalCost' | 'totalRequests' | 'avgCostPerRequest' | 'totalTokens'
type SortDirection = 'asc' | 'desc'

function UserActivity({ data }: UserActivityProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalCost')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchTerm, setSearchTerm] = useState('')

  const sortedData = useMemo(() => {
    let filtered = data
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = data.filter(
        user => user.user.toLowerCase().includes(term) || 
                user.displayName.toLowerCase().includes(term)
      )
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
  }, [data, sortKey, sortDirection, searchTerm])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const formatCost = (cents: number) => {
    if (cents >= 100) {
      return `$${(cents / 100).toFixed(2)}`
    }
    return `${cents.toFixed(2)}¢`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('displayName')}
              >
                <div className="flex items-center gap-1">
                  User
                  <SortIcon columnKey="displayName" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('totalCost')}
              >
                <div className="flex items-center justify-end gap-1">
                  Total Cost
                  <SortIcon columnKey="totalCost" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('totalRequests')}
              >
                <div className="flex items-center justify-end gap-1">
                  Requests
                  <SortIcon columnKey="totalRequests" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('avgCostPerRequest')}
              >
                <div className="flex items-center justify-end gap-1">
                  Avg Cost
                  <SortIcon columnKey="avgCostPerRequest" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('totalTokens')}
              >
                <div className="flex items-center justify-end gap-1">
                  Tokens
                  <SortIcon columnKey="totalTokens" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Models Used
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 20).map((user, index) => (
              <tr 
                key={user.user} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.user}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-gray-900">{formatCost(user.totalCost)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-700">{user.totalRequests.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-700">{user.avgCostPerRequest.toFixed(2)}¢</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-700">{formatNumber(user.totalTokens)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {user.modelsUsed.slice(0, 2).map(model => (
                      <span 
                        key={model}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full truncate max-w-[100px]"
                        title={model}
                      >
                        {model.replace('claude-', '').replace('-thinking', ' T')}
                      </span>
                    ))}
                    {user.modelsUsed.length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                        +{user.modelsUsed.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-500">{user.lastActive}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length > 20 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing 20 of {sortedData.length} users
        </div>
      )}

      {sortedData.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No users found matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default UserActivity
