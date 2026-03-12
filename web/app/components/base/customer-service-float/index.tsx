'use client'

import { useState, useRef, useEffect } from 'react'
import { RiCustomerServiceLine, RiCloseFill, RiRobotLine, RiUserLine, RiPhoneLine, RiSendPlaneLine } from '@remixicon/react'
import { cn } from '@/utils/classnames'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'

export function CustomerServiceFloat() {
  const [showCustomerService, setShowCustomerService] = useState(false)
  const [customerServiceTab, setCustomerServiceTab] = useState<'ai' | 'human' | 'phone'>('ai')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false)
  
  // 悬浮窗位置和拖拽状态
  const [floatPosition, setFloatPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const floatRef = useRef<HTMLDivElement>(null)
  const [isPositionInitialized, setIsPositionInitialized] = useState(false)

  // 预设问题
  const presetQuestions = [
    '如何接入API？',
    '收费标准是怎样的？',
    '数据安全如何保障？',
    '怎么重置密码？'
  ]

  // 处理反馈提交
  const handleSubmitFeedback = () => {
    if (!feedbackMessage.trim()) return
    
    console.log('提交反馈:', feedbackMessage)
    
    setFeedbackMessage('')
    setShowCustomerService(false)
    setShowFeedbackSuccess(true)
  }

  // 处理客服弹窗
  const handleCustomerServiceToggle = () => {
    setShowCustomerService(!showCustomerService)
  }

  // 拖拽处理函数
  const handleMouseDown = (e: React.MouseEvent) => {
    if (showCustomerService) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - floatPosition.x,
      y: e.clientY - floatPosition.y
    })
    e.preventDefault()
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const buttonSize = 56

    const clampedX = Math.max(0, Math.min(windowWidth - buttonSize, newX))
    const clampedY = Math.max(0, Math.min(windowHeight - buttonSize, newY))

    setFloatPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragStart])

  // 保存位置到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('cheersai_float_position', JSON.stringify(floatPosition))
    } catch (error) {
      // 保存位置失败，忽略错误
    }
  }, [floatPosition])

  // 从本地存储加载位置，或设置默认右下角位置
  useEffect(() => {
    const initializePosition = () => {
      try {
        const stored = localStorage.getItem('cheersai_float_position')
        if (stored) {
          const position = JSON.parse(stored)
          
          if (position.x > 0 && position.y > 0 && 
              position.x < window.innerWidth && position.y < window.innerHeight) {
            setFloatPosition(position)
            setIsPositionInitialized(true)
            return
          } else {
            localStorage.removeItem('cheersai_float_position')
          }
        }
      } catch (error) {
        // 加载本地存储失败，使用默认位置
      }
      
      const windowWidth = window.innerWidth || 1920
      const windowHeight = window.innerHeight || 1080
      const buttonSize = 56
      const margin = 24
      
      const defaultX = windowWidth - buttonSize - margin
      const defaultY = windowHeight - buttonSize - margin
      
      setFloatPosition({ x: defaultX, y: defaultY })
      setIsPositionInitialized(true)
    }

    const timer = setTimeout(initializePosition, 100)
    return () => clearTimeout(timer)
  }, [])

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const stored = localStorage.getItem('cheersai_float_position')
      if (!stored && isPositionInitialized) {
        const windowWidth = window.innerWidth || 1920
        const windowHeight = window.innerHeight || 1080
        const buttonSize = 56
        const margin = 24
        
        const newX = windowWidth - buttonSize - margin
        const newY = windowHeight - buttonSize - margin
        
        setFloatPosition({ x: newX, y: newY })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isPositionInitialized])
  return (
    <>
      {/* 悬浮客服气泡 */}
      {isPositionInitialized && (
        <div 
          ref={floatRef}
          className="fixed z-50"
          style={{
            left: `${floatPosition.x}px`,
            top: `${floatPosition.y}px`,
          }}
        >
          {/* 客服弹窗 */}
          {showCustomerService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-overlay">
              <div className="bg-components-panel-bg rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* 弹窗头部 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-divider-regular">
                  <div className="flex items-center gap-3">
                    <RiCustomerServiceLine className="h-6 w-6 text-text-accent" />
                    <span className="text-lg font-semibold text-text-primary">在线客服</span>
                  </div>
                  <button
                    onClick={() => setShowCustomerService(false)}
                    className="p-1 rounded hover:bg-state-base-hover"
                  >
                    <RiCloseFill className="h-5 w-5 text-text-tertiary" />
                  </button>
                </div>

                {/* 标签页 */}
                <div className="flex border-b border-divider-regular">
                  <button
                    onClick={() => setCustomerServiceTab('ai')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                      customerServiceTab === 'ai'
                        ? "text-text-accent border-b-2 border-state-accent-solid bg-state-accent-hover"
                        : "text-text-secondary hover:text-text-primary hover:bg-state-base-hover"
                    )}
                  >
                    <RiRobotLine className="h-4 w-4" />
                    智能助手
                  </button>
                  <button
                    onClick={() => setCustomerServiceTab('human')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                      customerServiceTab === 'human'
                        ? "text-text-accent border-b-2 border-state-accent-solid bg-state-accent-hover"
                        : "text-text-secondary hover:text-text-primary hover:bg-state-base-hover"
                    )}
                  >
                    <RiUserLine className="h-4 w-4" />
                    人工客服
                  </button>
                  <button
                    onClick={() => setCustomerServiceTab('phone')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                      customerServiceTab === 'phone'
                        ? "text-text-accent border-b-2 border-state-accent-solid bg-state-accent-hover"
                        : "text-text-secondary hover:text-text-primary hover:bg-state-base-hover"
                    )}
                  >
                    <RiPhoneLine className="h-4 w-4" />
                    电话服务
                  </button>
                </div>
                {/* 内容区域 */}
                <div className="h-64 overflow-y-auto">
                  {customerServiceTab === 'ai' && (
                    <div className="p-6 h-full flex flex-col">
                      <div className="text-sm text-text-primary mb-4">
                        您好！我是智能助手，请问有什么可以帮您？
                      </div>
                      
                      {/* 预设问题 */}
                      <div className="space-y-2 flex-1">
                        {presetQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => setFeedbackMessage(question)}
                            className="w-full text-left p-3 text-sm text-text-accent bg-state-accent-hover rounded-lg hover:bg-state-accent-solid hover:text-components-button-primary-text transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {customerServiceTab === 'human' && (
                    <div className="p-6 h-full flex flex-col">
                      <div className="text-sm text-text-primary mb-4">
                        人工客服正在为您服务，请描述您遇到的问题：
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-text-tertiary">
                          <div className="mb-2">🎧</div>
                          <div className="text-sm">客服人员将尽快回复您</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {customerServiceTab === 'phone' && (
                    <div className="p-6 h-full flex flex-col">
                      <div className="text-sm text-text-primary mb-4">
                        电话客服服务
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-3">📞</div>
                          <div className="text-lg font-medium text-text-primary mb-2">
                            400-123-4567
                          </div>
                          <div className="text-sm text-text-tertiary">
                            服务时间：周一至周日 9:00-21:00
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 输入区域 */}
                {customerServiceTab === 'phone' ? (
                  <div className="border-t border-divider-regular px-6 py-4">
                    <div className="h-10"></div>
                  </div>
                ) : (
                  <div className="border-t border-divider-regular px-6 py-4 bg-background-section rounded-b-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="输入您的问题..."
                        className="flex-1 px-3 py-2 text-sm border border-components-input-border-active bg-components-input-bg-normal rounded-lg text-text-primary placeholder:text-text-placeholder focus:ring-2 focus:ring-state-accent-solid focus:border-state-accent-solid"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmitFeedback()
                          }
                        }}
                      />
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackMessage.trim()}
                        className={cn(
                          "px-4 py-2 rounded-lg transition-colors",
                          feedbackMessage.trim()
                            ? "bg-components-button-primary-bg text-components-button-primary-text hover:bg-components-button-primary-bg-hover"
                            : "bg-components-button-secondary-bg text-components-button-secondary-text cursor-not-allowed"
                        )}
                      >
                        <RiSendPlaneLine className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 客服气泡按钮 */}
          <button
            onMouseDown={handleMouseDown}
            onClick={!isDragging ? handleCustomerServiceToggle : undefined}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all",
              isDragging 
                ? "cursor-grabbing scale-110" 
                : "cursor-grab hover:bg-blue-600 hover:scale-105"
            )}
            title={isDragging ? "拖拽移动" : "在线客服"}
          >
            <RiCustomerServiceLine className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* 反馈成功弹窗 */}
      <Modal
        isShow={showFeedbackSuccess}
        onClose={() => setShowFeedbackSuccess(false)}
        className="p-0 w-[480px] max-w-[480px]"
      >
        <div className="flex flex-col gap-y-2 p-6 pb-4">
          <p className="system-md-regular text-text-secondary">
            反馈已提交，感谢您的建议！
          </p>
        </div>
        <div className="flex items-center justify-end gap-x-2 p-6 pt-0">
          <Button
            variant="primary"
            onClick={() => setShowFeedbackSuccess(false)}
          >
            确定
          </Button>
        </div>
      </Modal>
    </>
  )
}