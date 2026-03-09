'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  DocumentIcon, ArrowDownTrayIcon, TrashIcon, ClockIcon, EyeIcon,
  FolderOpenIcon, MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline'
import {
  listSandboxFiles as apiListFiles,
  readSandboxFile as apiReadFile,
  deleteSandboxFile as apiDeleteFile,
} from '@/service/sandbox-files'
import { post } from '@/service/base'

interface FileRecord { id: string; fileName: string; size: number; createdAt: string }
interface FileListProps { sandboxPath: string; onRefresh?: () => void }
type SortField = 'fileName' | 'size' | 'createdAt'
type SortDir = 'asc' | 'desc'
const PAGE_SIZES = [10, 20, 50]

export function FileList({ sandboxPath }: FileListProps) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [previewContent, setPreviewContent] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const loadFiles = useCallback(async () => {
    if (!sandboxPath) return
    setIsLoading(true); setError('')
    try {
      const list = await apiListFiles(sandboxPath)
      setFiles(list.map(f => ({ id: f.name, fileName: f.name, size: f.size, createdAt: f.created_at })))
    } catch (err) { setError(`\u52a0\u8f7d\u6587\u4ef6\u5217\u8868\u5931\u8d25: ${err}`) }
    finally { setIsLoading(false) }
  }, [sandboxPath])

  useEffect(() => { loadFiles() }, [loadFiles])
  useEffect(() => { setPage(1) }, [search, sortField, sortDir, pageSize])

  const filtered = useMemo(() => {
    let result = files
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(f => f.fileName.toLowerCase().includes(q))
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'fileName') cmp = a.fileName.localeCompare(b.fileName, 'zh-CN')
      else if (sortField === 'size') cmp = a.size - b.size
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [files, search, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir(field === 'fileName' ? 'asc' : 'desc') }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDownIcon className="h-3 w-3 text-text-quaternary" />
    return sortDir === 'asc'
      ? <ChevronUpIcon className="h-3 w-3 text-text-accent" />
      : <ChevronDownIcon className="h-3 w-3 text-text-accent" />
  }

  const handlePreview = async (file: FileRecord) => {
    if (previewFile?.id === file.id) { setPreviewFile(null); setPreviewContent(''); return }
    setPreviewFile(file)
    try {
      const c = await apiReadFile(sandboxPath, file.fileName)
      setPreviewContent(c.length > 3000 ? c.substring(0, 3000) + '\n...' : c)
    } catch { setPreviewContent('\u8bfb\u53d6\u5931\u8d25') }
  }

  const handleDownload = async (file: FileRecord) => {
    try {
      const c = await apiReadFile(sandboxPath, file.fileName)
      const b = new Blob([c], { type: 'text/markdown;charset=utf-8' })
      const u = URL.createObjectURL(b)
      const a = document.createElement('a'); a.href = u; a.download = file.fileName
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u)
    } catch { alert('\u4e0b\u8f7d\u5931\u8d25') }
  }

  const handleDelete = async (file: FileRecord) => {
    if (!confirm(`\u786e\u5b9a\u5220\u9664 ${file.fileName}\uff1f`)) return
    try {
      await apiDeleteFile(sandboxPath, file.fileName)
      setFiles(p => p.filter(f => f.id !== file.id))
      if (previewFile?.id === file.id) { setPreviewFile(null); setPreviewContent('') }
    } catch { alert('\u5220\u9664\u5931\u8d25') }
  }

  const handleSyncToKnowledge = async () => {
    if (!files.length) return
    const name = prompt('\u77e5\u8bc6\u5e93\u540d\u79f0', '\u6c99\u7bb1\u8131\u654f\u77e5\u8bc6\u5e93')
    if (!name) return
    setIsSyncing(true); setSyncMsg('')
    try {
      const data = await post<Record<string, unknown>>('/data-masking/sandbox/sync-to-knowledge', {
        body: { sandbox_path: sandboxPath, dataset_name: name },
      })
      if (data.result === 'success')
        setSyncMsg(`\u540c\u6b65\u6210\u529f\uff01\u5df2\u521b\u5efa\u77e5\u8bc6\u5e93\u300c${data.dataset_name}\u300d\uff0c\u5171 ${data.file_count} \u4e2a\u6587\u4ef6`)
      else setSyncMsg((data.error as string) || '\u540c\u6b65\u5931\u8d25')
    } catch (err) { setSyncMsg(`\u540c\u6b65\u5931\u8d25: ${err}`) }
    finally { setIsSyncing(false) }
  }

  const fmtDate = (iso: string) => {
    if (!iso) return '-'
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  }
  const fmtSize = (b: number) => {
    if (b < 1024) return `${b} B`
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1048576).toFixed(1)} MB`
  }

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="text-sm text-text-tertiary">{'\u52a0\u8f7d\u4e2d...'}</div></div>
  if (error) return (
    <div className="text-center py-12">
      <div className="text-sm text-text-destructive bg-state-destructive-hover px-4 py-3 rounded-lg mb-4">{error}</div>
      <button onClick={loadFiles} className="text-sm text-text-accent hover:underline">{'\u91cd\u8bd5'}</button>
    </div>
  )
  if (files.length === 0) return (
    <div className="text-center py-12">
      <DocumentIcon className="mx-auto h-12 w-12 text-text-quaternary" />
      <h3 className="mt-2 text-sm font-medium text-text-primary">{'\u6682\u65e0\u8131\u654f\u6587\u4ef6'}</h3>
      <p className="mt-1 text-sm text-text-tertiary">{'\u8bf7\u5148\u5728\u300c\u6587\u4ef6\u8131\u654f\u300d\u6807\u7b7e\u9875\u6267\u884c\u8131\u654f\u64cd\u4f5c'}</p>
      {sandboxPath && <p className="mt-2 text-xs text-text-quaternary flex items-center justify-center gap-1"><FolderOpenIcon className="h-3.5 w-3.5" />{sandboxPath}</p>}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-tertiary">{filtered.length} / {files.length} {'\u4e2a\u6587\u4ef6'}</span>
          <span className="text-xs text-text-success flex items-center gap-1"><FolderOpenIcon className="h-3.5 w-3.5" />{sandboxPath}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-quaternary" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={'\u641c\u7d22\u6587\u4ef6\u540d...'}
              className="pl-8 pr-3 py-1.5 text-sm border border-divider-regular bg-components-input-bg-normal text-text-primary placeholder:text-text-placeholder rounded-lg focus:outline-none focus:ring-1 focus:ring-state-accent-solid focus:border-components-input-border-active w-52" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-secondary text-xs">{'\u2715'}</button>}
          </div>
          <button onClick={handleSyncToKnowledge} disabled={isSyncing || files.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-components-button-secondary-accent-bg px-3 py-1.5 text-sm font-medium text-components-button-secondary-accent-text hover:bg-components-button-secondary-accent-bg-hover disabled:opacity-50 disabled:cursor-not-allowed">
            {isSyncing ? '\u540c\u6b65\u4e2d...' : '\u540c\u6b65\u5230\u77e5\u8bc6\u5e93'}
          </button>
          <button onClick={loadFiles} className="text-sm text-text-accent hover:underline px-2 py-1.5">{'\u5237\u65b0'}</button>
        </div>
      </div>

      {syncMsg && (
        <div className={`rounded-md px-3 py-2 text-xs ${syncMsg.includes('\u6210\u529f') ? 'bg-state-success-hover text-text-success border border-state-success-hover-alt' : 'bg-state-destructive-hover text-text-destructive border border-state-destructive-border'}`}>
          {syncMsg}
        </div>
      )}

      <div className="overflow-hidden shadow-xs ring-1 ring-divider-regular rounded-lg">
        <table className="min-w-full divide-y divide-divider-regular">
          <thead className="bg-background-section">
            <tr>
              <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-text-primary cursor-pointer select-none hover:bg-state-base-hover" onClick={() => toggleSort('fileName')}>
                <span className="inline-flex items-center gap-1">{'\u6587\u4ef6'} <SortIcon field="fileName" /></span>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-text-primary cursor-pointer select-none hover:bg-state-base-hover" onClick={() => toggleSort('size')}>
                <span className="inline-flex items-center gap-1">{'\u5927\u5c0f'} <SortIcon field="size" /></span>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-text-primary cursor-pointer select-none hover:bg-state-base-hover" onClick={() => toggleSort('createdAt')}>
                <span className="inline-flex items-center gap-1">{'\u521b\u5efa\u65f6\u95f4'} <SortIcon field="createdAt" /></span>
              </th>
              <th className="relative py-3 pl-3 pr-4 text-right text-sm font-semibold text-text-primary">{'\u64cd\u4f5c'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider-subtle bg-components-panel-bg">
            {paginated.map(file => (
              <tr key={file.id} className="hover:bg-state-base-hover">
                <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="h-5 w-5 text-text-quaternary shrink-0" />
                    <span className="font-medium text-text-primary truncate max-w-[400px]" title={file.fileName}>{file.fileName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-text-tertiary">{fmtSize(file.size)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-text-tertiary">
                  <div className="flex items-center gap-1"><ClockIcon className="h-4 w-4" />{fmtDate(file.createdAt)}</div>
                </td>
                <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => handlePreview(file)} className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"><EyeIcon className="h-4 w-4" />{'\u9884\u89c8'}</button>
                    <button onClick={() => handleDownload(file)} className="inline-flex items-center gap-1 text-text-accent hover:underline"><ArrowDownTrayIcon className="h-4 w-4" />{'\u4e0b\u8f7d'}</button>
                    <button onClick={() => handleDelete(file)} className="inline-flex items-center gap-1 text-text-destructive hover:underline"><TrashIcon className="h-4 w-4" />{'\u5220\u9664'}</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-sm text-text-quaternary">{'\u672a\u627e\u5230\u5339\u914d\u300c'}{search}{'\u300d\u7684\u6587\u4ef6'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm text-text-tertiary">
          <div className="flex items-center gap-2">
            <span>{'\u6bcf\u9875'}</span>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
              className="border border-divider-regular bg-components-input-bg-normal text-text-primary rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-state-accent-solid">
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span>{'\u6761'}</span>
            <span className="text-text-quaternary ml-2">{'\u7b2c'} {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, filtered.length)} {'\u6761\uff0c\u5171'} {filtered.length} {'\u6761'}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={safePage <= 1} className="px-2 py-1 rounded hover:bg-state-base-hover disabled:opacity-30 disabled:cursor-not-allowed" title={'\u9996\u9875'}>{'\u00ab'}</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} className="p-1 rounded hover:bg-state-base-hover disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-4 w-4" /></button>
            <span className="px-3 py-1 text-sm font-medium">{safePage} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="p-1 rounded hover:bg-state-base-hover disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRightIcon className="h-4 w-4" /></button>
            <button onClick={() => setPage(totalPages)} disabled={safePage >= totalPages} className="px-2 py-1 rounded hover:bg-state-base-hover disabled:opacity-30 disabled:cursor-not-allowed" title={'\u672b\u9875'}>{'\u00bb'}</button>
          </div>
        </div>
      )}

      {previewFile && (
        <div className="border border-divider-regular rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-background-section border-b border-divider-regular">
            <span className="text-sm font-medium text-text-secondary">{previewFile.fileName}</span>
            <button onClick={() => { setPreviewFile(null); setPreviewContent('') }} className="text-xs text-text-tertiary hover:text-text-secondary">{'\u5173\u95ed'}</button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto bg-components-panel-bg">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">{previewContent}</pre>
          </div>
        </div>
      )}
    </div>
  )
}