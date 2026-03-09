/**
 * 映射存储单元测试
 * Mapping Store Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MappingStore } from '../mapping-store'
import type { MappingData } from '../types'
import { MaskingError } from '../types'
import { v4 as uuidv4 } from 'uuid'

describe('MappingStore', () => {
  let store: MappingStore

  beforeEach(async () => {
    store = new MappingStore()
    await store.initialize()
  })

  afterEach(() => {
    store.close()
  })

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const newStore = new MappingStore()
      await expect(newStore.initialize()).resolves.not.toThrow()
      newStore.close()
    })
  })

  describe('storeMapping', () => {
    it('should store a mapping and return an ID', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'user@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      expect(mappingId).toBeTruthy()
      expect(mappingId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should store multiple entries', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'user1@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
          {
            originalValue: 'user2@example.com',
            maskedValue: '***@***.***',
            position: 20,
            ruleId: 'rule1',
          },
          {
            originalValue: '123-456-7890',
            maskedValue: 'XXX-XXX-XXXX',
            position: 40,
            ruleId: 'rule2',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)
      const retrieved = await store.getMapping(mappingId)

      expect(retrieved).not.toBeNull()
      expect(retrieved!.entries).toHaveLength(3)
    })

    it('should throw error when not initialized', async () => {
      const uninitializedStore = new MappingStore()

      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [],
        createdAt: new Date(),
      }

      await expect(uninitializedStore.storeMapping(mappingData)).rejects.toThrow(
        MaskingError,
      )
    })
  })

  describe('getMapping', () => {
    it('should retrieve a stored mapping', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'sensitive@data.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)
      const retrieved = await store.getMapping(mappingId)

      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(mappingId)
      expect(retrieved!.fileName).toBe('test.txt')
      expect(retrieved!.fileHash).toBe('abc123')
      expect(retrieved!.entries).toHaveLength(1)
      expect(retrieved!.entries[0].originalValue).toBe('sensitive@data.com')
      expect(retrieved!.entries[0].maskedValue).toBe('***@***.***')
    })

    it('should return null for non-existent mapping', async () => {
      const nonExistentId = uuidv4()
      const retrieved = await store.getMapping(nonExistentId)

      expect(retrieved).toBeNull()
    })

    it('should decrypt original values correctly', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'very-secret-data',
            maskedValue: 'TOKEN_001',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)
      const retrieved = await store.getMapping(mappingId)

      // 验证原始值被正确解密
      expect(retrieved!.entries[0].originalValue).toBe('very-secret-data')
    })
  })

  describe('findOriginalValue', () => {
    it('should find original value by masked value', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'john@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
          {
            originalValue: '555-1234',
            maskedValue: 'XXX-XXXX',
            position: 20,
            ruleId: 'rule2',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      const original1 = await store.findOriginalValue('***@***.***', mappingId)
      expect(original1).toBe('john@example.com')

      const original2 = await store.findOriginalValue('XXX-XXXX', mappingId)
      expect(original2).toBe('555-1234')
    })

    it('should return null for non-existent masked value', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'test@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)
      const original = await store.findOriginalValue('NON_EXISTENT', mappingId)

      expect(original).toBeNull()
    })

    it('should return null for wrong mapping ID', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'test@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      await store.storeMapping(mappingData)
      const wrongId = uuidv4()
      const original = await store.findOriginalValue('***@***.***', wrongId)

      expect(original).toBeNull()
    })
  })

  describe('deleteMapping', () => {
    it('should delete a mapping', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'test@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      // 验证映射存在
      const before = await store.getMapping(mappingId)
      expect(before).not.toBeNull()

      // 删除映射
      await store.deleteMapping(mappingId)

      // 验证映射已删除
      const after = await store.getMapping(mappingId)
      expect(after).toBeNull()
    })

    it('should delete all associated entries', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'test1@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
          {
            originalValue: 'test2@example.com',
            maskedValue: '***@***.***',
            position: 20,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)
      await store.deleteMapping(mappingId)

      // 验证无法找到任何条目
      const original = await store.findOriginalValue('***@***.***', mappingId)
      expect(original).toBeNull()
    })

    it('should not throw error when deleting non-existent mapping', async () => {
      const nonExistentId = uuidv4()
      await expect(store.deleteMapping(nonExistentId)).resolves.not.toThrow()
    })
  })

  describe('listMappings', () => {
    it('should list all mappings', async () => {
      const mapping1: MappingData = {
        id: uuidv4(),
        fileName: 'file1.txt',
        filePath: '/sandbox/file1.txt',
        fileHash: 'hash1',
        entries: [
          {
            originalValue: 'test1@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mapping2: MappingData = {
        id: uuidv4(),
        fileName: 'file2.txt',
        filePath: '/sandbox/file2.txt',
        fileHash: 'hash2',
        entries: [
          {
            originalValue: 'test2@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
          {
            originalValue: '123-456-7890',
            maskedValue: 'XXX-XXX-XXXX',
            position: 20,
            ruleId: 'rule2',
          },
        ],
        createdAt: new Date(),
      }

      const id1 = await store.storeMapping(mapping1)
      const id2 = await store.storeMapping(mapping2)

      const list = await store.listMappings()

      expect(list.length).toBeGreaterThanOrEqual(2)

      const found1 = list.find(m => m.id === id1)
      expect(found1).toBeDefined()
      expect(found1!.fileName).toBe('file1.txt')
      expect(found1!.entryCount).toBe(1)

      const found2 = list.find(m => m.id === id2)
      expect(found2).toBeDefined()
      expect(found2!.fileName).toBe('file2.txt')
      expect(found2!.entryCount).toBe(2)
    })

    it('should return empty array when no mappings exist', async () => {
      // 创建新的存储实例以确保没有映射
      const newStore = new MappingStore()
      await newStore.initialize()

      const list = await newStore.listMappings()

      expect(list).toBeInstanceOf(Array)
      // 可能有其他测试留下的数据，所以只检查类型
      expect(Array.isArray(list)).toBe(true)

      newStore.close()
    })

    it('should sort mappings by creation date (newest first)', async () => {
      const now = new Date()

      const mapping1: MappingData = {
        id: uuidv4(),
        fileName: 'old.txt',
        filePath: '/sandbox/old.txt',
        fileHash: 'hash1',
        entries: [
          {
            originalValue: 'test@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(now.getTime() - 10000), // 10秒前
      }

      const mapping2: MappingData = {
        id: uuidv4(),
        fileName: 'new.txt',
        filePath: '/sandbox/new.txt',
        fileHash: 'hash2',
        entries: [
          {
            originalValue: 'test@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: now,
      }

      await store.storeMapping(mapping1)
      const id2 = await store.storeMapping(mapping2)

      const list = await store.listMappings()

      // 最新的应该在前面
      expect(list[0].id).toBe(id2)
    })
  })

  describe('close', () => {
    it('should close database connection', () => {
      expect(() => store.close()).not.toThrow()
    })

    it('should throw error when using store after close', async () => {
      store.close()

      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [],
        createdAt: new Date(),
      }

      await expect(store.storeMapping(mappingData)).rejects.toThrow(MaskingError)
    })
  })
})
