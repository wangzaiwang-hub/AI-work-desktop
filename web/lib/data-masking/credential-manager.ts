/**
 * 凭据管理器
 * Credential Manager
 *
 * 用于安全存储和检索加密密钥
 */

import { Buffer } from 'node:buffer'
import { generateKey } from './crypto-utils'

const STORAGE_KEY = 'data-masking-encryption-key'

/**
 * 凭据管理器类
 */
export class CredentialManager {
  /**
   * 存储加密密钥
   * @param key - 加密密钥
   */
  async storeKey(key: string): Promise<void> {
    if (typeof window !== 'undefined' && (window as unknown as { electron?: unknown }).electron) {
      const { safeStorage } = await import('electron')
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(key)
        localStorage.setItem(STORAGE_KEY, encrypted.toString('base64'))
        return
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, key)
      return
    }

    // 在 Node.js 环境中，使用环境变量或配置文件
    // 这里简化处理，实际应该使用更安全的方式
    if (typeof process !== 'undefined') {
      process.env[STORAGE_KEY] = key
      return
    }

    throw new Error('No credential storage available')
  }

  /**
   * 检索加密密钥
   * @returns 加密密钥，如果不存在则返回 null
   */
  async retrieveKey(): Promise<string | null> {
    if (typeof window !== 'undefined' && (window as unknown as { electron?: unknown }).electron) {
      const { safeStorage } = await import('electron')
      const encrypted = localStorage.getItem(STORAGE_KEY)
      if (encrypted && safeStorage.isEncryptionAvailable()) {
        const buffer = Buffer.from(encrypted, 'base64')
        return safeStorage.decryptString(buffer)
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const key = localStorage.getItem(STORAGE_KEY)
      if (key)
        return key

      const newKey = generateKey()
      await this.storeKey(newKey)
      return newKey
    }

    // 在 Node.js 环境中，从环境变量读取
    if (typeof process !== 'undefined') {
      const key = process.env[STORAGE_KEY]
      if (key)
        return key

      // 如果没有密钥，生成一个新的
      const newKey = generateKey()
      await this.storeKey(newKey)
      return newKey
    }

    return null
  }

  /**
   * 删除加密密钥
   */
  async deleteKey(): Promise<void> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    if (typeof process !== 'undefined') {
      delete process.env[STORAGE_KEY]
    }
  }

  /**
   * 检查是否存在加密密钥
   * @returns 如果存在密钥返回 true
   */
  async hasKey(): Promise<boolean> {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) !== null
    }

    if (typeof process !== 'undefined') {
      return process.env[STORAGE_KEY] !== undefined
    }

    return false
  }
}

/**
 * 获取全局凭据管理器实例
 */
let globalCredentialManager: CredentialManager | null = null

export function getCredentialManager(): CredentialManager {
  if (!globalCredentialManager) {
    globalCredentialManager = new CredentialManager()
  }
  return globalCredentialManager
}
