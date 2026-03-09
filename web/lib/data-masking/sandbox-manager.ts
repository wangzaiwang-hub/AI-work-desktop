/**
 * 沙箱管理器
 * Sandbox Manager
 * 
 * 管理本地隔离目录，存储脱敏文件和元数据
 */

import type { ConfigResult, FileInfo, SandboxConfig } from './types'
import { SandboxError } from './types'
import { getIndexedDB, STORES, getRecord, updateRecord } from './indexeddb'

/**
 * 沙箱管理器类
 */
export class SandboxManager {
  private db: IDBDatabase | null = null
  private sandboxPath: string | null = null

  /**
   * 初始化沙箱管理器
   */
  async initialize(): Promise<void> {
    this.db = await getIndexedDB()
    
    // 加载沙箱配置
    const config = await this.loadConfig()
    if (config) {
      this.sandboxPath = config.path
    }
  }

  /**
   * 配置沙箱路径
   * @param path - 沙箱目录路径
   * @returns 配置结果
   */
  async configureSandbox(path: string): Promise<ConfigResult> {
    if (!this.db) {
      throw new SandboxError('Sandbox manager not initialized', 'NOT_INITIALIZED')
    }

    // 验证路径
    const validation = await this.validatePathForConfig(path)
    if (!validation.valid) {
      return {
        success: false,
        sandboxPath: '',
        error: validation.error,
      }
    }

    // 保存配置
    const config: SandboxConfig = {
      path,
      createdAt: new Date(),
      lastModified: new Date(),
      autoCleanup: false,
    }

    try {
      await updateRecord(this.db, STORES.SANDBOX_CONFIG, {
        id: 1,
        path: config.path,
        created_at: config.createdAt.toISOString(),
        last_modified: config.lastModified.toISOString(),
        max_size: config.maxSize ?? null,
        auto_cleanup: config.autoCleanup ? 1 : 0,
        cleanup_days: config.cleanupDays ?? null,
      })

      this.sandboxPath = path

      return {
        success: true,
        sandboxPath: path,
      }
    }
    catch (error) {
      throw new SandboxError(
        'Failed to save sandbox configuration',
        'CONFIG_SAVE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 验证路径是否在沙箱内
   * @param filePath - 要验证的文件路径
   * @returns 验证结果
   */
  validatePath(filePath: string): boolean {
    if (!this.sandboxPath) {
      return false
    }

    // 规范化路径（移除 ./ ../ 等）
    const normalizedSandbox = this.normalizePath(this.sandboxPath)
    const normalizedFile = this.normalizePath(filePath)

    // 检查是否包含路径遍历
    if (normalizedFile.includes('..')) {
      return false
    }

    // 检查文件路径是否以沙箱路径开头
    return normalizedFile.startsWith(normalizedSandbox)
  }

  /**
   * 获取当前沙箱路径
   * @returns 沙箱路径，如果未配置则返回 null
   */
  getSandboxPath(): string | null {
    return this.sandboxPath
  }

  /**
   * 在沙箱内保存文件
   * @param fileName - 文件名
   * @param content - 文件内容
   * @returns 保存的文件路径
   */
  async saveFile(fileName: string, content: string): Promise<string> {
    if (!this.sandboxPath) {
      throw new SandboxError('Sandbox not configured', 'SANDBOX_NOT_CONFIGURED')
    }

    // 规范化文件名（移除首尾空格）
    const normalizedFileName = fileName.trim()
    
    // 检查空文件名或只有扩展名的文件名
    if (!normalizedFileName || normalizedFileName === '.txt' || normalizedFileName === '.') {
      throw new SandboxError('Invalid file name', 'INVALID_FILE_NAME')
    }
    
    // 检查隐藏文件（以单个点开头，但不是 .. 路径遍历）
    // 注意：trim() 后以点开头意味着原始文件名可能是 " .txt" 这样的无效名称
    if (normalizedFileName.startsWith('.') && !normalizedFileName.startsWith('..')) {
      throw new SandboxError('Invalid file name', 'INVALID_FILE_NAME')
    }

    // 构建完整路径并规范化
    const filePath = this.normalizePath(this.joinPath(this.sandboxPath, normalizedFileName))

    // 验证路径在沙箱内
    if (!this.validatePath(filePath)) {
      throw new SandboxError(
        'Path is outside sandbox',
        'PATH_OUTSIDE_SANDBOX',
        { filePath, sandboxPath: this.sandboxPath },
      )
    }

    // 在浏览器环境中，我们使用 localStorage 模拟文件系统
    // 在实际的 Electron/Tauri 环境中，这里会使用真实的文件系统 API
    if (typeof localStorage !== 'undefined') {
      const fileKey = `sandbox_file:${filePath}`
      localStorage.setItem(fileKey, content)
      
      // 保存文件元数据
      const metaKey = `sandbox_meta:${filePath}`
      const metadata = {
        name: normalizedFileName,
        path: filePath,
        size: content.length,
        createdAt: new Date().toISOString(),
        isMasked: true,
      }
      localStorage.setItem(metaKey, JSON.stringify(metadata))
    }

    return filePath
  }

  /**
   * 从沙箱读取文件
   * @param filePath - 文件路径
   * @returns 文件内容
   */
  async readFile(filePath: string): Promise<string> {
    if (!this.sandboxPath) {
      throw new SandboxError('Sandbox not configured', 'SANDBOX_NOT_CONFIGURED')
    }

    // 验证路径在沙箱内
    if (!this.validatePath(filePath)) {
      throw new SandboxError(
        'Path is outside sandbox',
        'PATH_OUTSIDE_SANDBOX',
        { filePath, sandboxPath: this.sandboxPath },
      )
    }

    // 在浏览器环境中，从 localStorage 读取
    if (typeof localStorage !== 'undefined') {
      const fileKey = `sandbox_file:${filePath}`
      const content = localStorage.getItem(fileKey)
      
      if (content === null) {
        throw new SandboxError(
          'File not found',
          'FILE_NOT_FOUND',
          { filePath },
        )
      }
      
      return content
    }

    throw new SandboxError('File system not available', 'FS_NOT_AVAILABLE')
  }

  /**
   * 列出沙箱内的文件
   * @returns 文件列表
   */
  async listFiles(): Promise<FileInfo[]> {
    if (!this.sandboxPath) {
      throw new SandboxError('Sandbox not configured', 'SANDBOX_NOT_CONFIGURED')
    }

    const files: FileInfo[] = []

    // 在浏览器环境中，从 localStorage 读取
    if (typeof localStorage !== 'undefined') {
      const normalizedSandbox = this.normalizePath(this.sandboxPath)
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sandbox_meta:')) {
          const metaStr = localStorage.getItem(key)
          if (metaStr) {
            try {
              const meta = JSON.parse(metaStr)
              // Check if file belongs to current sandbox
              const normalizedMetaPath = this.normalizePath(meta.path || '')
              if (normalizedMetaPath && normalizedMetaPath.startsWith(normalizedSandbox)) {
                files.push({
                  name: meta.name,
                  path: meta.path,
                  size: meta.size,
                  createdAt: new Date(meta.createdAt),
                  isMasked: meta.isMasked,
                })
              }
            }
            catch (error) {
              // 忽略解析错误
            }
          }
        }
      }
    }

    return files
  }

  /**
   * 删除沙箱内的文件
   * @param filePath - 文件路径
   */
  async deleteFile(filePath: string): Promise<void> {
    if (!this.sandboxPath) {
      throw new SandboxError('Sandbox not configured', 'SANDBOX_NOT_CONFIGURED')
    }

    // 验证路径在沙箱内
    if (!this.validatePath(filePath)) {
      throw new SandboxError(
        'Path is outside sandbox',
        'PATH_OUTSIDE_SANDBOX',
        { filePath, sandboxPath: this.sandboxPath },
      )
    }

    // 在浏览器环境中，从 localStorage 删除
    if (typeof localStorage !== 'undefined') {
      const fileKey = `sandbox_file:${filePath}`
      const metaKey = `sandbox_meta:${filePath}`
      
      localStorage.removeItem(fileKey)
      localStorage.removeItem(metaKey)
    }
  }

  /**
   * 关闭沙箱管理器
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 加载沙箱配置
   */
  private async loadConfig(): Promise<SandboxConfig | null> {
    if (!this.db) {
      return null
    }

    try {
      const record = await getRecord<any>(this.db, STORES.SANDBOX_CONFIG, 1)
      
      if (!record) {
        return null
      }

      return {
        path: record.path,
        createdAt: new Date(record.created_at),
        lastModified: new Date(record.last_modified),
        maxSize: record.max_size ?? undefined,
        autoCleanup: record.auto_cleanup === 1,
        cleanupDays: record.cleanup_days ?? undefined,
      }
    }
    catch (error) {
      return null
    }
  }

  /**
   * 验证路径用于配置（更严格的验证）
   */
  private async validatePathForConfig(path: string): Promise<{ valid: boolean; error?: string }> {
    if (!path || path.trim() === '') {
      return { valid: false, error: '路径不能为空' }
    }

    // Must be absolute path
    const trimmed = path.trim()
    const isAbsolute = /^[A-Za-z]:[\\/]/.test(trimmed) || trimmed.startsWith('/') || trimmed.startsWith('\\\\')
    if (!isAbsolute) {
      return { valid: false, error: '请输入完整的绝对路径，例如 C:\\Users\\用户名\\Documents\\masked-files' }
    }

    if (trimmed.includes('..') || trimmed.includes('~')) {
      return { valid: false, error: '路径包含无效字符' }
    }

    const protectedPaths = [
      '/System',
      'C:\\Windows',
      'C:\\Program Files',
      '/usr',
      '/bin',
      '/sbin',
      '/etc',
    ]

    const normalizedPath = this.normalizePath(trimmed)
    for (const protectedPath of protectedPaths) {
      const normalizedProtected = this.normalizePath(protectedPath)
      if (normalizedPath.startsWith(normalizedProtected)) {
        return { valid: false, error: '不能使用系统保护目录作为沙箱' }
      }
    }

    return { valid: true }
  }

  /**
   * 规范化路径
   */
  private normalizePath(path: string): string {
    // 去除首尾空格
    let normalized = path.trim()
    
    // 移除末尾的斜杠
    normalized = normalized.replace(/[\/\\]+$/, '')
    
    // 统一使用正斜杠
    normalized = normalized.replace(/\\/g, '/')
    
    // 移除重复的斜杠
    normalized = normalized.replace(/\/+/g, '/')
    
    return normalized
  }

  /**
   * 连接路径
   */
  private joinPath(...parts: string[]): string {
    // 如果第一个部分是绝对路径，保留它
    const isAbsolute = parts[0] && (parts[0].startsWith('/') || /^[A-Za-z]:/.test(parts[0]))
    
    const joined = parts
      .map((part, index) => {
        // 对于第一个绝对路径，只移除末尾的斜杠
        if (index === 0 && isAbsolute) {
          return part.replace(/[\/\\]+$/g, '')
        }
        // 对于其他部分，移除首尾的斜杠
        return part.replace(/^[\/\\]+|[\/\\]+$/g, '')
      })
      .filter(part => part.length > 0)
      .join('/')
    
    return joined
  }
}
