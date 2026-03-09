/**
 * 映射存储 (Mapping Store)
 * 负责存储和检索原始值与脱敏值的映射
 */

import { v4 as uuidv4 } from 'uuid'
import type {
  MappingData,
  MappingEntry,
  MappingInfo,
} from './types'
import { MaskingError } from './types'
import { encrypt, decrypt } from './crypto-utils'
import { getCredentialManager } from './credential-manager'
import {
  getIndexedDB,
  addRecord,
  updateRecord,
  getRecord,
  getAllRecords,
  deleteRecord,
  getByIndex,
  STORES,
} from './indexeddb'

/**
 * 映射存储类
 */
export class MappingStore {
  private db: IDBDatabase | null = null
  private encryptionKey: string | null = null

  /**
   * 初始化映射存储
   */
  async initialize(): Promise<void> {
    try {
      // 获取数据库连接
      this.db = await getIndexedDB()

      // 获取加密密钥
      const credentialManager = getCredentialManager()
      this.encryptionKey = await credentialManager.retrieveKey()

      if (!this.encryptionKey) {
        throw new MaskingError(
          'Failed to retrieve encryption key',
          'KEY_RETRIEVAL_FAILED',
        )
      }
    }
    catch (error) {
      throw new MaskingError(
        'Failed to initialize mapping store',
        'INIT_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 确保已初始化
   */
  private ensureInitialized(): void {
    if (!this.db || !this.encryptionKey) {
      throw new MaskingError(
        'Mapping store not initialized. Call initialize() first.',
        'NOT_INITIALIZED',
      )
    }
  }

  /**
   * 存储映射关系
   * @param mapping - 映射数据
   * @returns 映射ID
   */
  async storeMapping(mapping: MappingData): Promise<string> {
    this.ensureInitialized()

    try {
      // 加密所有原始值
      const encryptedEntries = await Promise.all(
        mapping.entries.map(async (entry) => {
          const encryptedValue = await encrypt(
            entry.originalValue,
            this.encryptionKey!,
          )
          return {
            ...entry,
            originalValue: encryptedValue,
          }
        }),
      )

      // 存储映射
      const mappingRecord = {
        id: mapping.id || uuidv4(),
        file_name: mapping.fileName,
        file_path: mapping.filePath,
        file_hash: mapping.fileHash,
        created_at: !isNaN(mapping.createdAt.getTime()) 
          ? mapping.createdAt.toISOString() 
          : new Date().toISOString(),
        expires_at: mapping.expiresAt && !isNaN(mapping.expiresAt.getTime()) 
          ? mapping.expiresAt.toISOString() 
          : null,
      }

      await addRecord(this.db!, STORES.MAPPINGS, mappingRecord)

      // 存储映射条目
      for (const entry of encryptedEntries) {
        const entryRecord = {
          mapping_id: mappingRecord.id,
          original_value_encrypted: entry.originalValue,
          masked_value: entry.maskedValue,
          position: entry.position,
          rule_id: entry.ruleId,
          context: entry.context || null,
        }

        await addRecord(this.db!, STORES.MAPPING_ENTRIES, entryRecord)
      }

      return mappingRecord.id
    }
    catch (error) {
      throw new MaskingError(
        'Failed to store mapping',
        'STORE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 根据映射ID检索映射
   * @param mappingId - 映射ID
   * @returns 映射数据，如果不存在返回 null
   */
  async getMapping(mappingId: string): Promise<MappingData | null> {
    this.ensureInitialized()

    try {
      // 获取映射记录
      const mappingRecord = await getRecord<any>(
        this.db!,
        STORES.MAPPINGS,
        mappingId,
      )

      if (!mappingRecord)
        return null

      // 获取映射条目
      const entryRecords = await getByIndex<any>(
        this.db!,
        STORES.MAPPING_ENTRIES,
        'mapping_id',
        mappingId,
      )

      // 解密原始值
      const entries: MappingEntry[] = await Promise.all(
        entryRecords.map(async (record) => {
          const originalValue = await decrypt(
            record.original_value_encrypted,
            this.encryptionKey!,
          )
          return {
            originalValue,
            maskedValue: record.masked_value,
            position: record.position,
            ruleId: record.rule_id,
            context: record.context || undefined,
          }
        }),
      )

      return {
        id: mappingRecord.id,
        fileName: mappingRecord.file_name,
        filePath: mappingRecord.file_path,
        fileHash: mappingRecord.file_hash,
        entries,
        createdAt: new Date(mappingRecord.created_at),
        expiresAt: mappingRecord.expires_at
          ? new Date(mappingRecord.expires_at)
          : undefined,
      }
    }
    catch (error) {
      throw new MaskingError(
        'Failed to get mapping',
        'GET_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 根据脱敏值查找原始值
   * @param maskedValue - 脱敏值
   * @param mappingId - 映射ID
   * @returns 原始值，如果不存在返回 null
   */
  async findOriginalValue(
    maskedValue: string,
    mappingId: string,
  ): Promise<string | null> {
    this.ensureInitialized()

    try {
      // 获取映射条目
      const entryRecords = await getByIndex<any>(
        this.db!,
        STORES.MAPPING_ENTRIES,
        'mapping_id',
        mappingId,
      )

      // 查找匹配的条目
      const matchingEntry = entryRecords.find(
        record => record.masked_value === maskedValue,
      )

      if (!matchingEntry)
        return null

      // 解密原始值
      return await decrypt(
        matchingEntry.original_value_encrypted,
        this.encryptionKey!,
      )
    }
    catch (error) {
      throw new MaskingError(
        'Failed to find original value',
        'FIND_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 删除映射
   * @param mappingId - 映射ID
   */
  async deleteMapping(mappingId: string): Promise<void> {
    this.ensureInitialized()

    try {
      // 删除映射条目（由于外键约束，会自动删除）
      // 但在 IndexedDB 中需要手动删除
      const entryRecords = await getByIndex<any>(
        this.db!,
        STORES.MAPPING_ENTRIES,
        'mapping_id',
        mappingId,
      )

      for (const entry of entryRecords) {
        await deleteRecord(this.db!, STORES.MAPPING_ENTRIES, entry.id)
      }

      // 删除映射记录
      await deleteRecord(this.db!, STORES.MAPPINGS, mappingId)
    }
    catch (error) {
      throw new MaskingError(
        'Failed to delete mapping',
        'DELETE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 列出所有映射
   * @returns 映射列表
   */
  async listMappings(): Promise<MappingInfo[]> {
    this.ensureInitialized()

    try {
      // 获取所有映射记录
      const mappingRecords = await getAllRecords<any>(
        this.db!,
        STORES.MAPPINGS,
      )

      // 转换为映射信息
      const mappings: MappingInfo[] = await Promise.all(
        mappingRecords.map(async (record) => {
          // 获取条目数量
          const entryRecords = await getByIndex<any>(
            this.db!,
            STORES.MAPPING_ENTRIES,
            'mapping_id',
            record.id,
          )

          return {
            id: record.id,
            fileName: record.file_name,
            entryCount: entryRecords.length,
            createdAt: new Date(record.created_at),
          }
        }),
      )

      // 按创建时间降序排序
      return mappings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
    catch (error) {
      throw new MaskingError(
        'Failed to list mappings',
        'LIST_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
    this.encryptionKey = null
  }
}
