/**
 * 操作日志记录器
 * Operation Logger
 *
 * 记录数据脱敏操作的日志，确保不包含敏感数据
 */

import type { MaskingLog } from './types'
import { v4 as uuidv4 } from 'uuid'
import { addRecord, getAllRecords, getIndexedDB, STORES } from './indexeddb'

/**
 * 日志记录器类
 */
export class Logger {
  private db: IDBDatabase | null = null

  /**
   * 初始化日志记录器
   */
  async initialize(): Promise<void> {
    this.db = await getIndexedDB()
  }

  /**
   * 记录操作日志
   * @param operation - 操作类型
   * @param fileName - 文件名
   * @param status - 操作状态
   * @param message - 日志消息
   * @param mappingId - 映射ID（可选）
   * @param details - 详细信息（可选，会被清理敏感数据）
   */
  async log(
    operation: 'mask' | 'upload' | 'substitute' | 'delete',
    fileName: string,
    status: 'success' | 'failure' | 'partial',
    message: string,
    mappingId?: string,
    details?: unknown,
  ): Promise<void> {
    if (!this.db) {
      console.warn('Logger not initialized, skipping log')
      return
    }

    // 清理详细信息中的敏感数据
    const sanitizedDetails = this.sanitizeDetails(details)

    const log: MaskingLog = {
      id: uuidv4(),
      operation,
      fileName,
      mappingId,
      status,
      message,
      timestamp: new Date(),
      details: sanitizedDetails,
    }

    try {
      await addRecord(this.db, STORES.MASKING_LOGS, {
        id: log.id,
        operation: log.operation,
        file_name: log.fileName,
        mapping_id: log.mappingId ?? null,
        status: log.status,
        message: log.message,
        timestamp: log.timestamp.toISOString(),
        details: sanitizedDetails ? JSON.stringify(sanitizedDetails) : null,
      })
    }
    catch (error) {
      console.error('Failed to write log:', error)
    }
  }

  /**
   * 记录成功操作
   */
  async logSuccess(
    operation: 'mask' | 'upload' | 'substitute' | 'delete',
    fileName: string,
    message: string,
    mappingId?: string,
    details?: unknown,
  ): Promise<void> {
    await this.log(operation, fileName, 'success', message, mappingId, details)
  }

  /**
   * 记录失败操作
   */
  async logFailure(
    operation: 'mask' | 'upload' | 'substitute' | 'delete',
    fileName: string,
    message: string,
    error?: Error,
    mappingId?: string,
  ): Promise<void> {
    const details = error
      ? {
          errorName: error.name,
          errorMessage: error.message,
          // 不包含堆栈跟踪，因为可能包含敏感路径
        }
      : undefined

    await this.log(operation, fileName, 'failure', message, mappingId, details)
  }

  /**
   * 记录部分成功操作
   */
  async logPartial(
    operation: 'mask' | 'upload' | 'substitute' | 'delete',
    fileName: string,
    message: string,
    mappingId?: string,
    details?: unknown,
  ): Promise<void> {
    await this.log(operation, fileName, 'partial', message, mappingId, details)
  }

  /**
   * 获取所有日志
   * @param limit - 限制返回的日志数量
   * @returns 日志列表
   */
  async getLogs(limit?: number): Promise<MaskingLog[]> {
    if (!this.db) {
      throw new Error('Logger not initialized')
    }

    try {
      const records = await getAllRecords<Record<string, unknown>>(this.db, STORES.MASKING_LOGS)

      const logs: MaskingLog[] = records.map(record => ({
        id: String(record.id),
        operation: String(record.operation) as MaskingLog['operation'],
        fileName: String(record.file_name),
        mappingId: record.mapping_id ? String(record.mapping_id) : undefined,
        status: String(record.status) as MaskingLog['status'],
        message: String(record.message),
        timestamp: new Date(String(record.timestamp)),
        details: record.details ? JSON.parse(String(record.details)) : undefined,
      }))

      // 按时间戳降序排序
      logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      // 如果指定了限制，只返回前 N 条
      if (limit && limit > 0) {
        return logs.slice(0, limit)
      }

      return logs
    }
    catch (error) {
      console.error('Failed to get logs:', error)
      return []
    }
  }

  /**
   * 获取特定文件的日志
   * @param fileName - 文件名
   * @returns 日志列表
   */
  async getLogsByFile(fileName: string): Promise<MaskingLog[]> {
    const allLogs = await this.getLogs()
    return allLogs.filter(log => log.fileName === fileName)
  }

  /**
   * 获取特定操作类型的日志
   * @param operation - 操作类型
   * @returns 日志列表
   */
  async getLogsByOperation(
    operation: 'mask' | 'upload' | 'substitute' | 'delete',
  ): Promise<MaskingLog[]> {
    const allLogs = await this.getLogs()
    return allLogs.filter(log => log.operation === operation)
  }

  /**
   * 清理旧日志
   * @param daysToKeep - 保留的天数
   * @returns 删除的日志数量
   */
  async cleanOldLogs(daysToKeep: number = 30): Promise<number> {
    if (!this.db) {
      throw new Error('Logger not initialized')
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const allLogs = await this.getLogs()
    const logsToDelete = allLogs.filter(log => log.timestamp < cutoffDate)

    // 删除旧日志
    const transaction = this.db.transaction([STORES.MASKING_LOGS], 'readwrite')
    const store = transaction.objectStore(STORES.MASKING_LOGS)

    for (const log of logsToDelete) {
      store.delete(log.id)
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(logsToDelete.length)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  /**
   * 关闭日志记录器
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 清理详细信息中的敏感数据
   * @param details - 原始详细信息
   * @returns 清理后的详细信息
   */
  private sanitizeDetails(details: unknown): unknown {
    if (!details) {
      return null
    }

    // 如果是字符串，检查是否包含敏感模式
    if (typeof details === 'string') {
      return this.sanitizeString(details)
    }

    // 如果是对象，递归清理
    if (typeof details === 'object' && details !== null) {
      const sanitized: unknown[] | Record<string, unknown> = Array.isArray(details) ? [] : {}

      for (const key in details as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(details, key)) {
          // 跳过可能包含敏感数据的字段
          if (this.isSensitiveField(key)) {
            if (Array.isArray(sanitized))
              sanitized.push('[REDACTED]')
            else
              sanitized[key] = '[REDACTED]'
          }
          else {
            const child = this.sanitizeDetails((details as Record<string, unknown>)[key])
            if (Array.isArray(sanitized))
              sanitized.push(child)
            else
              sanitized[key] = child
          }
        }
      }

      return sanitized
    }

    return details
  }

  /**
   * 清理字符串中的敏感数据
   * @param str - 原始字符串
   * @returns 清理后的字符串
   */
  private sanitizeString(str: string): string {
    // 移除可能的敏感模式
    const patterns = [
      // 电子邮件
      /[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
      // 电话号码
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      // 信用卡号
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      // 身份证号
      /\b\d{17}[\dX]\b/gi,
    ]

    let sanitized = str
    for (const pattern of patterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    }

    return sanitized
  }

  /**
   * 检查字段名是否可能包含敏感数据
   * @param fieldName - 字段名
   * @returns 是否敏感
   */
  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'credential',
      'originalValue',
      'original',
      'content',
      'data',
      'value',
    ]

    const lowerFieldName = fieldName.toLowerCase()
    return sensitiveFields.some(field => lowerFieldName.includes(field))
  }
}
