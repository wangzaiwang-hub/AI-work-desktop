'use client'

import { useState } from 'react'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'

interface ConfirmModalProps {
  isShow: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
  isShow,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isShow={isShow}
      onClose={onClose}
      className="p-0 w-[480px] max-w-[480px]"
    >
      <div className="flex flex-col gap-y-2 p-6 pb-4">
        {title && (
          <div className="title-2xl-semi-bold text-text-primary">
            {title}
          </div>
        )}
        <p className="system-md-regular text-text-secondary">
          {content}
        </p>
      </div>
      <div className="flex items-center justify-end gap-x-2 p-6 pt-0">
        <Button onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={type === 'danger' ? 'warning' : 'primary'}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

interface PromptModalProps {
  isShow: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
}

export function PromptModal({
  isShow,
  onClose,
  onConfirm,
  title,
  placeholder,
  defaultValue = '',
  confirmText = '确定',
  cancelText = '取消',
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue)

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim())
      onClose()
      setValue('')
    }
  }

  const handleClose = () => {
    onClose()
    setValue('')
  }

  return (
    <Modal
      isShow={isShow}
      onClose={handleClose}
      className="p-0 w-[480px] max-w-[480px]"
    >
      <div className="flex flex-col gap-y-3 p-6 pb-4">
        <div className="title-2xl-semi-bold text-text-primary">
          {title}
        </div>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-divider-regular bg-components-input-bg-normal text-text-primary placeholder:text-text-placeholder rounded-lg focus:outline-none focus:ring-1 focus:ring-state-accent-solid focus:border-components-input-border-active"
          autoFocus
        />
      </div>
      <div className="flex items-center justify-end gap-x-2 p-6 pt-0">
        <Button onClick={handleClose}>
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!value.trim()}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
