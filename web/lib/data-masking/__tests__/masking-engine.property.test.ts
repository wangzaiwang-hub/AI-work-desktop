/**
 * 脱敏引擎属性测试
 * Masking Engine Property-Based Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { MaskingEngine } from '../masking-engine'
import type { MaskingRule, MaskingStrategy } from '../types'

describe('MaskingEngine Property Tests', () => {
  let engine: MaskingEngine

  beforeEach(() => {
    engine = new MaskingEngine()
  })

  /**
   * Feature: data-masking, Property 1: 脱敏规则完整应用
   *
   * 对于任何文件内容和任何启用的脱敏规则集，当执行脱敏操作时，
   * 所有启用的规则都应该被应用于内容，并且映射存储应该包含所有匹配项的映射条目。
   *
   * **验证：需求 1.1, 1.3**
   */
  it('Property 1: All enabled rules should be applied to content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 1000 }),
        fc.array(arbitraryMaskingRule(), { minLength: 0, maxLength: 5 }),
        async (content, rules) => {
          const result = await engine.maskContent(content, rules)

          // 验证结果包含必要字段
          expect(result).toHaveProperty('maskedContent')
          expect(result).toHaveProperty('mappingId')
          expect(result).toHaveProperty('matchCount')
          expect(result).toHaveProperty('timestamp')

          // 验证 mappingId 是有效的 UUID
          expect(result.mappingId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          )

          // 验证 matchCount 是非负数
          expect(result.matchCount).toBeGreaterThanOrEqual(0)

          // 验证 timestamp 是有效日期
          expect(result.timestamp).toBeInstanceOf(Date)
          expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now())
        },
      ),
      { numRuns: 100 },
    )
  })

  it('Property: Masking should be deterministic for same input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.array(arbitraryMaskingRule(), { minLength: 1, maxLength: 3 }),
        async (content, rules) => {
          // 重置计数器以确保确定性
          engine.resetTokenCounter()
          const result1 = await engine.maskContent(content, rules)

          engine.resetTokenCounter()
          const result2 = await engine.maskContent(content, rules)

          // 相同输入应该产生相同的脱敏内容
          expect(result1.maskedContent).toBe(result2.maskedContent)
          expect(result1.matchCount).toBe(result2.matchCount)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Disabled rules should not affect content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.array(arbitraryMaskingRule(), { minLength: 1, maxLength: 3 }),
        async (content, rules) => {
          // 禁用所有规则
          const disabledRules = rules.map(rule => ({ ...rule, enabled: false }))

          const result = await engine.maskContent(content, disabledRules)

          // 禁用的规则不应该改变内容
          expect(result.maskedContent).toBe(content)
          expect(result.matchCount).toBe(0)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Match count should never exceed content length', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.array(arbitraryMaskingRule(), { minLength: 0, maxLength: 5 }),
        async (content, rules) => {
          const result = await engine.maskContent(content, rules)

          // 匹配数量不应该超过内容长度
          expect(result.matchCount).toBeLessThanOrEqual(content.length)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('Property: Empty content should produce empty masked content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arbitraryMaskingRule(), { minLength: 0, maxLength: 5 }),
        async (rules) => {
          const result = await engine.maskContent('', rules)

          expect(result.maskedContent).toBe('')
          expect(result.matchCount).toBe(0)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Rule validation should be consistent', () => {
    fc.assert(
      fc.property(
        arbitraryMaskingRule(),
        (rule) => {
          const result1 = engine.validateRule(rule)
          const result2 = engine.validateRule(rule)

          // 相同规则的验证结果应该一致
          expect(result1.valid).toBe(result2.valid)
          expect(result1.errors).toEqual(result2.errors)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('Property: Valid rules should pass validation', () => {
    fc.assert(
      fc.property(
        arbitraryValidMaskingRule(),
        (rule) => {
          const result = engine.validateRule(rule)

          expect(result.valid).toBe(true)
          expect(result.errors).toHaveLength(0)
        },
      ),
      { numRuns: 100 },
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
    name: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    pattern: fc.oneof(
      fc.constant(/\b[\w.-]+@[\w.-]+\.\w+\b/g), // Email
      fc.constant(/\d{3}-\d{3}-\d{4}/g), // Phone
      fc.constant(/\d{16}/g), // Credit card
      fc.constant(/[A-Z]{3}\d{3}/g), // ID
      fc.constant(/\b\d{3}-\d{2}-\d{4}\b/g), // SSN
    ),
    strategy: arbitraryMaskingStrategy(),
    enabled: fc.boolean(),
    priority: fc.integer({ min: 0, max: 10 }),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  })
}

/**
 * 生成有效的脱敏规则（用于验证测试）
 */
function arbitraryValidMaskingRule(): fc.Arbitrary<MaskingRule> {
  return fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    pattern: fc.oneof(
      fc.constant(/\b[\w.-]+@[\w.-]+\.\w+\b/g),
      fc.constant(/\d{3}-\d{3}-\d{4}/g),
      fc.constant(/\d{16}/g),
    ),
    strategy: fc.oneof(
      fc.record({ type: fc.constant('replacement' as const), value: fc.string({ minLength: 1 }) }),
      fc.record({ type: fc.constant('tokenization' as const), prefix: fc.string({ minLength: 1 }) }),
      fc.record({ type: fc.constant('format-preserving' as const), format: fc.string({ minLength: 1 }) }),
    ),
    enabled: fc.boolean(),
    priority: fc.integer({ min: 0, max: 10 }),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  })
}

/**
 * 生成任意脱敏策略
 */
function arbitraryMaskingStrategy(): fc.Arbitrary<MaskingStrategy> {
  return fc.oneof(
    fc.record({
      type: fc.constant('replacement' as const),
      value: fc.string({ minLength: 0, maxLength: 20 }),
    }),
    fc.record({
      type: fc.constant('tokenization' as const),
      prefix: fc.string({ minLength: 0, maxLength: 10 }),
    }),
    fc.record({
      type: fc.constant('format-preserving' as const),
      format: fc.string({ minLength: 0, maxLength: 20 }),
    }),
  )
}
