import type { Fetcher } from 'swr'
import { del, get, post, put } from './base'

export type OperationLog = {
  id: string
  action: string
  content: any
  created_at: string
  created_ip: string
}

export type OperationLogListResponse = {
  data: OperationLog[]
  total: number
  page: number
  limit: number
}

export type OperationLogStats = {
  today: number
  total: number
}

export type OperationLogFilters = {
  page?: number
  limit?: number
  action?: string
  keyword?: string
}

export const fetchOperationLogs: Fetcher<OperationLogListResponse, OperationLogFilters> = (filters) => {
  const params = new URLSearchParams()
  if (filters.page) params.append('page', String(filters.page))
  if (filters.limit) params.append('limit', String(filters.limit))
  if (filters.action) params.append('action', filters.action)
  if (filters.keyword) params.append('keyword', filters.keyword)

  return get<OperationLogListResponse>(`/audit-logs?${params.toString()}`)
}

export const fetchOperationLogStats = () => {
  return get<OperationLogStats>('/audit-logs/stats')
}

export const fetchOperationLogActions = () => {
  return get<{ actions: string[] }>('/audit-logs/actions')
}
