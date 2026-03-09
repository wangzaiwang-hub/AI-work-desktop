/**
 * 事务管理器
 * Transaction Manager
 * 
 * 管理数据脱敏操作的事务，支持回滚
 */

import type { SandboxManager } from './sandbox-manager'
import type { MappingStore } from './mapping-store'
import { Logger } from './logger'
import { MaskingError } from './types'

/**
 * 操作记录接口
 */
interface Operation {
  type: 'file_save' | 'mapping_store' | 'file_delete' | 'mapping_delete'
  data: any
  rollback: () => Promise<void>
}

/**
 * 事务管理器类
 */
export class TransactionManager {
  private operations: Operation[] = []
  private sandboxManager: SandboxManager
  private mappingStore: MappingStore
  private logger: Logger
  private isCommitted = false
  private isRolledBack = false

  constructor(
    sandboxManager: SandboxManager,
    mappingStore: MappingStore,
    logger: Logger,
  ) {
    this.sandboxManager = sandboxManager
    this.mappingStore = mappingStore
    this.logger = logger
  }

  /**
   * 保存文件（可回滚）
   * @param fileName - 文件名
   * @param content - 文件内容
   * @returns 文件路径
   */
  async saveFile(fileName: string, content: string): Promise<string> {
    this.ensureNotFinalized()

    const filePath = await this.sandboxManager.saveFile(fileName, content)

    // 记录操作以便回滚
    this.operations.push({
      type: 'file_save',
      data: { filePath },
      rollback: async () => {
        try {
          await this.sandboxManager.deleteFile(filePath)
          await this.logger.log(
            'delete',
            fileName,
            'success',
            'Rolled back file save',
          )
        }
        catch (error) {
          console.error('Failed to rollback file save:', error)
        }
      },
    })

    return filePath
  }

  /**
   * 存储映射（可回滚）
   * @param mappingData - 映射数据
   * @returns 映射ID
   */
  async storeMapping(mappingData: any): Promise<string> {
    this.ensureNotFinalized()

    const mappingId = await this.mappingStore.storeMapping(mappingData)

    // 记录操作以便回滚
    this.operations.push({
      type: 'mapping_store',
      data: { mappingId },
      rollback: async () => {
        try {
          await this.mappingStore.deleteMapping(mappingId)
          await this.logger.log(
            'delete',
            'mapping',
            'success',
            'Rolled back mapping store',
            mappingId,
          )
        }
        catch (error) {
          console.error('Failed to rollback mapping store:', error)
        }
      },
    })

    return mappingId
  }

  /**
   * 删除文件（可回滚）
   * @param filePath - 文件路径
   * @param backup - 是否备份文件内容
   */
  async deleteFile(filePath: string, backup: boolean = true): Promise<void> {
    this.ensureNotFinalized()

    let fileContent: string | null = null

    // 如果需要备份，先读取文件内容
    if (backup) {
      try {
        fileContent = await this.sandboxManager.readFile(filePath)
      }
      catch (error) {
        console.warn('Failed to backup file before delete:', error)
      }
    }

    await this.sandboxManager.deleteFile(filePath)

    // 记录操作以便回滚
    this.operations.push({
      type: 'file_delete',
      data: { filePath, fileContent },
      rollback: async () => {
        if (fileContent) {
          try {
            const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'file.txt'
            await this.sandboxManager.saveFile(fileName, fileContent)
            await this.logger.log(
              'mask',
              fileName,
              'success',
              'Rolled back file delete',
            )
          }
          catch (error) {
            console.error('Failed to rollback file delete:', error)
          }
        }
      },
    })
  }

  /**
   * 提交事务
   * 一旦提交，操作将无法回滚
   */
  async commit(): Promise<void> {
    this.ensureNotFinalized()
    this.isCommitted = true
    this.operations = [] // 清空操作记录
  }

  /**
   * 回滚事务
   * 撤销所有已执行的操作
   */
  async rollback(): Promise<void> {
    if (this.isCommitted) {
      throw new MaskingError(
        'Cannot rollback committed transaction',
        'TRANSACTION_COMMITTED',
      )
    }

    if (this.isRolledBack) {
      return // 已经回滚过了
    }

    this.isRolledBack = true

    // 按相反顺序回滚操作
    const reversedOps = [...this.operations].reverse()

    for (const operation of reversedOps) {
      try {
        await operation.rollback()
      }
      catch (error) {
        console.error('Error during rollback:', error)
        // 继续回滚其他操作
      }
    }

    this.operations = []
  }

  /**
   * 获取操作数量
   */
  getOperationCount(): number {
    return this.operations.length
  }

  /**
   * 检查事务是否已完成
   */
  isFinalized(): boolean {
    return this.isCommitted || this.isRolledBack
  }

  // ==================== 私有方法 ====================

  /**
   * 确保事务未完成
   */
  private ensureNotFinalized(): void {
    if (this.isCommitted) {
      throw new MaskingError(
        'Transaction already committed',
        'TRANSACTION_COMMITTED',
      )
    }

    if (this.isRolledBack) {
      throw new MaskingError(
        'Transaction already rolled back',
        'TRANSACTION_ROLLED_BACK',
      )
    }
  }
}

/**
 * 执行带事务的操作
 * @param sandboxManager - 沙箱管理器
 * @param mappingStore - 映射存储
 * @param logger - 日志记录器
 * @param operation - 要执行的操作
 * @returns 操作结果
 */
export async function withTransaction<T>(
  sandboxManager: SandboxManager,
  mappingStore: MappingStore,
  logger: Logger,
  operation: (tx: TransactionManager) => Promise<T>,
): Promise<T> {
  const tx = new TransactionManager(sandboxManager, mappingStore, logger)

  try {
    const result = await operation(tx)
    await tx.commit()
    return result
  }
  catch (error) {
    await tx.rollback()
    throw error
  }
}
