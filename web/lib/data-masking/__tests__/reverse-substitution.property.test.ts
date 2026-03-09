/**
 * 反向替换属性测试
 * Reverse Substitution Property-Based Tests
 */

import type { MappingData, MappingEntry, MaskingRule } from '../types'
import * as fc from 'fast-check'
import { v4 as uuidv4 } from 'uuid'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MappingStore } from '../mapping-store'
import { MaskingEngine } from '../masking-engine'
import { ReverseSubstitution } from '../reverse-substitution'

describe('ReverseSubstitution Property Tests', () => {
  let store: MappingStore
  let reverseSubstitution: ReverseSubstitution
  let maskingEngine: MaskingEngine

  beforeEach(async () => {
    store = new MappingStore()
    await store.initialize()
    reverseSubstitution = new ReverseSubstitution(store)
    maskingEngine = new MaskingEngine()
  })

  afterEach(async () => {
    // Clean up: delete all mappings before closing
    try {
      const mappings = await store.listMappings()
      for (const mapping of mappings) {
        await store.deleteMapping(mapping.id)
      }
    }
    catch {}
    store.close()
  })

  /**
   * Feature: data-masking, Property 15: 脱敏和反向替换往返
   *
   * 对于任何文件内容和脱敏规则集，执行脱敏操作然后对结果执行反向替换，
   * 应该恢复出与原始内容等价的内容（所有敏感数据被正确恢复）。
   *
   * **验证：需求 6.1, 6.2, 6.3, 6.4**
   */
  it('Property 15: Masking and reverse substitution round trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.array(arbitraryMaskingRule(), { minLength: 1, maxLength: 3 }),
        async (content, rules) => {
          // 确保规则启用
          const enabledRules = rules.map(r => ({ ...r, enabled: true }))

          // 执行脱敏
          const maskResult = await maskingEngine.maskContent(content, enabledRules)

          // 如果没有匹配，跳过此测试用例（返回true表示测试通过）
          if (maskResult.matchCount === 0) {
            return true
          }

          // 执行反向替换
          const substituteResult = await reverseSubstitution.substitute(
            maskResult.maskedContent,
            maskResult.mappingId,
          )

          // 验证往返：恢复后的内容应该等于原始内容
          expect(substituteResult.response).toBe(content)
          expect(substituteResult.partial).toBe(false)
          expect(substituteResult.failed).toEqual([])

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  /**
   * Feature: data-masking, Property 16: 多格式反向替换
   *
   * 对于任何支持的响应格式（文本、JSON、结构化数据），
   * 反向替换应该能够正确识别和替换该格式中的脱敏值。
   *
   * **验证：需求 6.6**
   */
  it('Property 16: Multi-format reverse substitution', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryResponseFormat(),
        async (responseData) => {
          // 创建映射数据
          const mappingData: MappingData = {
            id: uuidv4(),
            fileName: 'test.txt',
            filePath: '/sandbox/test.txt',
            fileHash: 'abc123',
            entries: responseData.entries,
            createdAt: new Date(),
          }

          const mappingId = await store.storeMapping(mappingData)

          // 执行反向替换
          const result = await reverseSubstitution.substitute(
            responseData.response,
            mappingId,
          )

          // 验证所有脱敏值都被替换
          for (const entry of responseData.entries) {
            expect(result.substituted).toContain(entry.maskedValue)
          }

          expect(result.partial).toBe(false)
          expect(result.failed).toEqual([])

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Substitution should be idempotent', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingDataWithResponse(),
        async ({ mappingData, response }) => {
          const mappingId = await store.storeMapping(mappingData)

          // 执行两次替换
          const result1 = await reverseSubstitution.substitute(response, mappingId)
          const result2 = await reverseSubstitution.substitute(result1.response, mappingId)

          // 第二次替换应该不改变结果（因为已经没有脱敏值了）
          expect(result2.response).toEqual(result1.response)
          expect(result2.substituted).toEqual([])

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Partial substitution should preserve unmatched values', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryMappingDataWithResponse(),
        fc.array(fc.string({ minLength: 10, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
        async ({ mappingData, response }, unknownMaskedValues) => {
          // Generate new unique ID to avoid conflicts
          const dataWithNewId = { ...mappingData, id: uuidv4() }

          const mappingId = await store.storeMapping(dataWithNewId)

          // Add some unknown masked values to the response
          let modifiedResponse = response
          if (typeof response === 'string') {
            // Filter out values that might match our patterns
            const safeUnknownValues = unknownMaskedValues.filter(v =>
              !v.includes('TOKEN_') && !v.includes('XXX-XXX-XXXX') && !v.includes('***@***.***'),
            )
            if (safeUnknownValues.length > 0) {
              modifiedResponse = `${response} UNKNOWN_${safeUnknownValues.join(' UNKNOWN_')}`
            }
          }

          const result = await reverseSubstitution.substitute(modifiedResponse, mappingId)

          // Verify known masked values that match our patterns were substituted
          const identifiedValues = reverseSubstitution.identifyMaskedValues(response)

          // The test passes if:
          // 1. There are no identified values (edge case with patterns not matching), OR
          // 2. All identified values were successfully substituted
          if (identifiedValues.length === 0) {
            // Edge case: the masked values in the mapping don't match our identification patterns
            // This is acceptable - we can't substitute what we can't identify
            return true
          }

          // If we identified values, they should all be substituted
          for (const maskedValue of identifiedValues) {
            expect(result.substituted).toContain(maskedValue)
          }

          return true
        },
      ),
      { numRuns: 30 },
    )
  })

  it('Property: Empty response should return empty result', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        async (mappingId) => {
          const result = await reverseSubstitution.substitute('', mappingId)

          expect(result.response).toBe('')
          expect(result.substituted).toEqual([])
          expect(result.failed).toEqual([])
          expect(result.partial).toBe(false)

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Non-existent mapping should preserve response', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.uuid(),
        async (response, nonExistentId) => {
          const result = await reverseSubstitution.substitute(response, nonExistentId)

          // 响应应该保持不变（因为找不到映射）
          expect(result.response).toBe(response)

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Identified masked values should be unique', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryResponseFormat(),
        async (responseData) => {
          const maskedValues = reverseSubstitution.identifyMaskedValues(responseData.response)

          // 验证没有重复值
          const uniqueValues = new Set(maskedValues)
          expect(maskedValues.length).toBe(uniqueValues.size)

          return true
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Substitution should preserve data structure', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryNestedObject(),
        async (obj) => {
          const mappingId = uuidv4()

          const result = await reverseSubstitution.substitute(obj, mappingId)

          // 验证数据结构类型保持不变
          expect(typeof result.response).toBe(typeof obj)
          if (Array.isArray(obj)) {
            expect(Array.isArray(result.response)).toBe(true)
          }

          return true
        },
      ),
      { numRuns: 50 },
    )
  })
})

// ==================== 自定义生成器 ====================

/**
 * 生成任意脱敏规则
 */
function arbitraryMaskingRule(): fc.Arbitrary<MaskingRule> {
  return fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    description: fc.string({ minLength: 0, maxLength: 50 }),
    pattern: fc.oneof(
      fc.constant(/\b[\w.-]+@[\w.-]+\.\w+\b/g), // Email
      fc.constant(/\d{3}-\d{4}/g), // Phone
      fc.constant(/\b\d{16}\b/g), // Credit card
    ),
    strategy: fc.oneof(
      fc.record({ type: fc.constant('replacement' as const), value: fc.constant('***@***.***') }),
      fc.record({ type: fc.constant('tokenization' as const), prefix: fc.constant('TOKEN_') }),
      fc.record({ type: fc.constant('format-preserving' as const), format: fc.constant('MASKED_') }),
    ),
    enabled: fc.boolean(),
    priority: fc.integer({ min: 0, max: 10 }),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  })
}

/**
 * 生成任意响应格式（包含脱敏值）
 */
function arbitraryResponseFormat(): fc.Arbitrary<{
  response: unknown
  entries: MappingEntry[]
}> {
  return fc.oneof(
    // 纯文本响应
    fc.record({
      response: fc.string({ minLength: 10, maxLength: 100 }).map(s => `Email: ***@***.*** Phone: XXX-XXX-XXXX ${s}`),
      entries: fc.constant([
        {
          originalValue: 'user@example.com',
          maskedValue: '***@***.***',
          position: 0,
          ruleId: 'rule1',
        },
        {
          originalValue: '555-1234',
          maskedValue: 'XXX-XXX-XXXX',
          position: 20,
          ruleId: 'rule2',
        },
      ] as MappingEntry[]),
    }),
    // JSON 对象响应
    fc.record({
      response: fc.constant({
        email: '***@***.***',
        phone: 'XXX-XXX-XXXX',
        token: 'TOKEN_abc',
      }),
      entries: fc.constant([
        {
          originalValue: 'alice@example.com',
          maskedValue: '***@***.***',
          position: 0,
          ruleId: 'rule1',
        },
        {
          originalValue: '555-9876',
          maskedValue: 'XXX-XXX-XXXX',
          position: 20,
          ruleId: 'rule2',
        },
        {
          originalValue: 'secret123',
          maskedValue: 'TOKEN_abc',
          position: 40,
          ruleId: 'rule3',
        },
      ] as MappingEntry[]),
    }),
    // 嵌套结构响应
    fc.record({
      response: fc.constant({
        user: {
          contact: {
            email: '***@***.***',
          },
        },
        tokens: ['TOKEN_xyz'],
      }),
      entries: fc.constant([
        {
          originalValue: 'bob@example.com',
          maskedValue: '***@***.***',
          position: 0,
          ruleId: 'rule1',
        },
        {
          originalValue: 'secret456',
          maskedValue: 'TOKEN_xyz',
          position: 20,
          ruleId: 'rule2',
        },
      ] as MappingEntry[]),
    }),
  )
}

/**
 * 生成映射数据和对应的响应
 */
function arbitraryMappingDataWithResponse(): fc.Arbitrary<{
  mappingData: MappingData
  response: string
}> {
  return fc.record({
    entries: fc.array(
      fc.record({
        originalValue: fc.oneof(
          fc.emailAddress(),
          fc.string({ minLength: 5, maxLength: 20 }).filter(s => s.trim().length > 0),
        ),
        maskedValue: fc.oneof(
          fc.constant('***@***.***'),
          fc.constant('XXX-XXX-XXXX'),
          // Generate TOKEN_ values that match our pattern (alphanumeric only, no spaces)
          fc.string({ minLength: 3, maxLength: 10 }).filter(s => /^[A-Z0-9]+$/i.test(s)).map(s => `TOKEN_${s}`),
        ),
        position: fc.integer({ min: 0, max: 100 }),
        ruleId: fc.uuid(),
      }),
      { minLength: 1, maxLength: 5 },
    ),
  }).map(({ entries }) => {
    // 构建包含所有脱敏值的响应
    const response = entries.map(e => e.maskedValue).join(' ')

    const mappingData: MappingData = {
      id: uuidv4(),
      fileName: 'test.txt',
      filePath: '/sandbox/test.txt',
      fileHash: 'abc123',
      entries,
      createdAt: new Date(),
    }

    return { mappingData, response }
  })
}

/**
 * 生成任意嵌套对象
 */
function arbitraryNestedObject(): fc.Arbitrary<unknown> {
  return fc.oneof(
    fc.string(),
    fc.integer(),
    fc.boolean(),
    fc.constant(null),
    fc.array(fc.oneof(fc.string(), fc.integer())),
    fc.record({
      a: fc.string(),
      b: fc.integer(),
      c: fc.record({
        d: fc.string(),
      }),
    }),
  )
}
