import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CostByUserData } from '../../utils/dataTransformers'

interface CostByUserProps {
  data: CostByUserData[]
}

function CostByUser({ data }: CostByUserProps) {
  // Show top 10 users
  const topUsers = data.slice(0, 10)

  const formatCost = (value: number) => {
    if (value >= 100) {
      return `$${(value / 100).toFixed(2)}`
    }
    return `${value.toFixed(0)}¢`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users by Cost</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topUsers}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tickFormatter={formatCost}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              type="category" 
              dataKey="displayName"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              width={90}
            />
            <Tooltip
              formatter={(value: number) => [formatCost(value), 'Cost']}
              labelFormatter={(label) => `User: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar 
              dataKey="cost" 
              fill="#f97316" 
              radius={[0, 4, 4, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCost(data.reduce((sum, u) => sum + u.cost, 0) / data.length)}
          </p>
          <p className="text-xs text-gray-500">Avg Cost/User</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(data.reduce((sum, u) => sum + u.requests, 0) / data.length)}
          </p>
          <p className="text-xs text-gray-500">Avg Requests/User</p>
        </div>
      </div>
    </div>
  )
}

export default CostByUser
