'use client'

import { useState, useEffect } from 'react'
import { fetchOperationLogs, fetchOperationLogStats, fetchOperationLogActions } from '@/service/audit'
import type { OperationLog, OperationLogStats } from '@/service/audit'

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<OperationLog[]>([])
  const [stats, setStats] = useState<OperationLogStats | null>(null)
  const [actions, setActions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    action: '',
    keyword: '',
  })

  const pageSize = 10

  // 操作类型中文映射
  const actionNameMap: Record<string, string> = {
    'file_mask': '文件脱敏',
    'file_delete': '文件删除',
    'file_restore': '文件恢复',
    'knowledge_sync': '知识库同步',
    'rule_create': '规则创建',
    'rule_update': '规则更新',
    'rule_delete': '规则删除',
  }

  useEffect(() => {
    loadData()
  }, [page, filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const [logsRes, statsRes, actionsRes] = await Promise.all([
        fetchOperationLogs({ page, limit: pageSize, ...filters }),
        fetchOperationLogStats(),
        fetchOperationLogActions(),
      ])
      
      setLogs(logsRes.data)
      setTotal(logsRes.total)
      setStats(statsRes)
      setActions(actionsRes.actions)
    }
    catch (error) {
      console.error('Failed to load audit logs:', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-0 shrink-0 grow flex-col overflow-y-auto bg-background-body">
      {/* Top header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-body px-12 pb-4 pt-7">
        <h2 className="text-lg font-semibold text-text-primary">审计日志</h2>
      </div>

      {/* Content area */}
      <div className="px-12 pb-8 space-y-4">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-components-panel-bg border border-divider-regular rounded-lg p-4">
              <div className="text-xs text-text-tertiary mb-1">总操作数</div>
              <div className="text-2xl font-semibold text-text-primary">{stats.total || 0}</div>
            </div>
            <div className="bg-components-panel-bg border border-divider-regular rounded-lg p-4">
              <div className="text-xs text-text-tertiary mb-1">今日操作</div>
              <div className="text-2xl font-semibold text-text-primary">{stats.today || 0}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-components-panel-bg border border-divider-regular rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">操作类型</label>
              <select
                className="w-full border border-divider-regular rounded-lg px-3 py-2 text-sm text-text-primary bg-components-input-bg-normal focus:outline-none focus:ring-2 focus:ring-components-button-primary-bg appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              >
                <option value="">所有操作</option>
                {actions.map(action => (
                  <option key={action} value={action}>
                    {actionNameMap[action] || action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">搜索</label>
              <input
                type="text"
                className="w-full border border-divider-regular rounded-lg px-3 py-2 text-sm text-text-primary bg-components-input-bg-normal placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-components-button-primary-bg"
                placeholder="搜索日志..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading && logs.length === 0 ? (
          <div className="bg-components-panel-bg border border-divider-regular rounded-lg p-12 text-center">
            <div className="text-sm text-text-tertiary">加载中...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-components-panel-bg border border-divider-regular rounded-lg p-12 text-center">
            <div className="text-sm text-text-tertiary">暂无数据</div>
          </div>
        ) : (
          <div className="bg-components-panel-bg border border-divider-regular rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-section-burn border-b border-divider-regular">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">时间</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">操作</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">文件名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">大小</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">IP地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider-subtle">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-state-base-hover transition-colors">
                      <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }) : 'Invalid Date'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-primary whitespace-nowrap">
                        {actionNameMap[log.action] || log.action}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate" title={log.content?.file_name}>
                        {log.content?.file_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                        {log.content?.size ? `${(log.content.size / 1024).toFixed(2)} KB` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{log.created_ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-xs text-text-tertiary">
              显示 {(page - 1) * pageSize + 1} 到 {Math.min(page * pageSize, total)}，共 {total} 条
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 text-sm text-text-secondary border border-divider-regular rounded-lg hover:bg-state-base-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </button>
              <span className="px-3 py-1.5 text-sm text-text-tertiary">
                第 {page} 页
              </span>
              <button
                className="px-3 py-1.5 text-sm text-text-secondary border border-divider-regular rounded-lg hover:bg-state-base-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={page * pageSize >= total}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </button>
              <span className="text-xs text-text-quaternary mx-2">跳转到</span>
              <input
                type="number"
                min="1"
                max={Math.ceil(total / pageSize)}
                className="w-16 px-2 py-1.5 text-sm text-text-primary border border-divider-regular rounded-lg bg-components-input-bg-normal focus:outline-none focus:ring-2 focus:ring-components-button-primary-bg"
                placeholder={String(page)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt((e.target as HTMLInputElement).value)
                    const maxPage = Math.ceil(total / pageSize)
                    if (value >= 1 && value <= maxPage) {
                      setPage(value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
              />
              <span className="text-xs text-text-quaternary">页</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogsPage
