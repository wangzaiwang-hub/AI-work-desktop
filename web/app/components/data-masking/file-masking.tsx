'use client'

import { useState, useRef, useCallback } from 'react'
import {
  DocumentIcon,
  EyeIcon,
  PlayIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { saveSandboxFile, scanEntities, extractTextFromFile } from '@/service/sandbox-files'
import type { NerEntity } from '@/service/sandbox-files'
import { encrypt, generateKey } from '@/lib/data-masking/crypto-utils'

// Text-based formats readable in browser
const TEXT_EXTENSIONS = new Set(['.md', '.txt', '.csv', '.json', '.xml', '.yaml', '.yml', '.log', '.conf', '.ini', '.toml', '.html', '.htm', '.css', '.js', '.ts', '.py', '.java', '.sql', '.sh', '.bat'])
// Binary formats requiring backend extraction
const BINARY_EXTENSIONS = new Set(['.docx', '.pdf'])
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.webp'])
const ALL_EXTENSIONS = [...TEXT_EXTENSIONS, ...BINARY_EXTENSIONS, ...IMAGE_EXTENSIONS]
const ACCEPT_STRING = ALL_EXTENSIONS.join(',')
interface FileMaskingProps {
  sandboxPath: string
}

interface ConfirmableEntity extends NerEntity {
  checked: boolean
  replacement: string
}

interface ManualReplacement {
  find: string
  replace: string
}

function getMaskedFileName(originalName: string): string {
  const dotIdx = originalName.lastIndexOf('.')
  if (dotIdx === -1) return `${originalName}.masked.txt`
  const ext = originalName.substring(dotIdx)
  const base = originalName.substring(0, dotIdx)
  // Binary formats get .masked.txt since we output plain text
  if (BINARY_EXTENSIONS.has(ext.toLowerCase()) || IMAGE_EXTENSIONS.has(ext.toLowerCase()))
    return `${base}.masked.txt`
  return `${base}.masked${ext}`
}

function getMappingFileName(originalName: string): string {
  const dotIdx = originalName.lastIndexOf('.')
  const base = dotIdx === -1 ? originalName : originalName.substring(0, dotIdx)
  return `${base}.mapping.json`
}

function getFileExtension(name: string): string {
  const dotIdx = name.lastIndexOf('.')
  return dotIdx === -1 ? '' : name.substring(dotIdx).toLowerCase()
}

function isSupportedFile(name: string): boolean {
  const ext = getFileExtension(name)
  return TEXT_EXTENSIONS.has(ext) || BINARY_EXTENSIONS.has(ext) || IMAGE_EXTENSIONS.has(ext)
}

function isBinaryFile(name: string): boolean {
  const ext = getFileExtension(name)
  return BINARY_EXTENSIONS.has(ext) || IMAGE_EXTENSIONS.has(ext)
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyEntityMasking(
  content: string,
  entities: ConfirmableEntity[],
  manualReplacements: ManualReplacement[],
): { masked: string; count: number } {
  let masked = content
  let totalCount = 0

  const sortedManual = [...manualReplacements]
    .filter(mr => mr.find.length > 0)
    .sort((a, b) => b.find.length - a.find.length)
  for (const mr of sortedManual) {
    const regex = new RegExp(escapeRegex(mr.find), 'g')
    let matchCount = 0
    masked = masked.replace(regex, () => { matchCount++; return mr.replace })
    totalCount += matchCount
  }

  const sorted = [...entities]
    .filter(e => e.checked)
    .sort((a, b) => b.text.length - a.text.length)
  for (const entity of sorted) {
    const regex = new RegExp(escapeRegex(entity.text), 'g')
    let matchCount = 0
    masked = masked.replace(regex, () => { matchCount++; return entity.replacement })
    totalCount += matchCount
  }
  return { masked, count: totalCount }
}

type Step = 'upload' | 'scanning' | 'confirm' | 'preview' | 'encryption-setup' | 'done'

export function FileMasking({ sandboxPath }: FileMaskingProps) {
  const [step, setStep] = useState<Step>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [entities, setEntities] = useState<ConfirmableEntity[]>([])
  const [manualReplacements, setManualReplacements] = useState<ManualReplacement[]>([])
  const [preview, setPreview] = useState('')
  const [maskedContent, setMaskedContent] = useState('')
  const [matchCount, setMatchCount] = useState(0)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)
  const [needsOcr, setNeedsOcr] = useState(false)
  const [ocrRunning, setOcrRunning] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [useCustomKey, setUseCustomKey] = useState(false)
  const [savingFiles, setSavingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startProgress = useCallback((cap: number, step: number, interval: number) => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    setExtractProgress(0)
    progressTimerRef.current = setInterval(() => {
      setExtractProgress(prev => {
        if (prev >= cap) return cap
        return prev + step
      })
    }, interval)
  }, [])

  const finishProgress = useCallback((onDone: () => void) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    setExtractProgress(100)
    setTimeout(onDone, 400)
  }, [])

  const processFile = useCallback((file: File) => {
    setError('')
    if (!isSupportedFile(file.name)) {
      setError(`不支持的文件格式。支持: ${ALL_EXTENSIONS.join(', ')}`)
      return
    }
    setSelectedFile(file)
    setStep('upload')
    setEntities([])
    setManualReplacements([])
    setPreview('')
    setMaskedContent('')
    setNeedsOcr(false)

    if (isBinaryFile(file.name)) {
      setFileContent('')
      setExtracting(true)
      startProgress(90, 8, 300)
      extractTextFromFile(file)
        .then((result) => {
          if (result.needs_ocr) {
            if (progressTimerRef.current) { clearInterval(progressTimerRef.current); progressTimerRef.current = null }
            setExtractProgress(0)
            setNeedsOcr(true)
            setFileContent('')
            setExtracting(false)
          }
          else {
            setFileContent(result.content)
            finishProgress(() => setExtracting(false))
          }
        })
        .catch((err) => {
          if (progressTimerRef.current) { clearInterval(progressTimerRef.current); progressTimerRef.current = null }
          setExtractProgress(0)
          setError(`文件解析失败: ${err instanceof Error ? err.message : err}`)
          setSelectedFile(null)
          setExtracting(false)
        })
    }
    else {
      const reader = new FileReader()
      reader.onload = (ev) => { setFileContent(ev.target?.result as string ?? '') }
      reader.onerror = () => setError('读取文件失败')
      reader.readAsText(file)
    }
  }, [startProgress, finishProgress])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleOcrExtract = useCallback(() => {
    if (!selectedFile) return
    setError('')
    setOcrRunning(true)
    setNeedsOcr(false)
    setExtracting(true)
    startProgress(85, 3, 600)
    extractTextFromFile(selectedFile, 'force')
      .then((result) => {
        setFileContent(result.content)
        finishProgress(() => {
          setExtracting(false)
          setOcrRunning(false)
        })
      })
      .catch((err) => {
        if (progressTimerRef.current) { clearInterval(progressTimerRef.current); progressTimerRef.current = null }
        setExtractProgress(0)
        setError(`OCR扫描失败: ${err instanceof Error ? err.message : err}`)
        setExtracting(false)
        setOcrRunning(false)
      })
  }, [selectedFile, startProgress, finishProgress])

  const handleScan = async () => {
    if (!fileContent) return
    setStep('scanning')
    setError('')
    try {
      const result = await scanEntities(fileContent)
      const confirmable: ConfirmableEntity[] = result.map((e, i) => ({
        ...e,
        checked: true,
        replacement: `[${e.label}_${String(i + 1).padStart(3, '0')}]`,
      }))
      setEntities(confirmable)
      setStep('confirm')
    }
    catch (err) {
      setError(`NER 扫描失败: ${err instanceof Error ? err.message : err}`)
      setStep('upload')
    }
  }

  const handleToggleEntity = (idx: number) => {
    setEntities(prev => prev.map((e, i) => i === idx ? { ...e, checked: !e.checked } : e))
  }

  const handleToggleAll = (checked: boolean) => {
    setEntities(prev => prev.map(e => ({ ...e, checked })))
  }

  const handleReplacementChange = (idx: number, value: string) => {
    setEntities(prev => prev.map((e, i) => i === idx ? { ...e, replacement: value } : e))
  }

  const handleAddManualReplacement = () => {
    setManualReplacements(prev => [...prev, { find: '', replace: '' }])
  }

  const handleRemoveManualReplacement = (idx: number) => {
    setManualReplacements(prev => prev.filter((_, i) => i !== idx))
  }

  const handleManualFindChange = (idx: number, value: string) => {
    setManualReplacements(prev => prev.map((mr, i) => i === idx ? { ...mr, find: value } : mr))
  }

  const handleManualReplaceChange = (idx: number, value: string) => {
    setManualReplacements(prev => prev.map((mr, i) => i === idx ? { ...mr, replace: value } : mr))
  }

  const handlePreview = () => {
    const checkedEntities = entities.filter(e => e.checked)
    const validManual = manualReplacements.filter(mr => mr.find.length > 0)
    if (checkedEntities.length === 0 && validManual.length === 0) {
      setError('请至少选择一个实体或添加一条替换规则')
      return
    }
    const { masked, count } = applyEntityMasking(fileContent, entities, manualReplacements)
    setMaskedContent(masked)
    setMatchCount(count)
    setPreview(masked.length > 3000 ? masked.substring(0, 3000) + '\n\n... (已截断)' : masked)
    setStep('preview')
  }

  const handleExecute = async () => {
    if (!selectedFile || !maskedContent) return
    setError('')
    
    // 检查是否启用了加密
    const encryptionEnabled = localStorage.getItem('mapping_encryption_enabled')
    if (encryptionEnabled === 'false') {
      // 不加密，直接保存
      await handleSaveWithoutEncryption()
      return
    }
    
    // 检查是否有全局口令
    const globalPassphrase = localStorage.getItem('mapping_encryption_passphrase')
    if (globalPassphrase && globalPassphrase.length >= 32) {
      // 使用全局口令直接加密
      await handleConfirmEncryptionWithKey(globalPassphrase)
    } else {
      // 没有全局口令或口令长度不足，提示用户去设置
      setError('请先在"设置 → 数据安全"页面配置全局加密口令（至少32位字符）')
    }
  }

  const handleSaveWithoutEncryption = async () => {
    if (!selectedFile || !maskedContent) return
    setSavingFiles(true)
    setError('')
    const maskedFileName = getMaskedFileName(selectedFile.name)
    const messages: string[] = []

    // Build mapping rules for reverse masking
    const mappingRules: { original: string; replacement: string; label: string; type: string; count: string }[] = []
    for (const e of entities) {
      if (e.checked) {
        mappingRules.push({
          original: e.text,
          replacement: e.replacement,
          label: e.label,
          type: e.type,
          count: e.count,
        })
      }
    }
    for (const mr of manualReplacements) {
      if (mr.find.length > 0) {
        const cnt = fileContent.split(mr.find).length - 1
        mappingRules.push({
          original: mr.find,
          replacement: mr.replace,
          label: '手动替换',
          type: 'manual',
          count: String(cnt),
        })
      }
    }

    const mappingData = {
      version: '1.0',
      source_file: selectedFile.name,
      masked_file: maskedFileName,
      created_at: new Date().toISOString(),
      total_replacements: matchCount,
      rules: mappingRules,
    }
    const mappingJson = JSON.stringify(mappingData, null, 2)
    const mappingFileName = getMappingFileName(selectedFile.name)

    if (sandboxPath) {
      // Save masked file
      try {
        const result = await saveSandboxFile(sandboxPath, maskedFileName, maskedContent)
        messages.push(`脱敏文件已保存到 ${result.file_path}`)
      }
      catch (saveErr) {
        messages.push(`脱敏文件保存失败: ${saveErr instanceof Error ? saveErr.message : saveErr}`)
      }
      // Save unencrypted mapping rules
      try {
        await saveSandboxFile(sandboxPath, mappingFileName, mappingJson)
        messages.push(`映射规则已保存（未加密）`)
      }
      catch (saveErr) {
        messages.push(`映射规则保存失败: ${saveErr instanceof Error ? saveErr.message : saveErr}`)
      }
    }

    try {
      const blob = new Blob([maskedContent], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = maskedFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      messages.push('浏览器下载已触发')
    }
    catch {
      messages.push('浏览器下载失败')
    }

    setSavingFiles(false)
    const hasError = messages.some(m => m.includes('失败'))
    if (hasError)
      setError(messages.join('；'))
    else
      setStep('done')
  }

  const handleReset = () => {
    setSelectedFile(null)
    setFileContent('')
    setEntities([])
    setManualReplacements([])
    setPreview('')
    setMaskedContent('')
    setMatchCount(0)
    setStep('upload')
    setError('')
    setExtracting(false)
    setExtractProgress(0)
    setNeedsOcr(false)
    setOcrRunning(false)
    setEncryptionKey('')
    setShowKey(false)
    setUseCustomKey(false)
    setSavingFiles(false)
  }

  const handleGenerateKey = () => {
    const key = generateKey(16) // 生成32位十六进制字符串（16字节）
    setEncryptionKey(key)
    setShowKey(true)
  }

  const handleConfirmEncryption = async () => {
    if (!selectedFile || !maskedContent) return
    if (!encryptionKey || encryptionKey.length < 32) {
      setError('加密口令必须至少32位字符')
      return
    }
    await handleConfirmEncryptionWithKey(encryptionKey)
  }

  const handleConfirmEncryptionWithKey = async (key: string) => {
    if (!selectedFile || !maskedContent) return

    setSavingFiles(true)
    setError('')
    const maskedFileName = getMaskedFileName(selectedFile.name)
    const messages: string[] = []

    // Build mapping rules for reverse masking
    const mappingRules: { original: string; replacement: string; label: string; type: string; count: string }[] = []
    for (const e of entities) {
      if (e.checked) {
        mappingRules.push({
          original: e.text,
          replacement: e.replacement,
          label: e.label,
          type: e.type,
          count: e.count,
        })
      }
    }
    for (const mr of manualReplacements) {
      if (mr.find.length > 0) {
        const cnt = fileContent.split(mr.find).length - 1
        mappingRules.push({
          original: mr.find,
          replacement: mr.replace,
          label: '手动替换',
          type: 'manual',
          count: String(cnt),
        })
      }
    }

    const mappingData = {
      version: '1.0',
      source_file: selectedFile.name,
      masked_file: maskedFileName,
      created_at: new Date().toISOString(),
      total_replacements: matchCount,
      rules: mappingRules,
    }
    const mappingJson = JSON.stringify(mappingData, null, 2)

    // Encrypt mapping data
    let encryptedMappingJson: string
    try {
      encryptedMappingJson = await encrypt(mappingJson, key)
    }
    catch (encErr) {
      setSavingFiles(false)
      setError(`加密失败: ${encErr instanceof Error ? encErr.message : encErr}`)
      return
    }

    const encryptedMappingData = {
      version: '1.0',
      encrypted: true,
      data: encryptedMappingJson,
    }
    const encryptedMappingJsonStr = JSON.stringify(encryptedMappingData, null, 2)
    const mappingFileName = getMappingFileName(selectedFile.name)

    if (sandboxPath) {
      // Save masked file
      try {
        const result = await saveSandboxFile(sandboxPath, maskedFileName, maskedContent)
        messages.push(`脱敏文件已保存到 ${result.file_path}`)
      }
      catch (saveErr) {
        messages.push(`脱敏文件保存失败: ${saveErr instanceof Error ? saveErr.message : saveErr}`)
      }
      // Save encrypted mapping rules
      try {
        await saveSandboxFile(sandboxPath, mappingFileName, encryptedMappingJsonStr)
        messages.push(`加密映射规则已保存`)
      }
      catch (saveErr) {
        messages.push(`映射规则保存失败: ${saveErr instanceof Error ? saveErr.message : saveErr}`)
      }
    }

    try {
      const blob = new Blob([maskedContent], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = maskedFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      messages.push('浏览器下载已触发')
    }
    catch {
      messages.push('浏览器下载失败')
    }

    setSavingFiles(false)
    const hasError = messages.some(m => m.includes('失败'))
    if (hasError)
      setError(messages.join('；'))
    else
      setStep('done')
  }

  // Done state
  if (step === 'done') {
    return (
      <div className="text-center py-16">
        <CheckCircleIcon className="mx-auto h-14 w-14 text-text-success" />
        <h3 className="mt-3 text-base font-medium text-text-primary">脱敏完成</h3>
        <p className="mt-1 text-sm text-text-tertiary">已替换 {matchCount} 处敏感数据</p>
        <p className="mt-1 text-xs text-text-quaternary">
          文件: {selectedFile ? getMaskedFileName(selectedFile.name) : ''} → {sandboxPath}
        </p>
        <p className="mt-1 text-xs text-text-quaternary">
          映射规则: {selectedFile ? getMappingFileName(selectedFile.name) : ''} (可用于反脱敏还原)
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-components-button-primary-text bg-components-button-primary-bg rounded-lg hover:bg-components-button-primary-bg-hover">
            继续脱敏其他文件
          </button>
          <a href="/data-masking?tab=files"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-components-button-secondary-text bg-components-button-secondary-bg border border-components-button-secondary-border rounded-lg hover:bg-components-button-secondary-bg-hover">
            查看文件管理
          </a>
        </div>
      </div>
    )
  }

  const checkedCount = entities.filter(e => e.checked).length
  const validManualCount = manualReplacements.filter(mr => mr.find.length > 0).length

  const grouped: Record<string, ConfirmableEntity[]> = {}
  entities.forEach((e) => {
    const key = e.label
    if (!grouped[key]) grouped[key] = []
    grouped[key].push({ ...e })
  })

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-text-destructive bg-state-destructive-hover px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Stats cards - show when no file selected */}
      {step === 'upload' && !selectedFile && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-state-accent-hover flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-text-accent" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">支持格式</p>
                <p className="text-sm font-medium text-text-primary">MD / TXT / Word / PDF / 图片 等</p>
              </div>
            </div>
          </div>
          <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-state-success-hover flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-text-success" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">脱敏方式</p>
                <p className="text-sm font-medium text-text-primary">NER + 手动替换</p>
              </div>
            </div>
          </div>
          <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-state-accent-hover flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-text-accent" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">处理方式</p>
                <p className="text-sm font-medium text-text-primary">本地处理，不上传</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag & drop upload area */}
      {step === 'upload' && (
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
            dragging
              ? 'border-state-accent-solid bg-state-accent-hover'
              : selectedFile
                ? 'border-state-success-solid bg-state-success-hover'
                : 'border-divider-regular bg-components-panel-bg hover:border-divider-deep hover:bg-state-base-hover'
          } ${selectedFile ? 'p-5' : 'p-10'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_STRING}
            onChange={handleFileSelect}
            className="hidden"
          />
          {selectedFile ? (
            <div className="space-y-3" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-state-success-hover flex items-center justify-center">
                    <DocumentIcon className="h-5 w-5 text-text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{selectedFile.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                      {extracting
                        ? ocrRunning ? ' · OCR扫描中，请耐心等待...' : ' · 正在解析文件内容...'
                        : needsOcr ? ' · 无可提取文本（扫描件）' : fileContent ? ` · ${fileContent.length} 字符` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReset()}
                    className="text-xs text-text-tertiary hover:text-text-secondary px-2 py-1 rounded hover:bg-state-base-hover"
                  >
                    重新选择
                  </button>
                  {needsOcr
                    ? (
                      <button
                        type="button"
                        onClick={() => handleOcrExtract()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-state-warning-hover-alt px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        <EyeIcon className="h-4 w-4" />OCR扫描
                      </button>
                    )
                    : (
                      <button
                        type="button"
                        onClick={() => handleScan()}
                        disabled={extracting || !fileContent}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-components-button-primary-bg px-4 py-2 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {extracting
                          ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>{ocrRunning ? 'OCR中...' : '解析中...'}</>
                          : <><MagnifyingGlassIcon className="h-4 w-4" />智能扫描</>
                        }
                      </button>
                    )}
                </div>
              </div>
              {/* Green progress bar */}
              {extracting && (
                <div className="w-full bg-background-default-dimmed rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out bg-green-500"
                    style={{ width: `${Math.min(extractProgress, 100)}%` }}
                  />
                </div>
              )}
              {needsOcr && !extracting && (
                <div className="text-xs text-text-warning bg-state-warning-hover px-3 py-2 rounded-lg">
                  该PDF为扫描件，无法直接提取文本。点击「OCR扫描」使用光学字符识别提取内容（速度较慢，仅扫描前10页）。
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <ArrowUpTrayIcon className={`mx-auto h-10 w-10 ${dragging ? 'text-text-accent' : 'text-text-quaternary'}`} />
              <p className="mt-3 text-sm font-medium text-text-secondary">
                {dragging ? '松开鼠标上传文件' : '拖拽文件到此处上传'}
              </p>
              <p className="mt-1 text-xs text-text-quaternary">或点击此区域选择文件 · 支持 Markdown、TXT、Word、PDF、图片(OCR) 等格式</p>
            </div>
          )}
        </div>
      )}

      {/* Scanning indicator */}
      {step === 'scanning' && (
        <div className="flex flex-col items-center gap-3 py-12 bg-components-panel-bg rounded-xl border border-divider-regular">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-state-accent-solid"></div>
          <span className="text-sm text-text-secondary">正在使用 NER 模型扫描文档，请稍候...</span>
          <span className="text-xs text-text-quaternary">{selectedFile?.name}</span>
        </div>
      )}

      {/* Step 2: Confirm entities */}
      {step === 'confirm' && (
        <>
          {/* File info bar */}
          <div className="flex items-center justify-between bg-components-panel-bg rounded-lg border border-divider-regular px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <DocumentIcon className="h-4 w-4 text-text-quaternary" />
              <span className="font-medium">{selectedFile?.name}</span>
              <span className="text-text-quaternary">·</span>
              <span className="text-text-quaternary">{(selectedFile?.size ?? 0 / 1024).toFixed(1)} KB</span>
            </div>
            <button onClick={handleReset} className="text-xs text-text-tertiary hover:text-text-secondary">重新选择文件</button>
          </div>

          {entities.length > 0 && (
            <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-text-accent" />
                  <label className="text-sm font-medium text-text-secondary">
                    发现 {entities.length} 个候选敏感实体
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleAll(true)}
                    className="text-xs text-text-accent hover:underline">全选</button>
                  <span className="text-xs text-text-quaternary">|</span>
                  <button onClick={() => handleToggleAll(false)}
                    className="text-xs text-text-accent hover:underline">全不选</button>
                </div>
              </div>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {Object.entries(grouped).map(([label, items]) => (
                  <div key={label}>
                    <div className="text-xs font-semibold text-text-tertiary mb-1 px-1">{label} ({items.length})</div>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const realIdx = entities.findIndex(e => e.text === item.text && e.label === item.label)
                        return (
                          <label key={`${item.text}-${item.label}`}
                            className="flex items-center gap-3 p-2 border border-divider-regular rounded-md hover:bg-state-base-hover cursor-pointer">
                            <input type="checkbox" checked={entities[realIdx]?.checked ?? false}
                              onChange={() => handleToggleEntity(realIdx)}
                              className="h-4 w-4 text-state-accent-solid border-divider-regular rounded" />
                            <span className="text-sm font-medium text-text-primary min-w-[80px]">{item.text}</span>
                            <span className="text-xs text-text-quaternary">×{item.count}</span>
                            <span className="text-xs text-text-quaternary">→</span>
                            <input type="text" value={entities[realIdx]?.replacement ?? ''}
                              onChange={e => handleReplacementChange(realIdx, e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="flex-1 text-xs border border-divider-regular bg-components-input-bg-normal rounded px-2 py-1 text-text-secondary focus:ring-1 focus:ring-state-accent-solid focus:border-state-accent-solid" />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual Find & Replace */}
          <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-text-tertiary" />
                <label className="text-sm font-medium text-text-secondary">手动查找替换</label>
              </div>
              <button type="button" onClick={handleAddManualReplacement}
                className="inline-flex items-center gap-1 text-xs text-text-accent hover:underline">
                <PlusIcon className="h-3.5 w-3.5" />添加
              </button>
            </div>
            {manualReplacements.length === 0 ? (
              <p className="text-xs text-text-quaternary text-center py-3">点击"添加"按钮添加自定义查找替换规则，类似 Ctrl+H</p>
            ) : (
              <div className="space-y-2">
                {manualReplacements.map((mr, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="text" value={mr.find} placeholder="查找内容"
                      onChange={e => handleManualFindChange(idx, e.target.value)}
                      className="flex-1 text-xs border border-divider-regular bg-components-input-bg-normal rounded px-2 py-1.5 text-text-secondary focus:ring-1 focus:ring-state-accent-solid focus:border-state-accent-solid" />
                    <span className="text-xs text-text-quaternary">→</span>
                    <input type="text" value={mr.replace} placeholder="替换为"
                      onChange={e => handleManualReplaceChange(idx, e.target.value)}
                      className="flex-1 text-xs border border-divider-regular bg-components-input-bg-normal rounded px-2 py-1.5 text-text-secondary focus:ring-1 focus:ring-state-accent-solid focus:border-state-accent-solid" />
                    {fileContent && mr.find && (
                      <span className="text-xs text-text-quaternary whitespace-nowrap">
                        {fileContent.split(mr.find).length - 1}处
                      </span>
                    )}
                    <button type="button" onClick={() => handleRemoveManualReplacement(idx)}
                      className="text-text-quaternary hover:text-text-destructive">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview */}
      {step === 'preview' && preview && (
        <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-text-accent" />
              <label className="text-sm font-medium text-text-secondary">脱敏预览 (替换 {matchCount} 处)</label>
            </div>
            <button onClick={() => setStep('confirm')} className="text-xs text-text-accent hover:underline">返回修改</button>
          </div>
          <div className="p-4 bg-background-section border border-divider-regular rounded-lg max-h-80 overflow-y-auto">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">{preview}</pre>
          </div>
        </div>
      )}

      {/* Encryption Setup */}
      {step === 'encryption-setup' && (
        <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-text-warning" />
            <h3 className="text-base font-medium text-text-primary">设置映射文件加密口令</h3>
          </div>
          <div className="mb-4 rounded-md bg-state-accent-hover border border-state-accent-hover-alt px-3 py-2">
            <p className="text-xs text-text-accent">💡 提示：您可以在"设置 → 数据安全"页面中配置全局加密口令，配置后将自动应用于所有文件，无需每次设置。</p>
          </div>
          <p className="text-sm text-text-tertiary mb-6">
            映射文件包含原始敏感数据，建议使用加密口令进行加密保护。请妥善保管此口令，反脱敏时需要使用。
          </p>

          <div className="space-y-4">
            {/* Key generation options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useCustomKey}
                  onChange={() => {
                    setUseCustomKey(false)
                    setEncryptionKey('')
                    setShowKey(false)
                  }}
                  className="h-4 w-4 text-state-accent-solid border-divider-regular"
                />
                <span className="text-sm text-text-secondary">系统生成（推荐）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useCustomKey}
                  onChange={() => {
                    setUseCustomKey(true)
                    setEncryptionKey('')
                    setShowKey(true)
                  }}
                  className="h-4 w-4 text-state-accent-solid border-divider-regular"
                />
                <span className="text-sm text-text-secondary">自定义口令</span>
              </label>
            </div>

            {/* System generated key */}
            {!useCustomKey && (
              <div className="space-y-3">
                {!encryptionKey ? (
                  <button
                    type="button"
                    onClick={handleGenerateKey}
                    className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-4 py-2 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover"
                  >
                    生成32位加密口令
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={encryptionKey}
                          readOnly
                          className="w-full text-sm border border-divider-regular bg-background-section rounded px-3 py-2 text-text-primary font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="px-3 py-2 text-sm text-text-accent hover:underline"
                      >
                        {showKey ? '隐藏' : '显示'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(encryptionKey)
                        }}
                        className="px-3 py-2 text-sm text-text-accent hover:underline"
                      >
                        复制
                      </button>
                    </div>
                    <p className="text-xs text-text-warning">
                      ⚠️ 请务必保存此口令！反脱敏时需要使用，丢失后无法恢复原始数据。
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Custom key input */}
            {useCustomKey && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    placeholder="请输入至少32位字符的加密口令"
                    className="flex-1 text-sm border border-divider-regular bg-components-input-bg-normal rounded px-3 py-2 text-text-primary focus:ring-1 focus:ring-state-accent-solid focus:border-state-accent-solid"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="px-3 py-2 text-sm text-text-accent hover:underline"
                  >
                    {showKey ? '隐藏' : '显示'}
                  </button>
                </div>
                <p className="text-xs text-text-tertiary">
                  口令长度: {encryptionKey.length} / 32 (最少)
                </p>
                {encryptionKey.length > 0 && encryptionKey.length < 32 && (
                  <p className="text-xs text-text-warning">
                    口令长度不足，请输入至少32位字符
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-divider-regular">
            <button
              type="button"
              onClick={handleConfirmEncryption}
              disabled={!encryptionKey || encryptionKey.length < 32 || savingFiles}
              className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-5 py-2.5 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingFiles ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  保存中...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  加密并保存
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSaveWithoutEncryption}
              disabled={savingFiles}
              className="inline-flex items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-4 py-2.5 text-sm font-medium text-components-button-secondary-text hover:bg-components-button-secondary-bg-hover disabled:opacity-50"
            >
              {savingFiles ? '保存中...' : '跳过加密'}
            </button>
            <button
              type="button"
              onClick={() => setStep('preview')}
              disabled={savingFiles}
              className="inline-flex items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-4 py-2.5 text-sm font-medium text-components-button-secondary-text hover:bg-components-button-secondary-bg-hover disabled:opacity-50"
            >
              返回预览
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(step === 'confirm' || step === 'preview') && (
        <div className="flex gap-3">
          {step === 'confirm' && (
            <button type="button" onClick={handlePreview}
              disabled={checkedCount === 0 && validManualCount === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-components-button-primary-bg px-5 py-2.5 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed">
              <EyeIcon className="h-4 w-4" />预览脱敏 ({checkedCount + validManualCount} 项)
            </button>
          )}
          {step === 'preview' && (
            <button type="button" onClick={handleExecute}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              <PlayIcon className="h-4 w-4" />执行脱敏并保存
            </button>
          )}
          <button type="button" onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-4 py-2.5 text-sm font-medium text-components-button-secondary-text hover:bg-components-button-secondary-bg-hover">
            重新开始
          </button>
        </div>
      )}

      {/* Usage tips - show when no file selected */}
      {step === 'upload' && !selectedFile && (
        <div className="bg-components-panel-bg rounded-xl border border-divider-regular p-5">
          <h4 className="text-sm font-medium text-text-secondary mb-3">使用说明</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">1</span>
              <p className="text-xs text-text-tertiary">上传或拖拽文件到上方区域（支持多种格式）</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">2</span>
              <p className="text-xs text-text-tertiary">点击「智能扫描」自动识别敏感实体</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">3</span>
              <p className="text-xs text-text-tertiary">确认需要脱敏的实体，可自定义替换文本</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-state-accent-hover text-text-accent text-xs flex items-center justify-center font-medium">4</span>
              <p className="text-xs text-text-tertiary">预览后执行，脱敏文件自动保存到沙箱</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
