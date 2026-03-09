/**
 * 加密工具
 * Cryptography Utilities
 */

/**
 * 加密数据
 * @param data - 要加密的数据
 * @param key - 加密密钥
 * @returns 加密后的数据（Base64 编码）
 */
export async function encrypt(data: string, key: string): Promise<string> {
  // 在浏览器环境中使用 Web Crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return encryptWithWebCrypto(data, key)
  }

  // 在 Node.js 环境中使用 crypto 模块
  if (typeof require !== 'undefined') {
    return encryptWithNodeCrypto(data, key)
  }

  throw new Error('No crypto implementation available')
}

/**
 * 解密数据
 * @param encryptedData - 加密的数据（Base64 编码）
 * @param key - 解密密钥
 * @returns 解密后的数据
 */
export async function decrypt(encryptedData: string, key: string): Promise<string> {
  // 在浏览器环境中使用 Web Crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return decryptWithWebCrypto(encryptedData, key)
  }

  // 在 Node.js 环境中使用 crypto 模块
  if (typeof require !== 'undefined') {
    return decryptWithNodeCrypto(encryptedData, key)
  }

  throw new Error('No crypto implementation available')
}

/**
 * 使用 Web Crypto API 加密
 */
async function encryptWithWebCrypto(data: string, key: string): Promise<string> {
  // 将密钥转换为 CryptoKey
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key.padEnd(32, '0').substring(0, 32))
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  )

  // 生成随机 IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // 加密数据
  const dataBuffer = encoder.encode(data)
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer,
  )

  // 组合 IV 和加密数据
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedBuffer), iv.length)

  // 转换为 Base64
  return btoa(String.fromCharCode(...combined))
}

/**
 * 使用 Web Crypto API 解密
 */
async function decryptWithWebCrypto(encryptedData: string, key: string): Promise<string> {
  // 从 Base64 解码
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))

  // 提取 IV 和加密数据
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)

  // 将密钥转换为 CryptoKey
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key.padEnd(32, '0').substring(0, 32))
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  )

  // 解密数据
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted,
  )

  // 转换为字符串
  const decoder = new TextDecoder()
  return decoder.decode(decryptedBuffer)
}

/**
 * 使用 Node.js crypto 模块加密
 */
function encryptWithNodeCrypto(data: string, key: string): string {
  const crypto = require('crypto')

  // 确保密钥长度为 32 字节
  const keyBuffer = Buffer.from(key.padEnd(32, '0').substring(0, 32))

  // 生成随机 IV
  const iv = crypto.randomBytes(12)

  // 创建加密器
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv)

  // 加密数据
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // 获取认证标签
  const authTag = cipher.getAuthTag()

  // 组合 IV、认证标签和加密数据
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'hex'),
  ])

  // 转换为 Base64
  return combined.toString('base64')
}

/**
 * 使用 Node.js crypto 模块解密
 */
function decryptWithNodeCrypto(encryptedData: string, key: string): string {
  const crypto = require('crypto')

  // 从 Base64 解码
  const combined = Buffer.from(encryptedData, 'base64')

  // 提取 IV、认证标签和加密数据
  const iv = combined.slice(0, 12)
  const authTag = combined.slice(12, 28)
  const encrypted = combined.slice(28)

  // 确保密钥长度为 32 字节
  const keyBuffer = Buffer.from(key.padEnd(32, '0').substring(0, 32))

  // 创建解密器
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv)
  decipher.setAuthTag(authTag)

  // 解密数据
  let decrypted = decipher.update(encrypted, undefined, 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * 生成随机密钥
 * @param length - 密钥长度（字节）
 * @returns 随机密钥（十六进制字符串）
 */
export function generateKey(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    // 浏览器环境
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  if (typeof require !== 'undefined') {
    // Node.js 环境
    const crypto = require('crypto')
    return crypto.randomBytes(length).toString('hex')
  }

  throw new Error('No crypto implementation available')
}

/**
 * 计算数据的哈希值
 * @param data - 要哈希的数据
 * @returns 哈希值（十六进制字符串）
 */
export async function hash(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // 浏览器环境
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
  }

  if (typeof require !== 'undefined') {
    // Node.js 环境
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  throw new Error('No crypto implementation available')
}

/**
 * 生成随机加密口令（至少32个字符）
 * @param length - 口令长度（默认32）
 * @returns 随机口令字符串
 */
export function generatePassphrase(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  
  if (typeof window !== 'undefined' && window.crypto) {
    // 浏览器环境
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => charset[byte % charset.length]).join('')
  }

  if (typeof require !== 'undefined') {
    // Node.js 环境
    const crypto = require('crypto')
    const bytes = crypto.randomBytes(length)
    return Array.from(bytes, (byte: number) => charset[byte % charset.length]).join('')
  }

  // 降级方案：使用 Math.random()
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)]
  }
  return result
}
