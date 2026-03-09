/**
 * 加密映射文件集成测试
 * 测试完整的加密导出和解密还原流程
 */

import { encrypt, decrypt, generateKey } from '../crypto-utils'

describe('Encryption Integration', () => {
  it('should complete full encryption and decryption workflow', async () => {
    // 模拟脱敏后的映射数据
    const mappingData = {
      version: '1.0',
      source_file: 'test_document.md',
      masked_file: 'test_document.masked.md',
      created_at: new Date().toISOString(),
      total_replacements: 3,
      rules: [
        {
          original: 'John Doe',
          replacement: '[PERSON_001]',
          label: 'PERSON',
          type: 'entity',
          count: '2',
        },
        {
          original: '555-1234',
          replacement: '[PHONE_001]',
          label: 'PHONE',
          type: 'entity',
          count: '1',
        },
      ],
    }

    // 1. 生成加密口令
    const encryptionKey = generateKey(16) // 32位十六进制字符串
    expect(encryptionKey).toHaveLength(32)

    // 2. 加密映射数据
    const mappingJson = JSON.stringify(mappingData, null, 2)
    const encryptedData = await encrypt(mappingJson, encryptionKey)
    
    // 3. 创建加密的映射文件结构
    const encryptedMappingFile = {
      version: '1.0',
      encrypted: true,
      data: encryptedData,
    }
    const encryptedMappingJson = JSON.stringify(encryptedMappingFile, null, 2)

    // 验证加密后的数据不包含原始敏感信息
    expect(encryptedMappingJson).not.toContain('John Doe')
    expect(encryptedMappingJson).not.toContain('555-1234')
    expect(encryptedMappingJson).toContain('"encrypted": true')

    // 4. 模拟文件还原流程：解析加密文件
    const parsedEncryptedFile = JSON.parse(encryptedMappingJson)
    expect(parsedEncryptedFile.encrypted).toBe(true)
    expect(parsedEncryptedFile.data).toBeTruthy()

    // 5. 使用口令解密
    const decryptedJson = await decrypt(parsedEncryptedFile.data, encryptionKey)
    const decryptedMappingData = JSON.parse(decryptedJson)

    // 6. 验证解密后的数据完整性
    expect(decryptedMappingData).toEqual(mappingData)
    expect(decryptedMappingData.rules).toHaveLength(2)
    expect(decryptedMappingData.rules[0].original).toBe('John Doe')
    expect(decryptedMappingData.rules[1].original).toBe('555-1234')
  })

  it('should fail decryption with wrong passphrase', async () => {
    const mappingData = {
      version: '1.0',
      rules: [{ original: 'secret', replacement: '[SECRET_001]' }],
    }

    const correctKey = generateKey(16)
    const wrongKey = generateKey(16)

    const mappingJson = JSON.stringify(mappingData)
    const encryptedData = await encrypt(mappingJson, correctKey)

    // 尝试用错误的口令解密应该失败
    await expect(decrypt(encryptedData, wrongKey)).rejects.toThrow()
  })

  it('should handle large mapping files', async () => {
    // 创建一个包含大量规则的映射文件
    const rules = Array.from({ length: 1000 }, (_, i) => ({
      original: `sensitive_data_${i}`,
      replacement: `[MASKED_${String(i).padStart(4, '0')}]`,
      label: 'DATA',
      type: 'entity',
      count: String(Math.floor(Math.random() * 10) + 1),
    }))

    const largeMappingData = {
      version: '1.0',
      source_file: 'large_document.md',
      masked_file: 'large_document.masked.md',
      created_at: new Date().toISOString(),
      total_replacements: rules.length,
      rules,
    }

    const encryptionKey = generateKey(16)
    const mappingJson = JSON.stringify(largeMappingData)
    
    // 加密
    const encryptedData = await encrypt(mappingJson, encryptionKey)
    expect(encryptedData.length).toBeGreaterThan(0)

    // 解密
    const decryptedJson = await decrypt(encryptedData, encryptionKey)
    const decryptedData = JSON.parse(decryptedJson)

    // 验证
    expect(decryptedData.rules).toHaveLength(1000)
    expect(decryptedData.rules[0].original).toBe('sensitive_data_0')
    expect(decryptedData.rules[999].original).toBe('sensitive_data_999')
  })

  it('should support custom passphrase (32+ characters)', async () => {
    const mappingData = {
      version: '1.0',
      rules: [{ original: 'test', replacement: '[TEST_001]' }],
    }

    // 用户自定义的32位口令
    const customKey = 'my-super-secret-passphrase-2024'
    expect(customKey.length).toBeGreaterThanOrEqual(32)

    const mappingJson = JSON.stringify(mappingData)
    const encryptedData = await encrypt(mappingJson, customKey)
    const decryptedJson = await decrypt(encryptedData, customKey)
    const decryptedData = JSON.parse(decryptedJson)

    expect(decryptedData).toEqual(mappingData)
  })

  it('should maintain data integrity with special characters', async () => {
    const mappingData = {
      version: '1.0',
      rules: [
        {
          original: '张三 (CEO)',
          replacement: '[人名_001]',
          label: '人名',
          type: 'entity',
          count: '1',
        },
        {
          original: 'email@example.com',
          replacement: '[EMAIL_001]',
          label: 'EMAIL',
          type: 'entity',
          count: '1',
        },
        {
          original: '$1,234.56',
          replacement: '[AMOUNT_001]',
          label: 'MONEY',
          type: 'entity',
          count: '1',
        },
      ],
    }

    const encryptionKey = generateKey(16)
    const mappingJson = JSON.stringify(mappingData, null, 2)
    
    const encryptedData = await encrypt(mappingJson, encryptionKey)
    const decryptedJson = await decrypt(encryptedData, encryptionKey)
    const decryptedData = JSON.parse(decryptedJson)

    expect(decryptedData).toEqual(mappingData)
    expect(decryptedData.rules[0].original).toBe('张三 (CEO)')
    expect(decryptedData.rules[1].original).toBe('email@example.com')
    expect(decryptedData.rules[2].original).toBe('$1,234.56')
  })
})
