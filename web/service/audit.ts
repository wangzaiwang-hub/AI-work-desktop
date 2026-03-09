import type { Fetcher } from 'swr'
import { del, get, post, put } from './base'

export type OperationLog = {
  id: string
  tenant_id: string
  account_id: string
  account_name: string
  account_email: string
  action: string
  content: any
  created_at: number
  created_ip: string
}

export type OperationLogListResponse = {
  data: OperationLog[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export type OperationLogStats = {
  today_count: number
  total_count: number
  verified_count: number
  failed_count: number
}

export type OperationLogFilters = {
  page?: number
  limit?: number
  action?: string
  account_id?: string
  keyword?: string
  start_date?: string
  end_date?: string
}

export const fetchOperationLogs: Fetcher<OperationLogListResponse, OperationLogFilters> = (filters) => {
  const params = new URLSearchParams()
  if (filters.page) params.append('page', String(filters.page))
  if (filters.limit) params.append('limit', String(filters.limit))
  if (filters.action) params.append('action', filters.action)
  if (filters.account_id) params.append('account_id', filters.account_id)
  if (filters.keyword) params.append('keyword', filters.keyword)
  if (filters.start_date) params.append('start_date', filters.start_date)
  if (filters.end_date) params.append('end_date', filters.end_date)

  return get<OperationLogListResponse>(`/operation-logs?${params.toString()}`)
}

export const fetchOperationLogStats = () => {
  return get<OperationLogStats>('/operation-logs/stats')
}

export const fetchOperationLogActions = () => {
  return get<{ actions: string[] }>('/operation-logs/actions')
}
