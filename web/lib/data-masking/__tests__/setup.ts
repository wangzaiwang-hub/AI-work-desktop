/**
 * 测试设置文件
 * Test Setup File
 */

import { beforeAll, afterAll, afterEach } from 'vitest'
import 'fake-indexeddb/auto'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

global.localStorage = localStorageMock as any

// Mock window.crypto for Web Crypto API
if (typeof global.crypto === 'undefined') {
  const nodeCrypto = require('crypto')
  global.crypto = {
    getRandomValues: (arr: any) => {
      const bytes = nodeCrypto.randomBytes(arr.length)
      arr.set(bytes)
      return arr
    },
    subtle: nodeCrypto.webcrypto.subtle,
  } as any
}

// 全局测试设置
beforeAll(() => {
  // 初始化测试环境
})

afterAll(() => {
  // 清理测试环境
})

afterEach(() => {
  // 每个测试后清理
  localStorageMock.clear()
})
