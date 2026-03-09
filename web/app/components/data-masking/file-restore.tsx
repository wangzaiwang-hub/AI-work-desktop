'use client'

import { useState, useRef, useCallback } from 'react'
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  EyeIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { saveSandboxFile } from '@/service/sandbox-files'
import { decrypt } from '@/lib/data-masking/crypto-utils'

interface MappingRule {
  original: string
  replacement: string
  label: string
  type: string
  count: string
}

interface MappingData {
  version: string
  source_file: string
  masked_file: string
  created_at: string
  total_replacements: number
  rules: MappingRule[]
}

interface FileRestoreProps {
  sandboxPath: string
}

function getRestoredFileName(maskedName: string): string {
  // report.masked.txt -> report.restored.txt
  // report.masked.md -> report.restored.md
  return maskedName.replace('.masked', '.restored')
}

function applyRestore(content: string, rules: MappingRule[]): { restored: string; count: number } {
  let restored = content
  let totalCount = 0
  // Sort by replacement length descending to avoid partial matches
  const sorted = [...rules].sort((a, b) => b.replacement.length - a.replacement.length)
  for (const rule of sorted) {
    if (!rule.replacement) continue
    const escaped = rule.replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'g')
    let matchCount = 0
    restored = restored.replace(regex, () => { matchCount++; return rule.original })
    totalCount += matchCount
  }
  return { restored, count: totalCount }
}

type Step = 'upload' | 'decrypt' | 'confirm' | 'preview' | 'done'

export function FileRestore({ sandboxPath }: FileRestoreProps) {
  const [step, setStep] = useState<Step>('upload')
  const [maskedFile, setMaskedFile] = useState<File | null>(null)
  const [maskedContent, setMaskedContent] = useState('')
  const [mappingData, setMappingData] = useState<MappingData | null>(null)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)
  const [decryptionKey, setDecryptionKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [decrypting, setDecrypting] = useState(false)
  const [preview, setPreview] = useState('')
  const [restoredContent, setRestoredContent] = useState('')
  const [matchCount, setMatchCount] = useState(0)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const maskedInputRef = useRef<HTMLInputElement>(null)
  const mappingInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleMaskedFile = useCallback((file: File) => {
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setMaskedContent(ev.target?.result as string ?? '')
      setMaskedFile(file)
    }
    reader.onerror = () => setError('读取脱敏文件失败')
    reader.readAsText(file)
  }, [])

  const handleMappingFile = useCallback((file: File) => {
    setError('')
    if (!file.name.endsWith('.mapping.json')) {
      setError('请选择 .mapping.json 映射规则文件')
      return
    }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const rawData = JSON.parse(ev.target?.result as string)
        
        // Check if encrypted
        if (rawData.encrypted && rawData.data) {
          // Encrypted mapping file - try global passphrase first
          const globalPassphrase = localStorage.getItem('mapping_encryption_passphrase')
          if (globalPassphrase && globalPassphrase.length >= 32) {
            // Try to decrypt with global passphrase
            try {
              const decryptedJson = await decrypt(rawData.data, globalPassphrase)
              const data = JSON.parse(decryptedJson) as MappingData
              
              if (!data.rules || !Array.isArray(data.rules)) {
                setError('解密后的数据格式错误：缺少 rules 字段')
                return
              }
              
              setMappingData(data)
              setEncryptedData(null)
              setStep('confirm')
              return
            }
            catch {
              // Global passphrase failed, prompt user
              setEncryptedData(rawData.data)
              setMappingData(null)
              setStep('decrypt')
            }
          } else {
            // No global passphrase, prompt user
            setEncryptedData(rawData.data)
            setMappingData(null)
            setStep('decrypt')
          }
        } else if (rawData.rules && Array.isArray(rawData.rules)) {
          // Unencrypted mapping file (legacy)
          setEncryptedData(null)
          setMappingData(rawData as MappingData)
          setStep('confirm')
        } else {
          setError('映射文件格式错误：缺少必要字段')
        }
      }
      catch {
        setError('映射文件解析失败，请确认是有效的 JSON 文件')
      }
    }
    reader.onerror = () => setError('读取映射文件失败')
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    for (const f of files) {
      if (f.name.endsWith('.mapping.json'))
        handleMappingFile(f)
      else
        handleMaskedFile(f)
    }
  }, [handleMaskedFile, handleMappingFile])

  const handleDecrypt = async () => {
    if (!encryptedData || !decryptionKey) {
      setError('请输入解密口令')
      return
    }
    
    setDecrypting(true)
    setError('')
    
    try {
      const decryptedJson = await decrypt(encryptedData, decryptionKey)
      const data = JSON.parse(decryptedJson) as MappingData
      
      if (!data.rules || !Array.isArray(data.rules)) {
        setError('解密后的数据格式错误：缺少 rules 字段')
        setDecrypting(false)
        return
      }
      
      setMappingData(data)
      setStep('confirm')
    }
    catch (err) {
      setError(`解密失败: ${err instanceof Error ? err.message : '口令错误或数据损坏'}`)
    }
    finally {
      setDecrypting(false)
    }
  }

  const handlePreview = () => {
    if (!maskedContent || !mappingData) return
    const { restored, count } = applyRestore(maskedContent, mappingData.rules)
    setRestoredContent(restored)
    setMatchCount(count)
    setPreview(restored.length > 3000 ? restored.substring(0, 3000) + '\n\n... (已截断)' : restored)
    setStep('preview')
  }

  const handleExecute = async () => {
    if (!maskedFile || !restoredContent) return
    setError('')
    const restoredFileName = getRestoredFileName(maskedFile.name)
    const messages: string[] = []

    if (sandboxPath) {
      try {
        const result = await saveSandboxFile(sandboxPath, restoredFileName, restoredContent)
        messages.push(`已保存到 ${result.file_path}`)
      }
      catch (saveErr) {
        messages.push(`保存失败: ${saveErr instanceof Error ? saveErr.message : saveErr}`)
      }
    }

    try {
      const blob = new Blob([restoredContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = restoredFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      messages.push('浏览器下载已触发')
    }
    catch {
      messages.push('浏览器下载失败')
    }

    if (messages.some(m => m.includes('失败')))
      setError(messages.join('；'))
    else
      setStep('done')
  }

  const handleReset = () => {
    setMaskedFile(null)
    setMaskedContent('')
    setMappingData(null)
    setEncryptedData(null)
    setDecryptionKey('')
    setShowKey(false)
    setDecrypting(false)
    setPreview('')
    setRestoredContent('')
    setMatchCount(0)
    setStep('upload')
    setError('')
  }

  if (step === 'done') {
    return (
      <div className="text-center py-16">
        <CheckCircleIcon className="mx-auto h-14 w-14 text-text-success" />
        <h3 className="mt-3 text-base font-medium text-text-primary">还原完成</h3>
        <p className="mt-1 text-sm text-text-tertiary">已还原 {matchCount} 处脱敏数据</p>
        <p className="mt-1 text-xs text-text-quaternary">
          文件: {maskedFile ? getRestoredFileName(maskedFile.name) : ''} → {sandboxPath}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-components-button-primary-text bg-components-button-primary-bg rounded-lg hover:bg-components-button-primary-bg-hover">
            继续还原其他文件
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-text-destructive bg-state-destructive-hover px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Upload area */}
      {step === 'upload' && (
        <>
          {/* Step 1: Upload masked file */}
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false) }}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed transition-all p-8 ${
              dragging ? 'border-state-accent-solid bg-state-accent-hover' : 'border-divider-regular bg-components-panel-bg hover:border-divider-deep'
            }`}
          >
            <div className="space-y-4">
              {/* Masked file */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-state-accent-hover flex items-center justify-center shrink-0">
                  <DocumentIcon className="h-5 w-5 text-text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-secondary">脱敏文件</p>
                  {maskedFile
                    ? <p className="text-xs text-text-success truncate">{maskedFile.name} ({maskedContent.length} 字符)</p>
                    : <p className="text-xs text-text-quaternary">选择需要还原的 .masked 文件</p>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => maskedInputRef.current?.click()}
                  className="text-xs text-text-accent hover:underline px-3 py-1.5 rounded-lg border border-divider-regular hover:bg-state-accent-hover"
                >
                  {maskedFile ? '重新选择' : '选择文件'}
                </button>
                <input ref={maskedInputRef} type="file" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMaskedFile(f) }} />
              </div>

              {/* Mapping file */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-state-warning-hover flex items-center justify-center shrink-0">
                  <ArrowPathIcon className="h-5 w-5 text-text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-secondary">映射规则文件</p>
                  {mappingData
                    ? <p className="text-xs text-text-success">{mappingData.source_file} → {mappingData.rules.length} 条规则</p>
                    : <p className="text-xs text-text-quaternary">选择对应的 .mapping.json 文件</p>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => mappingInputRef.current?.click()}
                  className="text-xs text-text-accent hover:underline px-3 py-1.5 rounded-lg border border-divider-regular hover:bg-state-accent-hover"
                >
                  {mappingData ? '重新选择' : '选择文件'}
                </button>
                <input ref={mappingInputRef} type="file" accept=".json" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMappingFile(f) }} />
              </div>

              {!maskedFile && !mappingData && (
                <div className="text-center pt-2">
                  <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-text-quaternary" />
                  <p className="mt-2 text-xs text-text-quaternary">也可以将两个文件一起拖拽到此处</p>
                </div>
              )}
            </div>
          </div>

          {/* Usage tips */}
          {!maskedFile && (
            <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-5">
              <h4 className="text-sm font-medium text-text-secondary mb-3">使用说明</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">1</span>
                  <p className="text-xs text-text-tertiary">上传脱敏后的文件（.masked.txt / .masked.md 等）</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">2</span>
                  <p className="text-xs text-text-tertiary">上传对应的映射规则文件（.mapping.json）</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">3</span>
                  <p className="text-xs text-text-tertiary">确认映射规则，预览还原效果</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">4</span>
                  <p className="text-xs text-text-tertiary">执行还原，文件自动保存到沙箱并下载</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Decrypt step */}
      {step === 'decrypt' && encryptedData && (
        <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-text-warning" />
            <h3 className="text-base font-medium text-text-primary">输入解密口令</h3>
          </div>
          <p className="text-sm text-text-tertiary mb-6">
            该映射文件已加密。全局口令解密失败或未配置，请手动输入创建时设置的加密口令。
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
                placeholder="请输入32位加密口令"
                className="flex-1 text-sm border border-divider-regular bg-components-input-bg-normal rounded px-3 py-2 text-text-primary focus:ring-1 focus:ring-state-accent-solid focus:border-state-accent-solid"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && decryptionKey.length >= 32) {
                    handleDecrypt()
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-3 py-2 text-sm text-text-accent hover:underline"
              >
                {showKey ? '隐藏' : '显示'}
              </button>
            </div>
            {decryptionKey.length > 0 && decryptionKey.length < 32 && (
              <p className="text-xs text-text-warning">
                口令长度不足，需要至少32位字符
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-divider-regular">
            <button
              type="button"
              onClick={handleDecrypt}
              disabled={!decryptionKey || decryptionKey.length < 32 || decrypting}
              className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-5 py-2.5 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {decrypting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  解密中...
                </>
              ) : (
                '解密并继续'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={decrypting}
              className="inline-flex items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-4 py-2.5 text-sm font-medium text-components-button-secondary-text hover:bg-components-button-secondary-bg-hover disabled:opacity-50"
            >
              重新选择文件
            </button>
          </div>
        </div>
      )}

      {/* Confirm rules */}
      {step === 'confirm' && mappingData && (
        <>
          <div className="flex items-center justify-between bg-components-panel-bg rounded-lg border border-divider-regular px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <DocumentIcon className="h-4 w-4 text-text-quaternary" />
              <span className="font-medium">{maskedFile?.name}</span>
              <span className="text-text-quaternary">·</span>
              <span className="text-text-quaternary">来源: {mappingData.source_file}</span>
              <span className="text-text-quaternary">·</span>
              <span className="text-text-quaternary">{mappingData.created_at ? new Date(mappingData.created_at).toLocaleString('zh-CN') : ''}</span>
            </div>
            <button onClick={handleReset} className="text-xs text-text-tertiary hover:text-text-secondary">重新选择</button>
          </div>

          <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowPathIcon className="h-4 w-4 text-text-warning" />
              <label className="text-sm font-medium text-text-secondary">
                映射规则 ({mappingData.rules.length} 条)
              </label>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {mappingData.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 border border-divider-regular rounded-md text-sm">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-background-section text-text-tertiary shrink-0">{rule.label}</span>
                  <span className="text-text-accent font-mono text-xs">{rule.replacement}</span>
                  <span className="text-xs text-text-quaternary">→</span>
                  <span className="text-text-primary font-medium text-xs">{rule.original}</span>
                  <span className="text-xs text-text-quaternary ml-auto">×{rule.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Preview */}
      {step === 'preview' && preview && (
        <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-text-accent" />
              <label className="text-sm font-medium text-text-secondary">还原预览 (还原 {matchCount} 处)</label>
            </div>
            <button onClick={() => setStep('confirm')} className="text-xs text-text-accent hover:underline">返回确认</button>
          </div>
          <div className="p-4 bg-background-section border border-divider-regular rounded-lg max-h-80 overflow-y-auto">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">{preview}</pre>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(step === 'confirm' || step === 'preview') && (
        <div className="flex gap-3">
          {step === 'confirm' && (
            <button type="button" onClick={handlePreview}
              disabled={!maskedContent || !mappingData}
              className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-5 py-2.5 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed">
              <EyeIcon className="h-4 w-4" />预览还原
            </button>
          )}
          {step === 'preview' && (
            <button type="button" onClick={handleExecute}
              className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-5 py-2.5 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover">
              <PlayIcon className="h-4 w-4" />执行还原并保存
            </button>
          )}
          <button type="button" onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-4 py-2.5 text-sm font-medium text-components-button-secondary-text hover:bg-components-button-secondary-bg-hover">
            重新开始
          </button>
        </div>
      )}
    </div>
  )
}
