import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { CostByModelData } from '../../utils/dataTransformers'

interface CostByModelProps {
  data: CostByModelData[]
}

const COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#6366f1', // indigo
]

function CostByModel({ data }: CostByModelProps) {
  const formatCost = (value: number) => {
    if (value >= 100) {
      return `$${(value / 100).toFixed(2)}`
    }
    return `${value.toFixed(0)}¢`
  }

  const renderCustomLabel = ({ percentage }: { percentage: number }) => {
    if (percentage < 5) return null
    return `${percentage}%`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost by Model</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="cost"
              nameKey="model"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCost(value), 'Cost']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Model breakdown table */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.model} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700 truncate max-w-[150px]">{item.model}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">{item.requests} requests</span>
                <span className="font-medium text-gray-900">{formatCost(item.cost)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CostByModel
