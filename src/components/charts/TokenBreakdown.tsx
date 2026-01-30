import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TokenBreakdownData } from '../../utils/dataTransformers'
import { formatNumber } from '../../utils/dataTransformers'

interface TokenBreakdownProps {
  data: TokenBreakdownData[]
}

function TokenBreakdown({ data }: TokenBreakdownProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Calculate totals
  const totals = data.reduce(
    (acc, d) => ({
      input: acc.input + d.inputTokens,
      output: acc.output + d.outputTokens,
      cacheWrite: acc.cacheWrite + d.cacheWriteTokens,
      cacheRead: acc.cacheRead + d.cacheReadTokens,
    }),
    { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 }
  )

  const totalTokens = totals.input + totals.output + totals.cacheWrite + totals.cacheRead
  const cacheEfficiency = totalTokens > 0 
    ? Math.round((totals.cacheRead / totalTokens) * 100) 
    : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Token Breakdown</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
          <span className="text-xs text-green-700">Cache Efficiency:</span>
          <span className="text-sm font-semibold text-green-700">{cacheEfficiency}%</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tickFormatter={(value) => formatNumber(value)}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  inputTokens: 'Input Tokens',
                  outputTokens: 'Output Tokens',
                  cacheWriteTokens: 'Cache Write',
                  cacheReadTokens: 'Cache Read',
                }
                return [formatNumber(value), labels[name] || name]
              }}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend 
              formatter={(value) => {
                const labels: Record<string, string> = {
                  inputTokens: 'Input',
                  outputTokens: 'Output',
                  cacheWriteTokens: 'Cache Write',
                  cacheReadTokens: 'Cache Read',
                }
                return <span className="text-sm">{labels[value] || value}</span>
              }}
            />
            <Bar dataKey="inputTokens" stackId="a" fill="#3b82f6" />
            <Bar dataKey="outputTokens" stackId="a" fill="#f97316" />
            <Bar dataKey="cacheWriteTokens" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="cacheReadTokens" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Token type breakdown */}
      <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-500">Input</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatNumber(totals.input)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-500">Output</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatNumber(totals.output)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-500">Cache Write</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatNumber(totals.cacheWrite)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">Cache Read</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatNumber(totals.cacheRead)}</p>
        </div>
      </div>
    </div>
  )
}

export default TokenBreakdown
