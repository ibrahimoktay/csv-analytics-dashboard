import { useState, useMemo, useCallback } from 'react'
import { UsageEvent, FilterState } from '../types/usage'
import {
  filterData,
  calculateStats,
  getUniqueModels,
  getUniqueUsers,
  aggregateCostOverTime,
  aggregateCostByModel,
  aggregateCostByUser,
  aggregateTokenBreakdown,
  aggregateUserActivity,
} from '../utils/dataTransformers'

const initialFilters: FilterState = {
  dateRange: {
    start: null,
    end: null,
  },
  models: [],
  users: [],
}

export function useCSVData(rawData: UsageEvent[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  // Get unique values for filter options
  const uniqueModels = useMemo(() => getUniqueModels(rawData), [rawData])
  const uniqueUsers = useMemo(() => getUniqueUsers(rawData), [rawData])

  // Get date range from data
  const dateRange = useMemo(() => {
    if (rawData.length === 0) return { min: null, max: null }
    
    const timestamps = rawData.map(e => e.timestamp)
    return {
      min: new Date(Math.min(...timestamps)),
      max: new Date(Math.max(...timestamps)),
    }
  }, [rawData])

  // Apply filters to data
  const filteredData = useMemo(() => {
    return filterData(rawData, filters)
  }, [rawData, filters])

  // Calculate aggregated stats
  const stats = useMemo(() => calculateStats(filteredData), [filteredData])

  // Aggregated data for charts
  const costOverTime = useMemo(() => aggregateCostOverTime(filteredData), [filteredData])
  const costByModel = useMemo(() => aggregateCostByModel(filteredData), [filteredData])
  const costByUser = useMemo(() => aggregateCostByUser(filteredData), [filteredData])
  const tokenBreakdown = useMemo(() => aggregateTokenBreakdown(filteredData), [filteredData])
  const userActivity = useMemo(() => aggregateUserActivity(filteredData), [filteredData])

  // Filter update functions
  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }))
  }, [])

  const setModelFilter = useCallback((models: string[]) => {
    setFilters(prev => ({
      ...prev,
      models,
    }))
  }, [])

  const setUserFilter = useCallback((users: string[]) => {
    setFilters(prev => ({
      ...prev,
      users,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  return {
    // Raw and filtered data
    rawData,
    filteredData,
    
    // Stats
    stats,
    
    // Aggregated chart data
    costOverTime,
    costByModel,
    costByUser,
    tokenBreakdown,
    userActivity,
    
    // Filter state and options
    filters,
    uniqueModels,
    uniqueUsers,
    dateRange,
    
    // Filter actions
    setDateRange,
    setModelFilter,
    setUserFilter,
    clearFilters,
  }
}
