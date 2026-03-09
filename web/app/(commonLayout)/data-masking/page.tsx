'use client'
import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  RiShieldCheckLine,
  RiSettings4Line,
  RiAddLine,
  RiDeleteBinLine,
  RiToggleLine,
  RiToggleFill,
  RiEditLine,
  RiRefreshLine,
  RiFolderLine,
} from '@remixicon/react'
import { useSearchParams } from 'next/navigation'
import useDocumentTitle from '@/hooks/use-document-title'
import { RulesManager } from '@/lib/data-masking/rules-manager'
import type { MaskingRule } from '@/lib/data-masking/types'
import { FileMasking } from '@/app/components/data-masking/file-masking'
import { FileList } from '@/app/components/data-masking/file-list'
import { FileRestore } from '@/app/components/data-masking/file-restore'
import { SandboxTransfer } from '@/app/components/data-masking/sandbox-transfer'
import { RuleForm } from '@/app/components/data-masking/rule-form'

type TabType = 'mask' | 'restore' | 'rules' | 'files' | 'transfer'

function NeedSandbox() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <RiSettings4Line className="w-12 h-12 text-text-quaternary mb-4" />
      <h3 className="text-sm font-medium text-text-primary mb-1">请先配置沙箱路径</h3>
      <p className="text-xs text-text-tertiary mb-4">请在「设置 → 数据安全」中配置沙箱目录</p>
    </div>
  )
}

function RulesPanel({
  rules,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onRefresh,
}: {
  rules: MaskingRule[]
  isLoading: boolean
  onAdd: () => void
  onEdit: (rule: MaskingRule) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onRefresh: () => void
}) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-sm text-text-tertiary">加载中...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-tertiary">{rules.length} 条规则</span>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="p-1.5 rounded hover:bg-state-base-hover" title="刷新">
            <RiRefreshLine className="w-4 h-4 text-text-tertiary" />
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-components-button-primary-text bg-components-button-primary-bg rounded-lg hover:bg-components-button-primary-bg-hover"
          >
            <RiAddLine className="w-4 h-4" />新建规则
          </button>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12">
          <RiShieldCheckLine className="mx-auto w-12 h-12 text-text-quaternary mb-3" />
          <p className="text-sm text-text-tertiary">暂无脱敏规则</p>
          <p className="text-xs text-text-quaternary mt-1">点击「新建规则」或使用预设模板快速创建</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map(rule => (
            <div
              key={rule.id}
              className={`border rounded-lg p-3 transition-colors ${rule.enabled ? 'border-divider-regular bg-components-panel-bg' : 'border-divider-subtle bg-background-section opacity-60'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">{rule.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-background-section text-text-tertiary">
                      {rule.strategy.type}
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-xs text-text-tertiary mt-0.5 truncate">{rule.description}</p>
                  )}
                  <p className="text-xs text-text-quaternary mt-1 font-mono truncate">
                    {typeof rule.pattern === 'string' ? rule.pattern : rule.pattern.source}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-3 shrink-0">
                  <button onClick={() => onToggle(rule.id)} className="p-1 rounded hover:bg-state-base-hover" title={rule.enabled ? '禁用' : '启用'}>
                    {rule.enabled
                      ? <RiToggleFill className="w-5 h-5 text-text-accent" />
                      : <RiToggleLine className="w-5 h-5 text-text-quaternary" />}
                  </button>
                  <button onClick={() => onEdit(rule)} className="p-1 rounded hover:bg-state-base-hover" title="编辑">
                    <RiEditLine className="w-4 h-4 text-text-tertiary" />
                  </button>
                  <button onClick={() => onDelete(rule.id)} className="p-1 rounded hover:bg-state-base-hover" title="删除">
                    <RiDeleteBinLine className="w-4 h-4 text-text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DataMaskingPage() {
  useDocumentTitle('数据脱敏')

  const searchParams = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabType) || 'mask'
  const [sandboxPath, setSandboxPath] = useState('')
  const [rules, setRules] = useState<MaskingRule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<MaskingRule | undefined>()
  const rulesManagerRef = useRef<RulesManager | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sandbox_path')
    if (saved && !saved.startsWith('['))
      setSandboxPath(saved)
  }, [])

  useEffect(() => {
    const mgr = new RulesManager()
    rulesManagerRef.current = mgr
    mgr.initialize().then(() => loadRules(mgr)).catch(console.error)
    return () => mgr.close()
  }, [])

  const loadRules = useCallback(async (mgr?: RulesManager) => {
    const manager = mgr || rulesManagerRef.current
    if (!manager) return
    setIsLoading(true)
    try {
      const all = await manager.getAllRules()
      setRules(all.sort((a, b) => a.priority - b.priority))
    }
    catch (err) { console.error('Failed to load rules:', err) }
    finally { setIsLoading(false) }
  }, [])

  const handleCreateRule = useCallback(async (data: Omit<MaskingRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const mgr = rulesManagerRef.current
    if (!mgr) return
    try {
      await mgr.createRule(data)
      await loadRules(mgr)
      setShowForm(false)
      setEditingRule(undefined)
    }
    catch (err) { console.error('Failed to create rule:', err) }
  }, [loadRules])

  const handleUpdateRule = useCallback(async (data: Omit<MaskingRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const mgr = rulesManagerRef.current
    if (!mgr || !editingRule) return
    try {
      await mgr.updateRule(editingRule.id, data)
      await loadRules(mgr)
      setShowForm(false)
      setEditingRule(undefined)
    }
    catch (err) { console.error('Failed to update rule:', err) }
  }, [editingRule, loadRules])

  const handleDeleteRule = useCallback(async (id: string) => {
    const mgr = rulesManagerRef.current
    if (!mgr) return
    if (!confirm('确定删除该规则？')) return
    try {
      await mgr.deleteRule(id)
      await loadRules(mgr)
    }
    catch (err) { console.error('Failed to delete rule:', err) }
  }, [loadRules])

  const handleToggleRule = useCallback(async (id: string) => {
    const mgr = rulesManagerRef.current
    if (!mgr) return
    const rule = rules.find(r => r.id === id)
    if (!rule) return
    try {
      await mgr.updateRule(id, { enabled: !rule.enabled })
      await loadRules(mgr)
    }
    catch (err) { console.error('Failed to toggle rule:', err) }
  }, [rules, loadRules])

  const needsSandbox = !sandboxPath && (activeTab === 'mask' || activeTab === 'files' || activeTab === 'restore' || activeTab === 'transfer')

  const TAB_TITLES: Record<TabType, string> = {
    mask: '文件脱敏',
    restore: '脱敏还原',
    rules: '脱敏规则',
    files: '文件管理',
    transfer: '导出导入',
  }

  return (
    <div className="relative flex h-0 shrink-0 grow flex-col overflow-y-auto bg-background-body">
      {/* Top header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-body px-12 pb-4 pt-7">
        <h2 className="text-lg font-semibold text-text-primary">{TAB_TITLES[activeTab]}</h2>
        {sandboxPath && (
          <div className="flex items-center gap-1.5 text-xs text-text-quaternary bg-background-section rounded-lg px-3 py-1.5 border border-divider-subtle">
            <RiFolderLine className="w-3.5 h-3.5 text-text-quaternary" />
            <span className="truncate max-w-[300px]" title={sandboxPath}>{sandboxPath}</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="px-12 pb-8">
        {activeTab === 'mask' && (
          needsSandbox
            ? <NeedSandbox />
            : <FileMasking sandboxPath={sandboxPath} />
        )}

        {activeTab === 'restore' && (
          needsSandbox
            ? <NeedSandbox />
            : <FileRestore sandboxPath={sandboxPath} />
        )}

        {activeTab === 'rules' && (
          <RulesPanel
            rules={rules}
            isLoading={isLoading}
            onAdd={() => { setEditingRule(undefined); setShowForm(true) }}
            onEdit={(rule) => { setEditingRule(rule); setShowForm(true) }}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
            onRefresh={() => loadRules()}
          />
        )}

        {activeTab === 'files' && (
          needsSandbox
            ? <NeedSandbox />
            : <FileList sandboxPath={sandboxPath} />
        )}

        {activeTab === 'transfer' && (
          needsSandbox
            ? <NeedSandbox />
            : <SandboxTransfer sandboxPath={sandboxPath} />
        )}
      </div>

      {/* Rule form modal */}
      {showForm && (
        <RuleForm
          rule={editingRule}
          onSave={editingRule ? handleUpdateRule : handleCreateRule}
          onCancel={() => { setShowForm(false); setEditingRule(undefined) }}
        />
      )}
    </div>
  )
}

export default React.memo(DataMaskingPage)
