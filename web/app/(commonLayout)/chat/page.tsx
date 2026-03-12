'use client'

import { useState, useRef, useEffect } from 'react'
import { RiAttachmentLine, RiMicLine, RiAddLine, RiDeleteBinLine, RiSearchLine, RiMoreLine, RiArrowDownSLine, RiCheckLine, RiMenuLine, RiCloseLine, RiDownloadLine, RiFileCopyLine, RiRefreshLine } from '@remixicon/react'
import { cn } from '@/utils/classnames'
import { ModelTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { useModelList, useDefaultModel } from '@/app/components/header/account-setting/model-provider-page/hooks'
import { SandboxFilePicker } from '@/app/components/base/sandbox-file-picker'
import { Markdown } from '@/app/components/base/markdown'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  files?: UploadedFile[]
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  isDesensitized?: boolean
  content?: string
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
}

interface SelectedModel {
  provider: string
  model: string
  label: string
}

// 格式化时间戳
function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const modelSelectorRef = useRef<HTMLDivElement>(null)

  // 选中的模型状态 - 移到前面声明
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showSandboxPicker, setShowSandboxPicker] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [isAutoFilled, setIsAutoFilled] = useState(false)
  const [autoFilledText, setAutoFilledText] = useState('')

  // 本地存储的 key
  const STORAGE_KEY = 'cheersai_conversations'
  const SIDEBAR_STORAGE_KEY = 'cheersai_sidebar_collapsed'

  // 从本地存储加载侧边栏状态
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored) {
        setSidebarCollapsed(JSON.parse(stored))
      }
    } catch (error) {
      // 加载侧边栏状态失败，忽略错误
    }
  }, [])

  // 保存侧边栏状态到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(sidebarCollapsed))
    } catch (error) {
      // 保存侧边栏状态失败，忽略错误
    }
  }, [sidebarCollapsed])

  // 从本地存储加载对话
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // 恢复 Date 对象
        const restored = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setConversations(restored)
      }
    } catch (error) {
      // 加载本地对话失败，忽略错误
    }
  }, [])

  // 保存对话到本地存储
  useEffect(() => {
    if (conversations.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
      } catch (error) {
        // 保存对话到本地存储失败，忽略错误
      }
    }
  }, [conversations])

  // 获取模型列表 - 使用更简单的方法
  const { data: modelListData, isLoading: isModelListLoading } = useModelList(ModelTypeEnum.textGeneration)
  const { data: defaultModelData } = useDefaultModel(ModelTypeEnum.textGeneration)
  
  // 调试信息
  useEffect(() => {
    // 如果没有模型数据，设置Ollama模型作为默认选项
    if (!isModelListLoading && (!modelListData || modelListData.length === 0) && !selectedModel) {
      setSelectedModel({
        provider: 'ollama',
        model: 'qwen2.5:1.5b',
        label: 'Qwen2.5 1.5B (Ollama)',
      })
    }
  }, [modelListData, defaultModelData, isModelListLoading, selectedModel])

  // 初始化选中的模型
  useEffect(() => {
    if (defaultModelData && modelListData && !selectedModel) {
      const defaultProvider = modelListData.find(provider => provider.provider === defaultModelData.provider.provider)
      const defaultModel = defaultProvider?.models.find(model => model.model === defaultModelData.model)
      
      if (defaultProvider && defaultModel) {
        setSelectedModel({
          provider: defaultProvider.provider,
          model: defaultModel.model,
          label: defaultModel.label?.zh_Hans || defaultModel.label?.en_US || defaultModel.model,
        })
      }
    }
  }, [defaultModelData, modelListData, selectedModel])

  // 点击外部关闭模型选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 切换对话时更新消息
  useEffect(() => {
    const conversation = conversations.find(c => c.id === currentConversationId)
    if (conversation) {
      setMessages(conversation.messages)
    }
  }, [currentConversationId, conversations])

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新建对话',
      lastMessage: '',
      timestamp: new Date(),
      messages: [],
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    setMessages([])
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversationId === id) {
      const remainingConversations = conversations.filter(c => c.id !== id)
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id)
      } else {
        setCurrentConversationId(null)
        setMessages([])
      }
    }
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id)
  }

  const handleSelectModel = (provider: string, model: string, label: string) => {
    setSelectedModel({ provider, model, label })
    setShowModelSelector(false)
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 读取文件内容
  const readFileContent = async (file: UploadedFile): Promise<string> => {
    try {
      // 文件内容已在选择时读取
      if (file.content) {
        return file.content
      } else if (file.type.startsWith('text/') || file.type === 'application/json') {
        return `[文件: ${file.name} - 内容未加载]`
      } else {
        return `[文件: ${file.name}, 大小: ${formatFileSize(file.size)}, 类型: ${file.type}]`
      }
    } catch (error) {
      return `[无法读取文件: ${file.name}]`
    }
  }

  // 处理沙箱文件选择
  const handleSandboxFilesSelected = async (selectedFiles: File[]) => {
    const newFiles: UploadedFile[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      // 读取文件内容
      let content = ''
      try {
        // 直接读取File对象的内容，不管文件类型
        content = await file.text()
      } catch (error) {
        content = `[无法读取文件内容: ${file.name}]`
      }

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '', // 沙箱文件不需要URL
        isDesensitized: true,
        content: content,
      })
    }

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  // 处理附件按钮点击
  const handleAttachmentClick = () => {
    setShowSandboxPicker(true)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // 复制AI回复内容
  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // 可以添加一个toast提示
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  // 下载AI回复内容
  const handleDownloadMessage = (content: string, messageId: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-response-${messageId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 重新生成AI回复
  const handleRegenerateMessage = async (messageIndex: number) => {
    if (isLoading) return

    // 获取到指定消息为止的对话历史
    const messagesToRegenerate = messages.slice(0, messageIndex)
    const lastUserMessage = messagesToRegenerate.filter(m => m.type === 'user').pop()
    
    if (!lastUserMessage) return

    // 移除从指定位置开始的所有消息
    const newMessages = messages.slice(0, messageIndex)
    setMessages(newMessages)

    // 更新对话记录
    if (currentConversationId) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: newMessages,
            timestamp: new Date(),
          }
        }
        return conv
      }))
    }

    // 重新发送请求
    setIsLoading(true)

    // 添加新的AI消息占位
    const assistantMessageId = Date.now().toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])
    setStreamingMessageId(assistantMessageId)

    try {
      const modelToUse = selectedModel?.model || 'qwen2.5:1.5b'

      // 构建包含对话历史的完整prompt
      let fullPrompt = ''
      
      // 添加对话历史（最近的10轮对话）
      const recentMessages = newMessages.slice(-20) // 取最近20条消息（10轮对话）
      
      if (recentMessages.length > 0) {
        fullPrompt += '以下是对话历史：\n\n'
        recentMessages.forEach((msg) => {
          if (msg.type === 'user') {
            fullPrompt += `用户: ${msg.content}\n\n`
          } else if (msg.type === 'assistant' && msg.content.trim()) {
            fullPrompt += `助手: ${msg.content}\n\n`
          }
        })
        fullPrompt += '---\n\n'
      }
      
      // 添加当前用户消息
      fullPrompt += `用户: ${lastUserMessage.content}`

      // 添加文件内容（如果有）
      if (lastUserMessage.files && lastUserMessage.files.length > 0) {
        const fileContents = await Promise.all(
          lastUserMessage.files.map(async (file) => {
            const content = await readFileContent(file)
            return `\n\n--- 文件: ${file.name} ---\n${content}\n--- 文件结束 ---`
          })
        )
        fullPrompt += '\n\n以下是用户上传的文件内容：' + fileContents.join('')
      }
      
      fullPrompt += '\n\n助手:'

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          prompt: fullPrompt,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.response) {
                fullResponse += data.response
                
                // 实时更新消息内容
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: fullResponse }
                    : msg
                ))
              }
            } catch (e) {
              // 解析 JSON 失败，忽略该行
            }
          }
        }
      }

      // 流式输出完成，清除流式状态
      setStreamingMessageId(null)

      // 更新对话记录
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              lastMessage: fullResponse.slice(0, 50),
              timestamp: new Date(),
              messages: [...conv.messages, { ...assistantMessage, content: fullResponse }],
            }
          }
          return conv
        }))
      }

    } catch (error) {
      // 清除流式状态
      setStreamingMessageId(null)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `连接Ollama失败: ${error instanceof Error ? error.message : '未知错误'}。请确保Ollama服务正在运行。`,
        timestamp: new Date(),
      }

      // 替换占位消息为错误消息
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? errorMessage : msg
      ))

      // 更新对话记录
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              lastMessage: errorMessage.content.slice(0, 50),
              timestamp: new Date(),
              messages: [...conv.messages, errorMessage],
            }
          }
          return conv
        }))
      }
    } finally {
      setIsLoading(false)
      setStreamingMessageId(null)
    }
  }

  const handleSend = async () => {
      if (!inputValue.trim() || isLoading) return

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue.trim(),
        timestamp: new Date(),
        files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
      }

      let conversationId = currentConversationId

      // 如果没有当前对话，创建一个新对话
      if (!conversationId) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: userMessage.content.slice(0, 20),
          lastMessage: userMessage.content,
          timestamp: new Date(),
          messages: [userMessage],
        }
        conversationId = newConversation.id
        setConversations(prev => [newConversation, ...prev])
        setCurrentConversationId(conversationId)
        setMessages([userMessage])
      } else {
        // 更新现有对话
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)

        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            const title = conv.messages.length === 0 ? userMessage.content.slice(0, 20) : conv.title
            return {
              ...conv,
              title,
              lastMessage: userMessage.content,
              timestamp: new Date(),
              messages: updatedMessages,
            }
          }
          return conv
        }))
      }

      setInputValue('')
      setUploadedFiles([]) // 清空已上传的文件
      setIsAutoFilled(false) // 清除自动填充标记
      setAutoFilledText('') // 清除自动填充文字
      setIsLoading(true)

      // 先添加一个空的 AI 消息占位
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessageId(assistantMessageId)

      try {
        const modelToUse = selectedModel?.model || 'qwen2.5:1.5b'

        // 构建包含对话历史的完整prompt
        let fullPrompt = ''
        
        // 添加对话历史（最近的10轮对话）
        const currentMessages = messages.length > 0 ? messages : []
        const recentMessages = currentMessages.slice(-20) // 取最近20条消息（10轮对话）
        
        if (recentMessages.length > 0) {
          fullPrompt += '以下是对话历史：\n\n'
          recentMessages.forEach((msg) => {
            if (msg.type === 'user') {
              fullPrompt += `用户: ${msg.content}\n\n`
            } else if (msg.type === 'assistant' && msg.content.trim()) {
              fullPrompt += `助手: ${msg.content}\n\n`
            }
          })
          fullPrompt += '---\n\n'
        }
        
        // 添加当前用户消息
        fullPrompt += `用户: ${userMessage.content}`

        if (uploadedFiles.length > 0) {
          const fileContents = await Promise.all(
            uploadedFiles.map(async (file) => {
              const content = await readFileContent(file)
              return `\n\n--- 文件: ${file.name} ---\n${content}\n--- 文件结束 ---`
            })
          )

          fullPrompt += '\n\n以下是用户上传的文件内容：' + fileContents.join('')
        }
        
        fullPrompt += '\n\n助手:'

        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelToUse,
            prompt: fullPrompt,
            stream: true,  // 启用流式输出
          }),
        })

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              try {
                const data = JSON.parse(line)
                if (data.response) {
                  fullResponse += data.response
                  
                  // 调试信息
                  console.log('收到流式数据:', data.response.length, '字符')
                  console.log('当前总长度:', fullResponse.length)
                  
                  // 实时更新消息内容 - 使用更高效的方式
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: fullResponse }
                      : msg
                  ))
                }
              } catch (e) {
                // 解析 JSON 失败，忽略该行
              }
            }
          }
        }

        // 流式输出完成，清除流式状态
        setStreamingMessageId(null)

        // 更新对话记录 - 只添加 assistantMessage
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: fullResponse.slice(0, 50),
              timestamp: new Date(),
              messages: [...conv.messages, { ...assistantMessage, content: fullResponse }],
            }
          }
          return conv
        }))

      } catch (error) {
        // 清除流式状态
        setStreamingMessageId(null)
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `连接Ollama失败: ${error instanceof Error ? error.message : '未知错误'}。请确保Ollama服务正在运行。`,
          timestamp: new Date(),
        }

        // 替换占位消息为错误消息
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? errorMessage : msg
        ))

        // 更新对话记录 - 只添加 errorMessage
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: errorMessage.content.slice(0, 50),
              timestamp: new Date(),
              messages: [...conv.messages, errorMessage],
            }
          }
          return conv
        }))
      } finally {
        setIsLoading(false)
        setStreamingMessageId(null)
      }
    }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // 如果是自动填充状态，检查用户是否在自动填充文字后面添加内容
    if (isAutoFilled && autoFilledText) {
      // 如果新输入的内容以自动填充文字开头，保持自动填充状态
      if (newValue.startsWith(autoFilledText)) {
        setInputValue(newValue)
      } else {
        // 如果用户修改了自动填充的部分，清除自动填充状态
        setIsAutoFilled(false)
        setAutoFilledText('')
        setInputValue(newValue)
      }
    } else {
      setInputValue(newValue)
    }
    
    // 自动调整高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex h-full bg-white">
      {/* 侧边栏 - 历史对话 */}
      <div className={cn(
        "flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
      )}>
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
            <span className="text-gray-900 font-medium">CheersAI行业版</span>
          </div>
          <button
            onClick={handleNewConversation}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="新建对话"
          >
            <RiAddLine className="h-4 w-4" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索对话..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              暂无对话记录
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={cn(
                  'group relative cursor-pointer px-4 py-3 transition-colors hover:bg-white',
                  currentConversationId === conversation.id && 'bg-white border-r-2 border-blue-500'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-sm font-medium text-gray-900 mb-1">
                      {conversation.title}
                    </h3>
                    <p className="truncate text-xs text-gray-500 mb-1">
                      {conversation.lastMessage || '暂无消息'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimestamp(conversation.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteConversation(conversation.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                    title="删除对话"
                  >
                    <RiDeleteBinLine className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="flex flex-1 flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* 折叠按钮 */}
            <button
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title={sidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
            >
              {sidebarCollapsed ? (
                <RiMenuLine className="h-4 w-4" />
              ) : (
                <RiCloseLine className="h-4 w-4" />
              )}
            </button>
            <h1 className="text-lg font-medium text-gray-900">
              {currentConversationId 
                ? conversations.find(c => c.id === currentConversationId)?.title || 'Python数据分析脚本'
                : 'Python数据分析脚本'
              }
            </h1>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              草稿
            </span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              自动
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* 模型选择器 */}
            <div className="relative" ref={modelSelectorRef}>
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedModel?.label || '选择模型'}
                </span>
                <RiArrowDownSLine className={cn(
                  "h-4 w-4 text-gray-500 transition-transform",
                  showModelSelector && "rotate-180"
                )} />
              </button>
              
              {showModelSelector && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">选择模型</h3>
                  </div>
                  <div className="py-2">
                    {isModelListLoading ? (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        加载模型中...
                      </div>
                    ) : !modelListData || modelListData.length === 0 ? (
                      <div className="px-3 py-4">
                        <div className="text-gray-500 text-sm mb-3">
                          使用本地Ollama模型
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => handleSelectModel('ollama', 'qwen2.5:1.5b', 'Qwen2.5 1.5B (Ollama)')}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors rounded",
                              selectedModel?.model === 'qwen2.5:1.5b' && "bg-blue-50 text-blue-700"
                            )}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">Qwen2.5 1.5B</span>
                              <span className="text-xs text-gray-500">本地Ollama模型 - 轻量级</span>
                            </div>
                            {selectedModel?.model === 'qwen2.5:1.5b' && (
                              <RiCheckLine className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSelectModel('ollama', 'qwen3-coder:30b', 'Qwen3 Coder 30B (Ollama)')}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors rounded",
                              selectedModel?.model === 'qwen3-coder:30b' && "bg-blue-50 text-blue-700"
                            )}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">Qwen3 Coder 30B</span>
                              <span className="text-xs text-gray-500">本地Ollama模型 - 代码专用</span>
                            </div>
                            {selectedModel?.model === 'qwen3-coder:30b' && (
                              <RiCheckLine className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-400 mb-2">
                            想要更多模型？
                          </div>
                          <button
                            onClick={() => {
                              window.open('/account/model-provider', '_blank')
                            }}
                            className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            配置更多提供商
                          </button>
                        </div>
                      </div>
                    ) : (
                      modelListData.map((provider) => {
                        const activeModels = provider.models?.filter(model => model.status === 'active') || []
                        
                        if (activeModels.length === 0) return null
                        
                        return (
                          <div key={provider.provider} className="mb-2">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {provider.label?.zh_Hans || provider.label?.en_US || provider.provider}
                            </div>
                            {activeModels.map((model) => {
                              const isSelected = selectedModel?.provider === provider.provider && selectedModel?.model === model.model
                              const modelLabel = model.label?.zh_Hans || model.label?.en_US || model.model
                              
                              return (
                                <button
                                  key={`${provider.provider}-${model.model}`}
                                  onClick={() => handleSelectModel(provider.provider, model.model, modelLabel)}
                                  className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors",
                                    isSelected && "bg-blue-50 text-blue-700"
                                  )}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{modelLabel}</span>
                                    <span className="text-xs text-gray-500">{model.model}</span>
                                  </div>
                                  {isSelected && (
                                    <RiCheckLine className="h-4 w-4 text-blue-600" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <RiMoreLine className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            {messages.length === 0 && !currentConversationId ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                    <span className="text-xl font-bold text-white">AI</span>
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-gray-900">
                    欢迎使用 CheersAI Desktop
                  </h3>
                  <p className="text-gray-500 mb-6">
                    我是您的AI助手，可以帮助您进行数据分析、编程和各种问题解答
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                      onClick={() => {
                        const text = '请帮我进行数据分析'
                        setInputValue(text)
                        setIsAutoFilled(true)
                        setAutoFilledText(text)
                      }}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      数据分析
                    </button>
                    <button 
                      onClick={() => {
                        const text = '请帮我编写代码'
                        setInputValue(text)
                        setIsAutoFilled(true)
                        setAutoFilledText(text)
                      }}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      代码编写
                    </button>
                    <button 
                      onClick={() => {
                        const text = '我有问题需要解答'
                        setInputValue(text)
                        setIsAutoFilled(true)
                        setAutoFilledText(text)
                      }}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      问题解答
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-4 mb-6',
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                        <span className="text-sm font-medium text-white">AI</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        'group max-w-[70%] rounded-2xl px-4 py-3',
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 border border-gray-300 text-gray-900'
                      )}
                    >
                      {/* 文件显示 */}
                      {message.files && message.files.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {message.files.map((file) => (
                            <div key={file.id} className={cn(
                              "flex items-center gap-2 p-2 rounded border",
                              message.type === 'user' 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white border-gray-200'
                            )}>
                              <div className={cn(
                                "w-6 h-6 rounded flex items-center justify-center text-xs font-medium",
                                message.type === 'user' 
                                  ? 'bg-blue-400 text-white' 
                                  : 'bg-blue-100 text-blue-600'
                              )}>
                                {file.name.split('.').pop()?.toUpperCase().slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={cn(
                                  "text-xs font-medium truncate",
                                  message.type === 'user' ? 'text-gray-800' : 'text-gray-900'
                                )}>
                                  {file.name}
                                </div>
                                <div className={cn(
                                  "text-xs",
                                  message.type === 'user' ? 'text-gray-600' : 'text-gray-500'
                                )}>
                                  {formatFileSize(file.size)}
                                  {file.isDesensitized && (
                                    <span className="ml-1">• 已脱敏</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 消息内容 */}
                      <div className="text-sm leading-relaxed">
                        {message.type === 'assistant' ? (
                          // 如果是正在流式输出的消息，使用纯文本以提高性能
                          // 如果是完成的消息，使用Markdown渲染
                          message.id === streamingMessageId ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          ) : (
                            <Markdown content={message.content} />
                          )
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div
                          className={cn(
                            'text-xs',
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-600'
                          )}
                        >
                          {message.timestamp.toLocaleTimeString('zh-CN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        
                        {/* AI消息操作按钮 */}
                        {message.type === 'assistant' && message.content && !isLoading && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopyMessage(message.content)}
                              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                              title="复制"
                            >
                              <RiFileCopyLine className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDownloadMessage(message.content, message.id)}
                              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                              title="下载"
                            >
                              <RiDownloadLine className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const messageIndex = messages.findIndex(m => m.id === message.id)
                                if (messageIndex > 0) {
                                  handleRegenerateMessage(messageIndex)
                                }
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                              title="重新生成"
                            >
                              <RiRefreshLine className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
                        <span className="text-sm font-medium text-white">我</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start mb-6">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <span className="text-sm font-medium text-white">AI</span>
                    </div>
                    <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-gray-100 border border-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        </div>
                        <span className="text-sm text-gray-700">正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">已选择文件 ({uploadedFiles.length})</div>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                              沙箱文件
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="移除文件"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 警告提示 */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">安全模式：</span>仅可选择沙箱内的脱敏文件。系统将自动记录并脱敏输入内容中的个人身份信息。
              </p>
            </div>
            
            <div className="relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              {/* 文件选择按钮 */}
              <button 
                onClick={handleAttachmentClick}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="从沙箱选择文件"
              >
                <RiAttachmentLine className="h-4 w-4" />
              </button>
              
              {/* 输入框容器 */}
              <div className="relative flex-1 min-h-[32px] flex items-center">
                {/* 自动填充文字的背景层 */}
                {isAutoFilled && autoFilledText && (
                  <div className="absolute inset-0 pointer-events-none flex items-center z-10">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-200 text-sm">
                      {autoFilledText}
                    </span>
                    {inputValue.length > autoFilledText.length && (
                      <span className="ml-1 text-gray-900 text-sm">
                        {inputValue.slice(autoFilledText.length)}
                      </span>
                    )}
                  </div>
                )}
                
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息，Ctrl+Enter 换行"
                  className={cn(
                    "w-full resize-none border-0 bg-transparent text-sm placeholder-gray-400 focus:outline-none leading-6 py-1",
                    isAutoFilled ? "text-transparent" : "text-gray-900"
                  )}
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <RiMicLine className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    inputValue.trim() && !isLoading
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  发送回复
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 沙箱文件选择器 */}
        <SandboxFilePicker
          open={showSandboxPicker}
          onClose={() => setShowSandboxPicker(false)}
          onSelect={handleSandboxFilesSelected}
          accept=".txt,.md,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.csv,.json"
          multiple={true}
        />
      </div>
    </div>
  )
}

export default ChatPage