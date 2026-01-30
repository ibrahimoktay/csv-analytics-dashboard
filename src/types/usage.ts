export interface UsageEvent {
  timestamp: number;
  model: string;
  kind: string;
  maxMode: boolean;
  requestsCosts: number;
  isTokenBasedCall: boolean;
  userEmail: string;
  readable_timestamp: string;
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  totalCents: number;
}

export interface RawCSVRow {
  timestamp: string;
  model: string;
  kind: string;
  maxMode: string;
  requestsCosts: string;
  isTokenBasedCall: string;
  userEmail: string;
  readable_timestamp: string;
  inputTokens: string;
  outputTokens: string;
  cacheWriteTokens: string;
  cacheReadTokens: string;
  totalCents: string;
}

export interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  models: string[];
  users: string[];
}

export interface AggregatedStats {
  totalCost: number;
  totalRequests: number;
  uniqueUsers: number;
  avgCostPerRequest: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheWriteTokens: number;
  totalCacheReadTokens: number;
}
