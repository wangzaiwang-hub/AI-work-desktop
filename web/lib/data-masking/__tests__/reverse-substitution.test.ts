/**
 * 反向替换单元测试
 * Reverse Substitution Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ReverseSubstitution } from '../reverse-substitution'
import { MappingStore } from '../mapping-store'
import type { MappingData } from '../types'
import { v4 as uuidv4 } from 'uuid'

describe('ReverseSubstitution', () => {
  let store: MappingStore
  let reverseSubstitution: ReverseSubstitution

  beforeEach(async () => {
    store = new MappingStore()
    await store.initialize()
    reverseSubstitution = new ReverseSubstitution(store)
  })

  afterEach(() => {
    store.close()
  })

  describe('identifyMaskedValues', () => {
    it('should identify email replacement pattern', () => {
      const response = 'Contact: ***@***.***'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('***@***.***')
    })

    it('should identify phone replacement pattern', () => {
      const response = 'Phone: XXX-XXX-XXXX'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('XXX-XXX-XXXX')
    })

    it('should identify tokenization pattern', () => {
      const response = 'Token: TOKEN_abc123'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('TOKEN_abc123')
    })

    it('should not identify generic *** pattern alone', () => {
      const response = 'Secret: ***'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      // Generic *** is not identified to avoid false positives
      expect(maskedValues).toEqual([])
    })

    it('should identify format-preserving pattern', () => {
      const response = 'ID: MASKED_123'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('MASKED_123')
    })

    it('should identify multiple masked values', () => {
      const response = 'Email: ***@***.*** Phone: XXX-XXX-XXXX Token: TOKEN_xyz'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('***@***.***')
      expect(maskedValues).toContain('XXX-XXX-XXXX')
      expect(maskedValues).toContain('TOKEN_xyz')
    })

    it('should identify masked values in JSON object', () => {
      const response = {
        email: '***@***.***',
        phone: 'XXX-XXX-XXXX',
      }
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('***@***.***')
      expect(maskedValues).toContain('XXX-XXX-XXXX')
    })

    it('should identify masked values in nested structure', () => {
      const response = {
        user: {
          contact: {
            email: '***@***.***',
            phone: 'XXX-XXX-XXXX',
          },
        },
        tokens: ['TOKEN_abc', 'TOKEN_xyz'],
      }
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toContain('***@***.***')
      expect(maskedValues).toContain('XXX-XXX-XXXX')
      expect(maskedValues).toContain('TOKEN_abc')
      expect(maskedValues).toContain('TOKEN_xyz')
    })

    it('should return empty array for no masked values', () => {
      const response = 'This is plain text with no masked values'
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toEqual([])
    })

    it('should handle empty string', () => {
      const response = ''
      const maskedValues = reverseSubstitution.identifyMaskedValues(response)

      expect(maskedValues).toEqual([])
    })

    it('should handle null and undefined', () => {
      expect(reverseSubstitution.identifyMaskedValues(null)).toEqual([])
      expect(reverseSubstitution.identifyMaskedValues(undefined)).toEqual([])
    })
  })

  describe('substitute', () => {
    it('should substitute masked values in plain text', async () => {
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

      const response = 'Contact: ***@***.***'
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('Contact: user@example.com')
      expect(result.substituted).toContain('***@***.***')
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should substitute multiple masked values', async () => {
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
            maskedValue: 'XXX-XXX-XXXX',
            position: 20,
            ruleId: 'rule2',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      const response = 'Email: ***@***.*** Phone: XXX-XXX-XXXX'
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('Email: john@example.com Phone: 555-1234')
      expect(result.substituted).toHaveLength(2)
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should substitute masked values in JSON object', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
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
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      const response = {
        email: '***@***.***',
        phone: 'XXX-XXX-XXXX',
      }
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toEqual({
        email: 'alice@example.com',
        phone: '555-9876',
      })
      expect(result.substituted).toHaveLength(2)
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should substitute masked values in nested structure', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'bob@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
          {
            originalValue: 'secret123',
            maskedValue: 'TOKEN_abc',
            position: 20,
            ruleId: 'rule2',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      const response = {
        user: {
          contact: {
            email: '***@***.***',
          },
        },
        tokens: ['TOKEN_abc', 'other'],
      }
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toEqual({
        user: {
          contact: {
            email: 'bob@example.com',
          },
        },
        tokens: ['secret123', 'other'],
      })
      expect(result.substituted).toHaveLength(2)
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should handle missing mappings gracefully', async () => {
      const mappingData: MappingData = {
        id: uuidv4(),
        fileName: 'test.txt',
        filePath: '/sandbox/test.txt',
        fileHash: 'abc123',
        entries: [
          {
            originalValue: 'known@example.com',
            maskedValue: '***@***.***',
            position: 0,
            ruleId: 'rule1',
          },
        ],
        createdAt: new Date(),
      }

      const mappingId = await store.storeMapping(mappingData)

      const response = 'Known: ***@***.*** Unknown: XXX-XXX-XXXX'
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('Known: known@example.com Unknown: XXX-XXX-XXXX')
      expect(result.substituted).toContain('***@***.***')
      expect(result.failed).toContain('XXX-XXX-XXXX')
      expect(result.partial).toBe(true)
    })

    it('should handle non-existent mapping ID', async () => {
      const nonExistentId = uuidv4()
      const response = 'Email: ***@***.***'
      const result = await reverseSubstitution.substitute(response, nonExistentId)

      expect(result.response).toBe('Email: ***@***.***')
      expect(result.substituted).toEqual([])
      expect(result.failed).toContain('***@***.***')
      expect(result.partial).toBe(true)
    })

    it('should handle empty response', async () => {
      const mappingId = uuidv4()
      const response = ''
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('')
      expect(result.substituted).toEqual([])
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should handle response with no masked values', async () => {
      const mappingId = uuidv4()
      const response = 'This is plain text'
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('This is plain text')
      expect(result.substituted).toEqual([])
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should substitute same masked value multiple times', async () => {
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

      const response = 'First: ***@***.*** Second: ***@***.***'
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toBe('First: test@example.com Second: test@example.com')
      expect(result.substituted).toContain('***@***.***')
      expect(result.failed).toEqual([])
      expect(result.partial).toBe(false)
    })

    it('should preserve non-string types in objects', async () => {
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

      const response = {
        email: '***@***.***',
        count: 42,
        active: true,
        data: null,
      }
      const result = await reverseSubstitution.substitute(response, mappingId)

      expect(result.response).toEqual({
        email: 'test@example.com',
        count: 42,
        active: true,
        data: null,
      })
    })
  })
})
