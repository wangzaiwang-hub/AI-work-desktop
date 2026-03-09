/**
 * 加密工具测试
 */

import { encrypt, decrypt, generateKey, hash } from '../crypto-utils'

describe('crypto-utils', () => {
  describe('generateKey', () => {
    it('should generate a key of specified length', () => {
      const key = generateKey(16)
      expect(key).toHaveLength(32) // 16 bytes = 32 hex characters
    })

    it('should generate different keys each time', () => {
      const key1 = generateKey(16)
      const key2 = generateKey(16)
      expect(key1).not.toBe(key2)
    })
  })

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const data = 'sensitive information'
      const key = generateKey(16)

      const encrypted = await encrypt(data, key)
      expect(encrypted).not.toBe(data)
      expect(encrypted.length).toBeGreaterThan(0)

      const decrypted = await decrypt(encrypted, key)
      expect(decrypted).toBe(data)
    })

    it('should handle JSON data', async () => {
      const data = JSON.stringify({
        version: '1.0',
        rules: [
          { original: 'John Doe', replacement: '[PERSON_001]' },
          { original: '123-456-7890', replacement: '[PHONE_001]' },
        ],
      })
      const key = generateKey(16)

      const encrypted = await encrypt(data, key)
      const decrypted = await decrypt(encrypted, key)
      
      expect(decrypted).toBe(data)
      expect(JSON.parse(decrypted)).toEqual(JSON.parse(data))
    })

    it('should fail to decrypt with wrong key', async () => {
      const data = 'sensitive information'
      const key1 = generateKey(16)
      const key2 = generateKey(16)

      const encrypted = await encrypt(data, key1)
      
      await expect(decrypt(encrypted, key2)).rejects.toThrow()
    })

    it('should handle empty string', async () => {
      const data = ''
      const key = generateKey(16)

      const encrypted = await encrypt(data, key)
      const decrypted = await decrypt(encrypted, key)
      
      expect(decrypted).toBe(data)
    })

    it('should handle unicode characters', async () => {
      const data = '你好世界 🌍 مرحبا'
      const key = generateKey(16)

      const encrypted = await encrypt(data, key)
      const decrypted = await decrypt(encrypted, key)
      
      expect(decrypted).toBe(data)
    })
  })

  describe('hash', () => {
    it('should generate consistent hash for same input', async () => {
      const data = 'test data'
      const hash1 = await hash(data)
      const hash2 = await hash(data)
      
      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64) // SHA-256 = 64 hex characters
    })

    it('should generate different hashes for different inputs', async () => {
      const hash1 = await hash('data1')
      const hash2 = await hash('data2')
      
      expect(hash1).not.toBe(hash2)
    })
  })
})
