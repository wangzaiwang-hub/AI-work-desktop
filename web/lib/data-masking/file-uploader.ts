/**
 * 文件上传器
 * File Uploader
 *
 * 负责将脱敏文件上传到 Dify 后端
 */

import type { SandboxManager } from './sandbox-manager'
import type { UploadProgressCallback, UploadResult } from './types'
import { UploadError } from './types'

/**
 * 文件上传器类
 */
export class FileUploader {
  private sandboxManager: SandboxManager
  private apiBaseUrl: string
  private maxRetries: number

  constructor(
    sandboxManager: SandboxManager,
    apiBaseUrl: string = '/api',
    maxRetries: number = 3,
  ) {
    this.sandboxManager = sandboxManager
    this.apiBaseUrl = apiBaseUrl
    this.maxRetries = maxRetries
  }

  /**
   * 上传文件到 Dify 后端
   * @param filePath - 文件路径
   * @param mappingId - 关联的映射ID
   * @param onProgress - 进度回调
   * @returns 上传结果
   */
  async uploadFile(
    filePath: string,
    mappingId: string,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadResult> {
    // 验证文件在沙箱内
    if (!this.sandboxManager.validatePath(filePath)) {
      throw new UploadError(
        'File is outside sandbox',
        'INVALID_PATH',
        { filePath },
      )
    }

    // 读取文件内容
    let fileContent: string
    try {
      fileContent = await this.sandboxManager.readFile(filePath)
    }
    catch (error) {
      throw new UploadError(
        'Failed to read file',
        'READ_FAILED',
        { filePath, originalError: error },
      )
    }

    // 使用重试机制上传文件
    return await this.uploadWithRetry(filePath, fileContent, mappingId, onProgress)
  }

  // ==================== 私有方法 ====================

  /**
   * 使用重试机制上传文件
   */
  private async uploadWithRetry(
    filePath: string,
    fileContent: string,
    mappingId: string,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadResult> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // 尝试上传
        const result = await this.performUpload(
          filePath,
          fileContent,
          mappingId,
          onProgress,
        )
        return result
      }
      catch (error) {
        lastError = error as Error

        // 如果不是最后一次尝试，等待后重试
        if (attempt < this.maxRetries - 1) {
          // 指数退避：2^attempt * 1000ms
          const delay = 2 ** attempt * 1000
          await this.sleep(delay)
        }
      }
    }

    // 所有重试都失败
    throw new UploadError(
      `File upload failed after ${this.maxRetries} attempts`,
      'UPLOAD_FAILED',
      { filePath, originalError: lastError },
    )
  }

  /**
   * 执行实际的上传操作
   */
  private async performUpload(
    filePath: string,
    fileContent: string,
    mappingId: string,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadResult> {
    // 创建 FormData
    const formData = new FormData()

    // 从文件路径提取文件名
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'file.txt'

    // 创建 Blob 对象
    const blob = new Blob([fileContent], { type: 'text/plain' })
    formData.append('file', blob, fileName)
    formData.append('mappingId', mappingId)

    // 获取沙箱路径并添加到请求头
    const sandboxPath = this.sandboxManager.getSandboxPath()
    if (!sandboxPath) {
      throw new UploadError(
        'Sandbox path is not configured',
        'SANDBOX_NOT_CONFIGURED',
      )
    }

    try {
      // 使用 XMLHttpRequest 以支持进度跟踪
      const result = await this.uploadWithProgress(
        formData,
        sandboxPath,
        onProgress,
      )

      return result
    }
    catch (error) {
      throw new UploadError(
        'Upload request failed',
        'REQUEST_FAILED',
        { filePath, originalError: error },
      )
    }
  }

  /**
   * 使用 XMLHttpRequest 上传并跟踪进度
   */
  private uploadWithProgress(
    formData: FormData,
    sandboxPath: string,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // 设置进度监听器
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      // 设置完成监听器
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve({
              success: true,
              fileId: response.fileId || response.id || '',
            })
          }
          catch {
            reject(new Error('Invalid response format'))
          }
        }
        else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      // 设置错误监听器
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      // 设置超时监听器
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'))
      })

      // 打开连接
      xhr.open('POST', `${this.apiBaseUrl}/files/upload`)

      // 设置请求头
      xhr.setRequestHeader('X-Sandbox-Path', sandboxPath)

      // 设置超时（30秒）
      xhr.timeout = 30000

      // 发送请求
      xhr.send(formData)
    })
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
