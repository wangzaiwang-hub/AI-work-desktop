"use client"
import type { FC } from 'react'
import { useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
import type { MaskingRule, MaskingStrategy } from '@/lib/data-masking/types'
import { RULE_TEMPLATES } from '@/lib/data-masking/rules-manager'

interface RuleFormProps {
  rule?: MaskingRule
  onSave: (data: Omit<MaskingRule, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const STRATEGY_OPTIONS = [
  { value: 'replacement', label: '\u5b8c\u5168\u66ff\u6362', hint: '\u7528\u56fa\u5b9a\u6587\u672c\u66ff\u6362\u5339\u914d\u5185\u5bb9' },
  { value: 'partial-mask', label: '\u90e8\u5206\u906e\u853d', hint: '\u4fdd\u7559\u9996\u5c3e\u5b57\u7b26\uff0c\u4e2d\u95f4\u7528*\u906e\u853d' },
  { value: 'context-keyword', label: '\u4e0a\u4e0b\u6587\u5339\u914d', hint: '\u4ec5\u5728\u5173\u952e\u8bcd\u9644\u8fd1\u624d\u8131\u654f' },
  { value: 'tokenization', label: '\u7f16\u53f7\u66ff\u6362', hint: '\u66ff\u6362\u4e3a [\u524d\u7f00_001] \u683c\u5f0f' },
  { value: 'format-preserving', label: '\u683c\u5f0f\u4fdd\u7559', hint: '\u4fdd\u7559\u539f\u59cb\u683c\u5f0f\u7ed3\u6784' },
]

const TEMPLATE_LIST = Object.entries(RULE_TEMPLATES).map(([key, tpl]) => ({
  key, name: tpl.name, description: tpl.description,
}))

export const RuleForm: FC<RuleFormProps> = ({ rule, onSave, onCancel }) => {
  const [name, setName] = useState(rule?.name ?? '')
  const [description, setDescription] = useState(rule?.description ?? '')
  const [pattern, setPattern] = useState(
    rule?.pattern ? (typeof rule.pattern === 'string' ? rule.pattern : rule.pattern.source) : '',
  )
  const [strategyType, setStrategyType] = useState<string>(rule?.strategy?.type ?? 'replacement')
  const [strategyValue, setStrategyValue] = useState(() => {
    if (!rule?.strategy) return '***'
    const s = rule.strategy as Record<string, unknown>
    return String(s.value ?? s.prefix ?? s.format ?? s.keywords ?? '***')
  })
  const [keepFirst, setKeepFirst] = useState(() => {
    if (rule?.strategy?.type === 'partial-mask') return rule.strategy.keepFirst
    return 3
  })
  const [keepLast, setKeepLast] = useState(() => {
    if (rule?.strategy?.type === 'partial-mask') return rule.strategy.keepLast
    return 4
  })
  const [maskChar, setMaskChar] = useState(() => {
    if (rule?.strategy?.type === 'partial-mask') return rule.strategy.maskChar
    return '*'
  })
  const [enabled, setEnabled] = useState(rule?.enabled ?? true)
  const [priority, setPriority] = useState(rule?.priority ?? 1)
  const [error, setError] = useState('')

  const applyTemplate = (key: string) => {
    const tpl = RULE_TEMPLATES[key as keyof typeof RULE_TEMPLATES]
    if (!tpl) return
    setName(tpl.name); setDescription(tpl.description)
    setPattern(typeof tpl.pattern === 'string' ? tpl.pattern : String(tpl.pattern))
    setStrategyType(tpl.strategy.type); setPriority(tpl.priority); setEnabled(tpl.enabled)
    if (tpl.strategy.type === 'partial-mask') {
      setKeepFirst(tpl.strategy.keepFirst); setKeepLast(tpl.strategy.keepLast); setMaskChar(tpl.strategy.maskChar); setStrategyValue('')
    } else if (tpl.strategy.type === 'context-keyword') {
      setStrategyValue(tpl.strategy.value)
    } else {
      const s = tpl.strategy as Record<string, string>
      setStrategyValue(s.value ?? s.prefix ?? s.format ?? '***')
    }
  }

  const buildStrategy = (): MaskingStrategy => {
    switch (strategyType) {
      case 'partial-mask': return { type: 'partial-mask', keepFirst, keepLast, maskChar: maskChar || '*' }
      case 'context-keyword': return { type: 'context-keyword', keywords: [], value: strategyValue || '***' }
      case 'tokenization': return { type: 'tokenization', prefix: strategyValue || 'TOKEN' }
      case 'format-preserving': return { type: 'format-preserving', format: strategyValue }
      default: return { type: 'replacement', value: strategyValue || '***' }
    }
  }

  const handleSubmit = () => {
    setError('')
    if (!name.trim()) { setError('\u8bf7\u8f93\u5165\u89c4\u5219\u540d\u79f0'); return }
    if (!pattern.trim()) { setError('\u8bf7\u8f93\u5165\u5339\u914d\u6a21\u5f0f'); return }
    try { new RegExp(pattern) } catch { setError('\u6b63\u5219\u8868\u8fbe\u5f0f\u65e0\u6548'); return }
    onSave({ name: name.trim(), description: description.trim(), pattern, strategy: buildStrategy(), enabled, priority })
  }

  const inputCls = 'w-full px-3 py-2 border border-components-input-border-active bg-components-input-bg-normal rounded-lg text-sm text-text-primary placeholder:text-text-placeholder focus:ring-2 focus:ring-state-accent-solid focus:border-state-accent-solid'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-overlay">
      <div className="bg-components-panel-bg rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider-regular">
          <h3 className="text-lg font-semibold text-text-primary">
            {rule ? '\u7f16\u8f91\u89c4\u5219' : '\u521b\u5efa\u8131\u654f\u89c4\u5219'}
          </h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-state-base-hover">
            <RiCloseLine className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {!rule && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{'\u5feb\u901f\u9009\u62e9\u6a21\u677f'}</label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_LIST.map(tpl => (
                  <button key={tpl.key} onClick={() => applyTemplate(tpl.key)}
                    className="px-3 py-1.5 text-xs rounded-full border border-divider-regular text-text-secondary hover:bg-state-accent-hover hover:border-state-accent-solid hover:text-text-accent transition-colors">
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{'\u89c4\u5219\u540d\u79f0'}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={'\u4f8b\u5982\uff1a\u624b\u673a\u53f7\u8131\u654f'} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{'\u63cf\u8ff0'}</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder={'\u89c4\u5219\u7528\u9014\u8bf4\u660e'} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{'\u5339\u914d\u6a21\u5f0f\uff08\u6b63\u5219\u8868\u8fbe\u5f0f\uff09'}</label>
            <input type="text" value={pattern} onChange={e => setPattern(e.target.value)} placeholder={'1[3-9]\\d{9}'} className={inputCls + ' font-mono'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{'\u8131\u654f\u7b56\u7565'}</label>
            <select value={strategyType} onChange={e => setStrategyType(e.target.value)} className={inputCls}>
              {STRATEGY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label} \u2014 {opt.hint}</option>)}
            </select>
          </div>

          {strategyType === 'partial-mask' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{'\u4fdd\u7559\u524dN\u4f4d'}</label>
                <input type="number" value={keepFirst} onChange={e => setKeepFirst(Number(e.target.value))} min={0} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{'\u4fdd\u7559\u540eN\u4f4d'}</label>
                <input type="number" value={keepLast} onChange={e => setKeepLast(Number(e.target.value))} min={0} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{'\u906e\u853d\u5b57\u7b26'}</label>
                <input type="text" value={maskChar} onChange={e => setMaskChar(e.target.value)} maxLength={1} className={inputCls} />
              </div>
            </div>
          )}

          {(strategyType === 'replacement' || strategyType === 'context-keyword') && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{'\u66ff\u6362\u503c'}</label>
              <input type="text" value={strategyValue} onChange={e => setStrategyValue(e.target.value)} placeholder="***" className={inputCls} />
            </div>
          )}

          {strategyType === 'tokenization' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{'\u7f16\u53f7\u524d\u7f00'}</label>
              <input type="text" value={strategyValue} onChange={e => setStrategyValue(e.target.value)} placeholder="ORG" className={inputCls} />
              <p className="mt-1 text-xs text-text-quaternary">{'\u6548\u679c: [ORG_001], [ORG_002], ...'}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{'\u4f18\u5148\u7ea7'}</label>
              <input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} min={0} className={inputCls} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-divider-regular text-state-accent-solid focus:ring-state-accent-solid" />
                <span className="text-sm text-text-secondary">{'\u542f\u7528\u89c4\u5219'}</span>
              </label>
            </div>
          </div>

          {error && <div className="text-sm text-text-destructive bg-state-destructive-hover px-3 py-2 rounded-lg">{error}</div>}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-divider-regular bg-background-section rounded-b-xl">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-components-button-secondary-text bg-components-button-secondary-bg border border-components-button-secondary-border rounded-lg hover:bg-components-button-secondary-bg-hover">
            {'\u53d6\u6d88'}
          </button>
          <button onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-components-button-primary-text bg-components-button-primary-bg rounded-lg hover:bg-components-button-primary-bg-hover">
            {rule ? '\u4fdd\u5b58' : '\u521b\u5efa'}
          </button>
        </div>
      </div>
    </div>
  )
}