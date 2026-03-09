/**
 * 脱敏引擎单元测试
 * Masking Engine Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MaskingEngine } from '../masking-engine'
import type { MaskingRule } from '../types'
import { MaskingError } from '../types'

describe('MaskingEngine', () => {
  let engine: MaskingEngine

  beforeEach(() => {
    engine = new MaskingEngine()
  })

  describe('maskContent', () => {
    it('should mask email addresses', async () => {
      const content = 'Contact: user@example.com'
      const rule: MaskingRule = {
        id: '1',
        name: 'Email',
        description: 'Mask email addresses',
        pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/g,
        strategy: { type: 'replacement', value: '***@***.***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await engine.maskContent(content, [rule])

      expect(result.maskedContent).toBe('Contact: ***@***.***')
      expect(result.matchCount).toBe(1)
      expect(result.mappingId).toBeTruthy()
    })

    it('should mask phone numbers', async () => {
      const content = 'Call me at 123-456-7890'
      const rule: MaskingRule = {
        id: '2',
        name: 'Phone',
        description: 'Mask phone numbers',
        pattern: /\d{3}-\d{3}-\d{4}/g,
        strategy: { type: 'replacement', value: 'XXX-XXX-XXXX' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await engine.maskContent(content, [rule])

      expect(result.maskedContent).toBe('Call me at XXX-XXX-XXXX')
      expect(result.matchCount).toBe(1)
    })

    it('should use tokenization strategy', async () => {
      const content = 'Card: 1234567890123456'
      const rule: MaskingRule = {
        id: '3',
        name: 'Credit Card',
        description: 'Mask credit card numbers',
        pattern: /\d{16}/g,
        strategy: { type: 'tokenization', prefix: 'TOKEN_' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await engine.maskContent(content, [rule])

      expect(result.maskedContent).toBe('Card: TOKEN_000001')
      expect(result.matchCount).toBe(1)
    })

    it('should use format-preserving strategy', async () => {
      const content = 'ID: ABC123'
      const rule: MaskingRule = {
        id: '4',
        name: 'ID',
        description: 'Mask IDs',
        pattern: /[A-Z]{3}\d{3}/g,
        strategy: { type: 'format-preserving', format: 'XXX000' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await engine.maskContent(content, [rule])

      expect(result.maskedContent).toBe('ID: XXX000')
      expect(result.matchCount).toBe(1)
    })

    it('should handle empty content', async () => {
      const result = await engine.maskContent('', [])

      expect(result.maskedContent).toBe('')
      expect(result.matchCount).toBe(0)
    })

    it('should handle no rules', async () => {
      const content = 'Some content'
      const result = await engine.maskContent(content, [])

      expect(result.maskedContent).toBe(content)
      expect(result.matchCount).toBe(0)
    })

    it('should only apply enabled rules', async () => {
      const content = 'Email: user@example.com Phone: 123-456-7890'
      const rules: MaskingRule[] = [
        {
          id: '1',
          name: 'Email',
          description: 'Mask emails',
          pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/g,
          strategy: { type: 'replacement', value: '***@***.***' },
          enabled: true,
          priority: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Phone',
          description: 'Mask phones',
          pattern: /\d{3}-\d{3}-\d{4}/g,
          strategy: { type: 'replacement', value: 'XXX-XXX-XXXX' },
          enabled: false, // 禁用
          priority: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const result = await engine.maskContent(content, rules)

      expect(result.maskedContent).toBe('Email: ***@***.*** Phone: 123-456-7890')
      expect(result.matchCount).toBe(1)
    })

    it('should apply rules in priority order', async () => {
      const content = 'test@example.com'
      const rules: MaskingRule[] = [
        {
          id: '1',
          name: 'Low Priority',
          description: 'Low priority rule',
          pattern: /test/g,
          strategy: { type: 'replacement', value: 'LOW' },
          enabled: true,
          priority: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'High Priority',
          description: 'High priority rule',
          pattern: /test/g,
          strategy: { type: 'replacement', value: 'HIGH' },
          enabled: true,
          priority: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const result = await engine.maskContent(content, rules)

      // 高优先级规则先应用
      expect(result.maskedContent).toContain('HIGH')
    })

    it('should handle multiple matches', async () => {
      const content = 'Emails: user1@example.com, user2@example.com, user3@example.com'
      const rule: MaskingRule = {
        id: '1',
        name: 'Email',
        description: 'Mask emails',
        pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/g,
        strategy: { type: 'replacement', value: '***@***.***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await engine.maskContent(content, [rule])

      expect(result.matchCount).toBe(3)
      expect(result.maskedContent).toBe('Emails: ***@***.***, ***@***.***, ***@***.***')
    })

    it('should throw error for invalid content type', async () => {
      await expect(
        engine.maskContent(null as any, []),
      ).rejects.toThrow(MaskingError)
    })

    it('should throw error for invalid rules type', async () => {
      await expect(
        engine.maskContent('content', null as any),
      ).rejects.toThrow(MaskingError)
    })
  })

  describe('validateRule', () => {
    it('should validate a valid rule', () => {
      const rule: MaskingRule = {
        id: '1',
        name: 'Email',
        description: 'Mask emails',
        pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/g,
        strategy: { type: 'replacement', value: '***@***.***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject rule without id', () => {
      const rule: MaskingRule = {
        id: '',
        name: 'Email',
        description: 'Mask emails',
        pattern: /test/g,
        strategy: { type: 'replacement', value: '***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Rule ID is required')
    })

    it('should reject rule without name', () => {
      const rule: MaskingRule = {
        id: '1',
        name: '',
        description: 'Mask emails',
        pattern: /test/g,
        strategy: { type: 'replacement', value: '***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Rule name is required')
    })

    it('should reject rule with invalid pattern', () => {
      const rule: MaskingRule = {
        id: '1',
        name: 'Test',
        description: 'Test rule',
        pattern: '[invalid(' as any,
        strategy: { type: 'replacement', value: '***' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Invalid pattern'))).toBe(true)
    })

    it('should reject replacement strategy without value', () => {
      const rule: MaskingRule = {
        id: '1',
        name: 'Test',
        description: 'Test rule',
        pattern: /test/g,
        strategy: { type: 'replacement', value: undefined as any },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Replacement strategy requires a value')
    })

    it('should reject tokenization strategy without prefix', () => {
      const rule: MaskingRule = {
        id: '1',
        name: 'Test',
        description: 'Test rule',
        pattern: /test/g,
        strategy: { type: 'tokenization', prefix: '' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Tokenization strategy requires a prefix')
    })

    it('should reject negative priority', () => {
      const rule: MaskingRule = {
        id: '1',
        name: 'Test',
        description: 'Test rule',
        pattern: /test/g,
        strategy: { type: 'replacement', value: '***' },
        enabled: true,
        priority: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = engine.validateRule(rule)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Priority must be a non-negative number')
    })
  })

  describe('resetTokenCounter', () => {
    it('should reset token counter', async () => {
      const content = 'Card1: 1234567890123456 Card2: 9876543210987654'
      const rule: MaskingRule = {
        id: '1',
        name: 'Credit Card',
        description: 'Mask cards',
        pattern: /\d{16}/g,
        strategy: { type: 'tokenization', prefix: 'TOKEN_' },
        enabled: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await engine.maskContent(content, [rule])
      engine.resetTokenCounter()

      const result = await engine.maskContent(content, [rule])

      // 计数器重置后，应该从 TOKEN_000001 开始
      expect(result.maskedContent).toContain('TOKEN_000001')
    })
  })
})
