'use client'

import { useEffect, useState } from 'react'
import {
  RiDownloadLine, RiUploadLine, RiLockLine, RiCheckLine, RiLock2Line, RiDeleteBinLine,
} from '@remixicon/react'

interface SandboxTransferProps { sandboxPath: string }
const PIN_STORAGE_KEY = 'sandbox_export_pin'

export function SandboxTransfer({ sandboxPath }: SandboxTransferProps) {
  const [hasPinSet, setHasPinSet] = useState(false)
  const [setupPin, setSetupPin] = useState('')
  const [setupPinConfirm, setSetupPinConfirm] = useState('')
  const [setupMsg, setSetupMsg] = useState('')
  const [verifyPin, setVerifyPin] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')
  const [importPin, setImportPin] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const [importResult, setImportResult] = useState<string[]>([])

  useEffect(() => { if (localStorage.getItem(PIN_STORAGE_KEY)) setHasPinSet(true) }, [])

  const handleSetPin = () => {
    if (!setupPin || setupPin.length < 4) { setSetupMsg('PIN \u81f3\u5c11 4 \u4f4d'); return }
    if (setupPin !== setupPinConfirm) { setSetupMsg('\u4e24\u6b21\u8f93\u5165\u7684 PIN \u4e0d\u4e00\u81f4'); return }
    localStorage.setItem(PIN_STORAGE_KEY, setupPin)
    setHasPinSet(true); setSetupPin(''); setSetupPinConfirm(''); setSetupMsg('')
  }
  const handleClearPin = () => { localStorage.removeItem(PIN_STORAGE_KEY); setHasPinSet(false); setVerifyPin(''); setExportMsg('') }

  const handleExport = async () => {
    const savedPin = localStorage.getItem(PIN_STORAGE_KEY) || ''
    if (!verifyPin) { setExportMsg('\u8bf7\u8f93\u5165 PIN \u5bc6\u7801'); return }
    if (verifyPin !== savedPin) { setExportMsg('PIN \u5bc6\u7801\u9519\u8bef'); return }
    setIsExporting(true); setExportMsg('')
    try {
      const res = await fetch('http://localhost:5001/console/api/data-masking/sandbox/export', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandbox_path: sandboxPath, pin: verifyPin }),
      })
      const text = await res.text()
      let data: Record<string, unknown>
      try { data = JSON.parse(text) } catch { setExportMsg(`\u540e\u7aef\u8fd4\u56de\u5f02\u5e38: ${text.slice(0, 200)}`); return }
      if (!res.ok || data.result !== 'success') { setExportMsg((data.error as string) || '\u5bfc\u51fa\u5931\u8d25'); return }
      setExportMsg(`\u5bfc\u51fa\u6210\u529f\uff0c${data.file_count} \u4e2a\u6587\u4ef6\u5df2\u6253\u5305\u5230\u6c99\u7bb1\u76ee\u5f55`); setVerifyPin('')
    } catch { setExportMsg('\u5bfc\u51fa\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4\u540e\u7aef\u5df2\u542f\u52a8') }
    finally { setIsExporting(false) }
  }

  const handleImport = async () => {
    if (!importFile) { setImportMsg('\u8bf7\u9009\u62e9 ZIP \u6587\u4ef6'); return }
    if (!importPin) { setImportMsg('\u8bf7\u8f93\u5165 PIN'); return }
    setIsImporting(true); setImportMsg(''); setImportResult([])
    try {
      const formData = new FormData()
      formData.append('file', importFile); formData.append('pin', importPin); formData.append('sandbox_path', sandboxPath)
      const res = await fetch('http://localhost:5001/console/api/data-masking/sandbox/import', { method: 'POST', body: formData })
      const text = await res.text()
      let data: Record<string, unknown>
      try { data = JSON.parse(text) } catch { setImportMsg(`\u540e\u7aef\u8fd4\u56de\u5f02\u5e38: ${text.slice(0, 200)}`); return }
      if (data.result === 'success') {
        setImportMsg(`\u5bfc\u5165\u6210\u529f\uff0c\u5171 ${data.count} \u4e2a\u6587\u4ef6`)
        setImportResult((data.imported_files as string[]) || []); setImportPin(''); setImportFile(null)
      } else { setImportMsg((data.error as string) || '\u5bfc\u5165\u5931\u8d25') }
    } catch { setImportMsg('\u5bfc\u5165\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4\u540e\u7aef\u5df2\u542f\u52a8') }
    finally { setIsImporting(false) }
  }

  const inputCls = 'w-full rounded-md border border-components-input-border-active bg-components-input-bg-normal pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:border-components-input-border-active focus:outline-none focus:ring-1 focus:ring-state-accent-solid'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Export */}
        <div className={`rounded-lg border border-divider-regular bg-components-panel-bg p-5 ${!hasPinSet ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <RiDownloadLine className="w-5 h-5 text-text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">{'\u5bfc\u51fa\u6c99\u7bb1'}</h3>
          </div>
          <p className="text-xs text-text-tertiary mb-4">{'\u8f93\u5165\u5bc6\u7801\u9a8c\u8bc1\u540e\uff0c\u5c06\u6c99\u7bb1\u76ee\u5f55\u4e2d\u7684\u6240\u6709\u6587\u4ef6\u6253\u5305\u4e3a ZIP \u538b\u7f29\u5305\u4fdd\u5b58\u5230\u6c99\u7bb1\u76ee\u5f55\u3002'}</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">{'\u9a8c\u8bc1 PIN \u5bc6\u7801'}</label>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                <input type="password" value={verifyPin} onChange={e => setVerifyPin(e.target.value)}
                  placeholder={'\u8f93\u5165\u5bfc\u51fa\u5bc6\u7801'} onKeyDown={e => e.key === 'Enter' && handleExport()} className={inputCls} />
              </div>
            </div>
            {exportMsg && <p className={`text-xs ${exportMsg.includes('\u6210\u529f') ? 'text-text-success' : 'text-text-destructive'}`}>{exportMsg}</p>}
            <button onClick={handleExport} disabled={isExporting || !verifyPin}
              className="inline-flex items-center gap-1.5 rounded-md bg-components-button-primary-bg px-4 py-2 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed">
              <RiDownloadLine className="w-4 h-4" />{isExporting ? '\u5bfc\u51fa\u4e2d...' : '\u9a8c\u8bc1\u5e76\u5bfc\u51fa'}
            </button>
          </div>
        </div>

        {/* Import */}
        <div className="rounded-lg border border-divider-regular bg-components-panel-bg p-5">
          <div className="flex items-center gap-2 mb-3">
            <RiUploadLine className="w-5 h-5 text-text-success" />
            <h3 className="text-sm font-semibold text-text-primary">{'\u5bfc\u5165\u6c99\u7bb1'}</h3>
          </div>
          <p className="text-xs text-text-tertiary mb-4">{'\u4e0a\u4f20 ZIP \u538b\u7f29\u5305\uff0c\u8f93\u5165\u5bfc\u51fa\u65f6\u8bbe\u7f6e\u7684 PIN \u5bc6\u7801\u6821\u9a8c\u540e\u5bfc\u5165\u3002'}</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">{'\u9009\u62e9 ZIP \u6587\u4ef6'}</label>
              <input type="file" accept=".zip" onChange={e => setImportFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-components-button-secondary-bg file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-components-button-secondary-text hover:file:bg-components-button-secondary-bg-hover" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">{'\u8f93\u5165 PIN \u5bc6\u7801'}</label>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                <input type="password" value={importPin} onChange={e => setImportPin(e.target.value)}
                  placeholder={'\u8f93\u5165\u5bfc\u51fa\u65f6\u8bbe\u7f6e\u7684 PIN'} onKeyDown={e => e.key === 'Enter' && handleImport()} className={inputCls} />
              </div>
            </div>
            {importMsg && <p className={`text-xs ${importMsg.includes('\u6210\u529f') ? 'text-text-success' : 'text-text-destructive'}`}>{importMsg}</p>}
            {importResult.length > 0 && (
              <div className="rounded-md bg-state-success-hover border border-state-success-hover-alt p-3">
                <p className="text-xs font-medium text-text-success mb-1">{'\u5df2\u5bfc\u5165\u6587\u4ef6\uff1a'}</p>
                <ul className="space-y-0.5">
                  {importResult.map(f => <li key={f} className="flex items-center gap-1 text-xs text-text-success"><RiCheckLine className="w-3 h-3" />{f}</li>)}
                </ul>
              </div>
            )}
            <button onClick={handleImport} disabled={isImporting || !importFile || !importPin}
              className="inline-flex items-center gap-1.5 rounded-md bg-state-success-solid px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              <RiUploadLine className="w-4 h-4" />{isImporting ? '\u5bfc\u5165\u4e2d...' : '\u6821\u9a8c\u5e76\u5bfc\u5165'}
            </button>
          </div>
        </div>
      </div>

      {/* PIN setup */}
      <div className="rounded-lg border border-divider-regular bg-components-panel-bg p-5">
        <div className="flex items-center gap-2 mb-3">
          <RiLock2Line className="w-5 h-5 text-text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">{'\u6c99\u7bb1\u5bc6\u7801\u8bbe\u7f6e'}</h3>
          {hasPinSet && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-text-success bg-state-success-hover px-2 py-0.5 rounded-full">
              <RiCheckLine className="w-3 h-3" />{'\u5df2\u8bbe\u7f6e'}
            </span>
          )}
        </div>
        {!hasPinSet ? (
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">{'\u8bbe\u7f6e\u5bfc\u51fa\u5bc6\u7801\u540e\uff0c\u6bcf\u6b21\u5bfc\u51fa\u90fd\u9700\u8981\u9a8c\u8bc1\u5bc6\u7801\u3002\u5bfc\u5165\u65f6\u4e5f\u9700\u8981\u8f93\u5165\u76f8\u540c\u7684\u5bc6\u7801\u3002'}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">{'\u8bbe\u7f6e PIN \u5bc6\u7801\uff08\u81f3\u5c11 4 \u4f4d\uff09'}</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                  <input type="password" value={setupPin} onChange={e => setSetupPin(e.target.value)} placeholder={'\u8f93\u5165 PIN'} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">{'\u786e\u8ba4 PIN \u5bc6\u7801'}</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                  <input type="password" value={setupPinConfirm} onChange={e => setSetupPinConfirm(e.target.value)}
                    placeholder={'\u518d\u6b21\u8f93\u5165 PIN'} onKeyDown={e => e.key === 'Enter' && handleSetPin()} className={inputCls} />
                </div>
              </div>
            </div>
            {setupMsg && <p className="text-xs text-text-destructive">{setupMsg}</p>}
            <button onClick={handleSetPin} disabled={!setupPin}
              className="inline-flex items-center gap-1.5 rounded-md bg-components-button-primary-bg px-4 py-2 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed">
              <RiLockLine className="w-4 h-4" />{'\u4fdd\u5b58\u5bc6\u7801'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs text-text-tertiary flex-1">{'\u5bfc\u51fa\u5bc6\u7801\u5df2\u8bbe\u7f6e\uff0c\u5bfc\u51fa\u65f6\u9700\u8981\u9a8c\u8bc1\u3002'}</p>
            <button onClick={handleClearPin} className="inline-flex items-center gap-1 text-xs text-text-destructive hover:underline">
              <RiDeleteBinLine className="w-3.5 h-3.5" />{'\u91cd\u7f6e\u5bc6\u7801'}
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-divider-subtle bg-state-accent-hover p-4">
        <h4 className="text-sm font-medium text-text-accent mb-2">{'\u4f7f\u7528\u8bf4\u660e'}</h4>
        <ul className="space-y-1 text-xs text-text-accent">
          <li>{'\u2022 \u9996\u5148\u5728\u4e0b\u65b9\u8bbe\u7f6e\u5bfc\u51fa\u5bc6\u7801\uff0c\u8bbe\u7f6e\u540e\u6bcf\u6b21\u5bfc\u51fa\u90fd\u9700\u8981\u9a8c\u8bc1'}</li>
          <li>{'\u2022 \u5bfc\u51fa\u7684 ZIP \u6587\u4ef6\u4fdd\u5b58\u5728\u6c99\u7bb1\u76ee\u5f55\u4e0b'}</li>
          <li>{'\u2022 \u5bfc\u5165\u65f6\u9700\u8981\u8f93\u5165\u5bfc\u51fa\u65f6\u8bbe\u7f6e\u7684 PIN\uff0c\u6821\u9a8c\u901a\u8fc7\u540e\u6587\u4ef6\u89e3\u538b\u5230\u5f53\u524d\u6c99\u7bb1\u76ee\u5f55'}</li>
          <li>{'\u2022 \u53ef\u7528\u4e8e\u8de8\u8bbe\u5907\u3001\u8de8\u5e73\u53f0\u8fc1\u79fb\u8131\u654f\u6587\u4ef6'}</li>
        </ul>
      </div>
    </div>
  )
}