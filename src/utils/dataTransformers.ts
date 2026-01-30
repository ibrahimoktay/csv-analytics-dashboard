import { UsageEvent, AggregatedStats, FilterState } from '../types/usage'
import { format, parseISO, startOfDay, startOfHour } from 'date-fns'

export function calculateStats(data: UsageEvent[]): AggregatedStats {
  const totalCost = data.reduce((sum, event) => sum + event.totalCents, 0)
  const totalRequests = data.length
  const uniqueUsers = new Set(data.map(event => event.userEmail)).size
  const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0
  
  const totalInputTokens = data.reduce((sum, event) => sum + event.inputTokens, 0)
  const totalOutputTokens = data.reduce((sum, event) => sum + event.outputTokens, 0)
  const totalCacheWriteTokens = data.reduce((sum, event) => sum + event.cacheWriteTokens, 0)
  const totalCacheReadTokens = data.reduce((sum, event) => sum + event.cacheReadTokens, 0)
  const totalTokens = totalInputTokens + totalOutputTokens + totalCacheWriteTokens + totalCacheReadTokens

  return {
    totalCost,
    totalRequests,
    uniqueUsers,
    avgCostPerRequest,
    totalTokens,
    totalInputTokens,
    totalOutputTokens,
    totalCacheWriteTokens,
    totalCacheReadTokens,
  }
}

export function filterData(data: UsageEvent[], filters: FilterState): UsageEvent[] {
  return data.filter(event => {
    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const eventDate = new Date(event.timestamp)
      if (filters.dateRange.start && eventDate < filters.dateRange.start) return false
      if (filters.dateRange.end && eventDate > filters.dateRange.end) return false
    }

    // Model filter
    if (filters.models.length > 0 && !filters.models.includes(event.model)) {
      return false
    }

    // User filter
    if (filters.users.length > 0 && !filters.users.includes(event.userEmail)) {
      return false
    }

    return true
  })
}

export function getUniqueModels(data: UsageEvent[]): string[] {
  return [...new Set(data.map(event => event.model))].sort()
}

export function getUniqueUsers(data: UsageEvent[]): string[] {
  return [...new Set(data.map(event => event.userEmail))].sort()
}

export interface CostOverTimeData {
  date: string;
  cost: number;
  requests: number;
}

export function aggregateCostOverTime(data: UsageEvent[], granularity: 'day' | 'hour' = 'day'): CostOverTimeData[] {
  const aggregated = new Map<string, { cost: number; requests: number }>()

  data.forEach(event => {
    const date = event.readable_timestamp 
      ? parseISO(event.readable_timestamp)
      : new Date(event.timestamp)
    
    const key = granularity === 'day' 
      ? format(startOfDay(date), 'yyyy-MM-dd')
      : format(startOfHour(date), 'yyyy-MM-dd HH:00')

    const existing = aggregated.get(key) || { cost: 0, requests: 0 }
    aggregated.set(key, {
      cost: existing.cost + event.totalCents,
      requests: existing.requests + 1,
    })
  })

  return Array.from(aggregated.entries())
    .map(([date, values]) => ({
      date,
      cost: Math.round(values.cost * 100) / 100,
      requests: values.requests,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export interface CostByModelData {
  model: string;
  cost: number;
  requests: number;
  percentage: number;
}

export function aggregateCostByModel(data: UsageEvent[]): CostByModelData[] {
  const aggregated = new Map<string, { cost: number; requests: number }>()
  let totalCost = 0

  data.forEach(event => {
    const existing = aggregated.get(event.model) || { cost: 0, requests: 0 }
    aggregated.set(event.model, {
      cost: existing.cost + event.totalCents,
      requests: existing.requests + 1,
    })
    totalCost += event.totalCents
  })

  return Array.from(aggregated.entries())
    .map(([model, values]) => ({
      model,
      cost: Math.round(values.cost * 100) / 100,
      requests: values.requests,
      percentage: totalCost > 0 ? Math.round((values.cost / totalCost) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.cost - a.cost)
}

export interface CostByUserData {
  user: string;
  displayName: string;
  cost: number;
  requests: number;
  avgCost: number;
}

export function aggregateCostByUser(data: UsageEvent[]): CostByUserData[] {
  const aggregated = new Map<string, { cost: number; requests: number }>()

  data.forEach(event => {
    const existing = aggregated.get(event.userEmail) || { cost: 0, requests: 0 }
    aggregated.set(event.userEmail, {
      cost: existing.cost + event.totalCents,
      requests: existing.requests + 1,
    })
  })

  return Array.from(aggregated.entries())
    .map(([user, values]) => ({
      user,
      displayName: user.split('@')[0],
      cost: Math.round(values.cost * 100) / 100,
      requests: values.requests,
      avgCost: Math.round((values.cost / values.requests) * 100) / 100,
    }))
    .sort((a, b) => b.cost - a.cost)
}

export interface TokenBreakdownData {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
}

export function aggregateTokenBreakdown(data: UsageEvent[]): TokenBreakdownData[] {
  const aggregated = new Map<string, {
    inputTokens: number;
    outputTokens: number;
    cacheWriteTokens: number;
    cacheReadTokens: number;
  }>()

  data.forEach(event => {
    const date = event.readable_timestamp 
      ? parseISO(event.readable_timestamp)
      : new Date(event.timestamp)
    
    const key = format(startOfDay(date), 'yyyy-MM-dd')

    const existing = aggregated.get(key) || {
      inputTokens: 0,
      outputTokens: 0,
      cacheWriteTokens: 0,
      cacheReadTokens: 0,
    }
    
    aggregated.set(key, {
      inputTokens: existing.inputTokens + event.inputTokens,
      outputTokens: existing.outputTokens + event.outputTokens,
      cacheWriteTokens: existing.cacheWriteTokens + event.cacheWriteTokens,
      cacheReadTokens: existing.cacheReadTokens + event.cacheReadTokens,
    })
  })

  return Array.from(aggregated.entries())
    .map(([date, values]) => ({
      date,
      ...values,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export interface UserActivityData {
  user: string;
  displayName: string;
  totalCost: number;
  totalRequests: number;
  avgCostPerRequest: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  modelsUsed: string[];
  lastActive: string;
}

export function aggregateUserActivity(data: UsageEvent[]): UserActivityData[] {
  const aggregated = new Map<string, {
    totalCost: number;
    totalRequests: number;
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    models: Set<string>;
    lastTimestamp: number;
  }>()

  data.forEach(event => {
    const existing = aggregated.get(event.userEmail) || {
      totalCost: 0,
      totalRequests: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      models: new Set<string>(),
      lastTimestamp: 0,
    }

    existing.totalCost += event.totalCents
    existing.totalRequests += 1
    existing.inputTokens += event.inputTokens
    existing.outputTokens += event.outputTokens
    existing.cacheReadTokens += event.cacheReadTokens
    existing.cacheWriteTokens += event.cacheWriteTokens
    existing.models.add(event.model)
    existing.lastTimestamp = Math.max(existing.lastTimestamp, event.timestamp)

    aggregated.set(event.userEmail, existing)
  })

  return Array.from(aggregated.entries())
    .map(([user, values]) => ({
      user,
      displayName: user.split('@')[0],
      totalCost: Math.round(values.totalCost * 100) / 100,
      totalRequests: values.totalRequests,
      avgCostPerRequest: Math.round((values.totalCost / values.totalRequests) * 100) / 100,
      totalTokens: values.inputTokens + values.outputTokens + values.cacheReadTokens + values.cacheWriteTokens,
      inputTokens: values.inputTokens,
      outputTokens: values.outputTokens,
      cacheReadTokens: values.cacheReadTokens,
      cacheWriteTokens: values.cacheWriteTokens,
      modelsUsed: Array.from(values.models),
      lastActive: format(new Date(values.lastTimestamp), 'yyyy-MM-dd HH:mm'),
    }))
    .sort((a, b) => b.totalCost - a.totalCost)
}

export function formatCurrency(cents: number): string {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

export function formatCents(cents: number): string {
  if (cents >= 100) {
    return formatCurrency(cents)
  }
  return `${cents.toFixed(2)}¢`
}
