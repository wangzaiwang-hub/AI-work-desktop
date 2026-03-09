'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  RiCloseLine,
  RiFile3Line,
  RiFolder3Line,
  RiRefreshLine,
  RiShieldCheckLine,
} from '@remixicon/react'
import { useSandboxSecurity } from '@/context/sandbox-security-context'

interface SandboxFile {
  name: string
  size: number
  created_at: string
}

interface SandboxFilePickerProps {
  open: boolean
  onClose: () => void
  onSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export function SandboxFilePicker({ open, onClose, onSelect, accept, multiple }: SandboxFilePickerProps) {
  const { sandboxPath: contextPath } = useSandboxSecurity()
  // Fallback: read directly from localStorage if context hasn't synced yet
  const sandboxPath = contextPath || (typeof window !== 'undefined' ? localStorage.getItem('sandbox_path') || '' : '')
  const [files, setFiles] = useState<SandboxFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const loadFiles = useCallback(async () => {
    if (!sandboxPath) {
      setError('沙箱路径未配置，请先在「脱敏沙箱 → 沙箱配置」中设置路径')
      return
    }
    setLoading(true)
    setError('')
    try {
      const url = `http://localhost:5001/console/api/data-masking/sandbox/files/list?sandbox_path=${encodeURIComponent(sandboxPath)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      let fileList: SandboxFile[] = data.files || []

      // Filter by accept types if specified (skip filter if no matches to avoid empty list)
      if (accept) {
        const exts = accept.split(',').map(e => e.trim().toLowerCase()).filter(e => e.startsWith('.'))
        if (exts.length > 0) {
          const filtered = fileList.filter(f =>
            exts.some(ext => f.name.toLowerCase().endsWith(ext)),
          )
          if (filtered.length > 0)
            fileList = filtered
          // If no matches, show all files (fallback)
        }
      }
      setFiles(fileList)
    }
    catch {
      setError('无法加载沙箱文件列表，请确认后端已启动')
    }
    finally {
      setLoading(false)
    }
  }, [sandboxPath, accept])

  useEffect(() => {
    if (open) {
      loadFiles()
      setSelected(new Set())
    }
  }, [open, loadFiles])

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name))
        next.delete(name)
      else if (!multiple)
        return new Set([name])
      else
        next.add(name)
      return next
    })
  }


  const handleConfirm = async () => {
    if (selected.size === 0) return
    const filePromises = Array.from(selected).map(async (name) => {
      const res = await fetch(
        `http://localhost:5001/console/api/data-masking/sandbox/files/read?sandbox_path=${encodeURIComponent(sandboxPath)}&file_name=${encodeURIComponent(name)}`,
      )
      if (!res.ok) throw new Error(`Failed to read ${name}`)
      const data = await res.json()
      const blob = new Blob([data.content])
      const file = new File([blob], name)
      // Mark as sandbox file to bypass extension checks in the uploader
      ;(file as unknown as Record<string, unknown>)._fromSandbox = true
      return file
    })
    try {
      const fileObjects = await Promise.all(filePromises)
      onSelect(fileObjects)
      onClose()
    }
    catch {
      setError('读取文件失败')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-[560px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-gray-900">沙箱文件选择</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <RiCloseLine className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Sandbox path info */}
        <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <RiFolder3Line className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs text-blue-700 truncate font-mono">{sandboxPath}</span>
          <button onClick={loadFiles} className="ml-auto p-1 rounded hover:bg-blue-100 shrink-0">
            <RiRefreshLine className="w-3.5 h-3.5 text-blue-500" />
          </button>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-[200px]">
          {loading && (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">加载中...</div>
          )}
          {error && (
            <div className="flex items-center justify-center py-12 text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && files.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <RiFile3Line className="w-10 h-10 mb-2" />
              <span className="text-sm">沙箱目录中没有文件</span>
              <span className="text-xs mt-1">请先在数据脱敏模块处理文件</span>
            </div>
          )}
          {!loading && files.map(f => (
            <button
              key={f.name}
              onClick={() => toggleSelect(f.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-colors ${
                selected.has(f.name)
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <RiFile3Line className={`w-4 h-4 shrink-0 ${selected.has(f.name) ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate ${selected.has(f.name) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                  {f.name}
                </div>
                <div className="text-xs text-gray-400">{formatSize(f.size)}</div>
              </div>
              {selected.has(f.name) && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <span className="text-xs text-gray-500">
            {selected.size > 0 ? `已选择 ${selected.size} 个文件` : '安全模式：仅可选择沙箱内的脱敏文件'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-200">
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
