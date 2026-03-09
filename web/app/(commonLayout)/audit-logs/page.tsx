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

  const pageSize = 20

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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">审计日志</h1>
      
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">总操作数</div>
            <div className="text-2xl font-bold">{stats.total_count}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">今日操作</div>
            <div className="text-2xl font-bold">{stats.today_count}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">已验证数量</div>
            <div className="text-2xl font-bold">{stats.verified_count}</div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">操作类型</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <option value="">所有操作</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">搜索</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="搜索日志..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium">用户</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                <th className="px-4 py-3 text-left text-sm font-medium">IP地址</th>
                <th className="px-4 py-3 text-left text-sm font-medium">详情</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(log.created_at * 1000).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>{log.account_name}</div>
                    <div className="text-xs text-gray-500">{log.account_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.action}</td>
                  <td className="px-4 py-3 text-sm">{log.created_ip}</td>
                  <td className="px-4 py-3 text-sm">
                    {log.content && (
                      <pre className="text-xs max-w-xs overflow-auto">
                        {JSON.stringify(log.content, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          显示 {(page - 1) * pageSize + 1} 到 {Math.min(page * pageSize, total)}，共 {total} 条
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </button>
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditLogsPage
