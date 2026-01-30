import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CostOverTimeData } from '../../utils/dataTransformers'

interface UsageTimelineProps {
  data: CostOverTimeData[]
}

function UsageTimeline({ data }: UsageTimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Calculate some stats
  const totalRequests = data.reduce((sum, d) => sum + d.requests, 0)
  const avgRequestsPerDay = data.length > 0 ? Math.round(totalRequests / data.length) : 0
  const peakDay = data.reduce((max, d) => d.requests > max.requests ? d : max, data[0] || { date: '', requests: 0 })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Usage Timeline</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Requests</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              formatter={(value: number) => [value, 'Requests']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRequests)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{avgRequestsPerDay.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Avg/Day</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{peakDay?.requests?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-500">Peak Day</p>
        </div>
      </div>
    </div>
  )
}

export default UsageTimeline
