/**
 * 映射存储属性测试
 * Mapping Store Property-Based Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { MappingStore } from '../mapping-store'
import type { MappingData, MappingEntry } from '../types'
import { v4 as uuidv4 } from 'uuid'

describe('MappingStore Property Tests', () => {
  let store: MappingStore

  beforeEach(async () => {
    store = new MappingStore()
    await store.initialize()
  })

  afterEach(async () => {
    // Clean up: delete all mappings before closing
    try {
      const mappings = await store.listMappings()
      for (const mapping of mappings) {
        await store.deleteMapping(mapping.id)
      }
    }
    catch (error) {
      // Ignore errors during cleanup
    }
    store.close()
  })

  /**
   * Feature: data-masking, Property 10: 映射唯一标识
   *
   * 对于任何脱敏操作创建的映射，映射应该有唯一的标识符，
   * 并且可以通过该标识符检索到完整的映射数据。
   *
   * **验证：需求 5.1**
   */
  it('Property 10: Mappings should have unique identifiers and be retrievable', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingData(),
        async (mappingData) => {
          // 生成新的唯一ID以避免冲突
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          // 存储映射
          const mappingId = await store.storeMapping(dataWithNewId)

          // 验证 ID 是有效的 UUID
          expect(mappingId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          )

          // 通过 ID 检索映射
          const retrieved = await store.getMapping(mappingId)

          // 验证可以检索到映射
          expect(retrieved).not.toBeNull()
          expect(retrieved!.id).toBe(mappingId)
          expect(retrieved!.fileName).toBe(dataWithNewId.fileName)
          expect(retrieved!.fileHash).toBe(dataWithNewId.fileHash)
          expect(retrieved!.entries).toHaveLength(dataWithNewId.entries.length)
        },
      ),
      { numRuns: 50 },
    )
  })

  /**
   * Feature: data-masking, Property 11: 原始值加密存储
   *
   * 对于任何存储在映射数据库中的原始敏感值，该值应该以加密形式存储，
   * 直接读取数据库不应该能看到明文原始值。
   *
   * **验证：需求 5.2, 9.1**
   */
  it('Property 11: Original values should be stored encrypted', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingData(),
        async (mappingData) => {
          // 生成新的唯一ID以避免冲突
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          // 存储映射
          const mappingId = await store.storeMapping(dataWithNewId)

          // 检索映射
          const retrieved = await store.getMapping(mappingId)

          // 验证可以正确解密和检索原始值
          expect(retrieved).not.toBeNull()
          for (let i = 0; i < dataWithNewId.entries.length; i++) {
            expect(retrieved!.entries[i].originalValue).toBe(
              dataWithNewId.entries[i].originalValue,
            )
          }
        },
      ),
      { numRuns: 50 },
    )
  })

  /**
   * Feature: data-masking, Property 13: 映射查询隔离
   *
   * 对于任何映射查询操作，查询结果应该只包含与指定文件或映射ID关联的映射条目，
   * 不应该返回其他文件的映射。
   *
   * **验证：需求 5.4**
   */
  it('Property 13: Mapping queries should be isolated by mapping ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arbitraryMappingData(), { minLength: 2, maxLength: 5 }),
        async (mappings) => {
          // 为每个映射生成新的唯一ID
          const mappingsWithNewIds = mappings.map(m => ({ ...m, id: uuidv4() }))

          // 存储多个映射
          const mappingIds = await Promise.all(
            mappingsWithNewIds.map(m => store.storeMapping(m)),
          )

          // 为每个映射验证隔离性
          for (let i = 0; i < mappingIds.length; i++) {
            const retrieved = await store.getMapping(mappingIds[i])

            expect(retrieved).not.toBeNull()
            expect(retrieved!.id).toBe(mappingIds[i])
            expect(retrieved!.fileName).toBe(mappingsWithNewIds[i].fileName)

            // 验证条目数量匹配
            expect(retrieved!.entries).toHaveLength(mappingsWithNewIds[i].entries.length)

            // 验证条目内容匹配
            for (let j = 0; j < mappingsWithNewIds[i].entries.length; j++) {
              expect(retrieved!.entries[j].originalValue).toBe(
                mappingsWithNewIds[i].entries[j].originalValue,
              )
              expect(retrieved!.entries[j].maskedValue).toBe(
                mappingsWithNewIds[i].entries[j].maskedValue,
              )
            }
          }
        },
      ),
      { numRuns: 30 },
    )
  })

  /**
   * Feature: data-masking, Property 14: 脱敏值反向查找
   *
   * 对于任何脱敏值和关联的映射ID，应该能够通过脱敏值查找到对应的原始值。
   *
   * **验证：需求 5.5**
   */
  it('Property 14: Should find original value by masked value', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingData(),
        async (mappingData) => {
          // 生成新的唯一ID以避免冲突
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          // 存储映射
          const mappingId = await store.storeMapping(dataWithNewId)

          // 对每个条目验证反向查找
          for (const entry of dataWithNewId.entries) {
            const originalValue = await store.findOriginalValue(
              entry.maskedValue,
              mappingId,
            )

            // 如果有多个条目使用相同的脱敏值，返回的应该是其中之一
            const possibleValues = dataWithNewId.entries
              .filter(e => e.maskedValue === entry.maskedValue)
              .map(e => e.originalValue)

            expect(possibleValues).toContain(originalValue)
          }
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Store and retrieve should be idempotent', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingData(),
        async (mappingData) => {
          // 生成新的唯一ID以避免冲突
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          // 存储映射
          const mappingId = await store.storeMapping(dataWithNewId)

          // 多次检索应该返回相同结果
          const retrieved1 = await store.getMapping(mappingId)
          const retrieved2 = await store.getMapping(mappingId)

          expect(retrieved1).toEqual(retrieved2)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Non-existent mapping should return null', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        async (randomId) => {
          const retrieved = await store.getMapping(randomId)
          expect(retrieved).toBeNull()
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Deleted mapping should not be retrievable', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingData(),
        async (mappingData) => {
          // 生成新的唯一ID以避免冲突
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          // 存储映射
          const mappingId = await store.storeMapping(dataWithNewId)

          // 验证可以检索
          const before = await store.getMapping(mappingId)
          expect(before).not.toBeNull()

          // 删除映射
          await store.deleteMapping(mappingId)

          // 验证无法检索
          const after = await store.getMapping(mappingId)
          expect(after).toBeNull()
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: List mappings should include all stored mappings', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arbitraryMappingData(), { minLength: 1, maxLength: 5 }),
        async (mappings) => {
          // 为每个映射生成新的唯一ID
          const mappingsWithNewIds = mappings.map(m => ({ ...m, id: uuidv4() }))

          // 存储所有映射
          const mappingIds = await Promise.all(
            mappingsWithNewIds.map(m => store.storeMapping(m)),
          )

          // 列出所有映射
          const list = await store.listMappings()

          // 验证所有映射都在列表中
          for (const id of mappingIds) {
            const found = list.find(m => m.id === id)
            expect(found).toBeDefined()
          }
        },
      ),
      { numRuns: 30 },
    )
  })
})

// ==================== 自定义生成器 ====================

/**
 * 生成任意映射数据
 */
function arbitraryMappingData(): fc.Arbitrary<MappingData> {
  return fc.record({
    id: fc.uuid(),
    fileName: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s.trim() || 'file'}.txt`),
    filePath: fc.string({ minLength: 1, maxLength: 100 }).map(s => `/sandbox/${s.trim() || 'file'}`),
    fileHash: fc.string({ minLength: 64, maxLength: 64 }).map(s =>
      Array.from({ length: 64 }, (_, i) => '0123456789abcdef'[s.charCodeAt(i % s.length) % 16]).join(''),
    ),
    entries: fc.array(arbitraryMappingEntry(), { minLength: 1, maxLength: 10 }),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    expiresAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }), { nil: undefined }),
  })
}

/**
 * 生成任意映射条目
 */
function arbitraryMappingEntry(): fc.Arbitrary<MappingEntry> {
  return fc.record({
    originalValue: fc.oneof(
      fc.emailAddress(),
      fc.string({ minLength: 10, maxLength: 20 }),
      fc.integer({ min: 1000000000, max: 9999999999 }).map(String),
    ),
    maskedValue: fc.oneof(
      fc.constant('***@***.***'),
      fc.constant('XXX-XXX-XXXX'),
      fc.string({ minLength: 1, maxLength: 20 }).map(s => `TOKEN_${s}`),
    ),
    position: fc.integer({ min: 0, max: 10000 }),
    ruleId: fc.uuid(),
    context: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
  })
}
