/**
 * 沙箱管理器属性测试
 * Sandbox Manager Property-Based Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { SandboxManager } from '../sandbox-manager'

describe('SandboxManager Property Tests', () => {
  let manager: SandboxManager

  beforeEach(async () => {
    manager = new SandboxManager()
    await manager.initialize()
  })

  afterEach(() => {
    manager.close()
    
    // 清理 localStorage 中的测试文件
    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('sandbox_file:') || key.startsWith('sandbox_meta:'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  })

  /**
   * Feature: data-masking, Property 6: 沙箱路径验证
   *
   * 对于任何路径字符串，沙箱路径验证应该正确识别路径是否存在、是否可写，
   * 并且只有满足这两个条件的路径才能被设置为沙箱路径。
   *
   * **验证：需求 3.1**
   */
  it('Property 6: Sandbox path validation should correctly identify valid paths', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        async (path) => {
          const result = await manager.configureSandbox(path)

          // 有效路径应该配置成功
          expect(result.success).toBe(true)
          expect(result.sandboxPath).toBe(path)
          expect(result.error).toBeUndefined()

          // 配置后应该可以获取路径
          expect(manager.getSandboxPath()).toBe(path)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property 6: Should reject invalid sandbox paths', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryInvalidSandboxPath(),
        async (path) => {
          const result = await manager.configureSandbox(path)

          // 无效路径应该配置失败
          expect(result.success).toBe(false)
          expect(result.error).toBeDefined()
        },
      ),
      { numRuns: 50 },
    )
  })

  /**
   * Feature: data-masking, Property 7: 沙箱配置持久化
   *
   * 对于任何有效的沙箱路径，设置沙箱路径后重启应用程序，
   * 沙箱路径配置应该保持不变。
   *
   * **验证：需求 3.2**
   */
  it('Property 7: Sandbox configuration should persist across restarts', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        async (path) => {
          // 确保 manager 已初始化
          if (!manager['db']) {
            await manager.initialize()
          }
          
          // 配置沙箱
          await manager.configureSandbox(path)

          // 模拟重启：关闭并创建新实例
          manager.close()
          const newManager = new SandboxManager()
          await newManager.initialize()

          // 验证配置持久化
          expect(newManager.getSandboxPath()).toBe(path)

          newManager.close()
        },
      ),
      { numRuns: 30 },
    )
  })

  /**
   * Feature: data-masking, Property 8: 沙箱边界强制
   *
   * 对于任何文件操作（读取、写入、删除、上传），操作应该只能在配置的沙箱路径内执行，
   * 任何尝试访问沙箱外路径的操作都应该被拒绝。
   *
   * **验证：需求 3.3, 3.4, 3.5, 3.6, 4.1**
   */
  it('Property 8: Sandbox boundaries should be enforced for all operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (sandboxPath, fileName) => {
          // 配置沙箱
          await manager.configureSandbox(sandboxPath)

          // 沙箱内的文件应该可以操作
          const insidePath = `${sandboxPath}/${fileName}`
          expect(manager.validatePath(insidePath)).toBe(true)

          // 沙箱外的文件应该被拒绝
          const outsidePath = `/other/path/${fileName}`
          expect(manager.validatePath(outsidePath)).toBe(false)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property 8: File operations should reject paths outside sandbox', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (sandboxPath, content) => {
          // 配置沙箱
          await manager.configureSandbox(sandboxPath)

          // 尝试在沙箱外保存文件应该失败
          const outsideFileName = '../outside.txt'
          await expect(
            manager.saveFile(outsideFileName, content),
          ).rejects.toThrow('Path is outside sandbox')

          // 尝试读取沙箱外文件应该失败
          const outsidePath = '/other/path/file.txt'
          await expect(
            manager.readFile(outsidePath),
          ).rejects.toThrow('Path is outside sandbox')

          // 尝试删除沙箱外文件应该失败
          await expect(
            manager.deleteFile(outsidePath),
          ).rejects.toThrow('Path is outside sandbox')
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Save and read should be consistent', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.string({ minLength: 1, maxLength: 20 })
          .filter(s => {
            const trimmed = s.trim()
            return trimmed.length > 0 
              && !trimmed.startsWith('.') 
              && /^[a-zA-Z0-9_-]+$/.test(trimmed)
          })
          .map(s => `${s.trim()}.txt`),
        fc.string({ minLength: 0, maxLength: 1000 }),
        async (sandboxPath, fileName, content) => {
          // 配置沙箱
          await manager.configureSandbox(sandboxPath)

          // 保存文件
          const filePath = await manager.saveFile(fileName, content)

          // 读取文件
          const readContent = await manager.readFile(filePath)

          // 验证内容一致
          expect(readContent).toBe(content)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Deleted files should not be readable', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.string({ minLength: 1, maxLength: 20 })
          .filter(s => {
            const trimmed = s.trim()
            // 只允许字母、数字、连字符和下划线
            return trimmed.length > 0 
              && !trimmed.startsWith('.') 
              && /^[a-zA-Z0-9_-]+$/.test(trimmed)
          })
          .map(s => `${s.trim()}.txt`),
        fc.string({ minLength: 0, maxLength: 100 }),
        async (sandboxPath, fileName, content) => {
          // 配置沙箱
          const configResult = await manager.configureSandbox(sandboxPath)
          expect(configResult.success).toBe(true)

          // 保存文件
          const filePath = await manager.saveFile(fileName, content)
          expect(filePath).toBeTruthy()

          // 验证文件可读
          const beforeDelete = await manager.readFile(filePath)
          expect(beforeDelete).toBe(content)

          // 删除文件
          await manager.deleteFile(filePath)

          // 验证文件不可读
          await expect(manager.readFile(filePath)).rejects.toThrow('File not found')
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: List files should include all saved files', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 })
              .filter(s => {
                const trimmed = s.trim()
                // 只允许字母、数字、连字符和下划线
                return trimmed.length > 0 
                  && !trimmed.startsWith('.') 
                  && /^[a-zA-Z0-9_-]+$/.test(trimmed)
              })
              .map(s => `${s.trim()}.txt`),
            content: fc.string({ minLength: 0, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        async (sandboxPath, files) => {
          // 配置沙箱
          await manager.configureSandbox(sandboxPath)

          // 保存所有文件
          const savedPaths: string[] = []
          for (const file of files) {
            const path = await manager.saveFile(file.name, file.content)
            savedPaths.push(path)
          }

          // 列出文件
          const listedFiles = await manager.listFiles()

          // 验证所有保存的文件都在列表中
          for (const savedPath of savedPaths) {
            const found = listedFiles.some(f => f.path === savedPath)
            expect(found).toBe(true)
          }
        },
      ),
      { numRuns: 30 },
    )
  })

  it('Property: Path validation should be deterministic', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        fc.string({ minLength: 1, maxLength: 100 }),
        async (sandboxPath, testPath) => {
          // 配置沙箱
          await manager.configureSandbox(sandboxPath)

          // 多次验证应该返回相同结果
          const result1 = manager.validatePath(testPath)
          const result2 = manager.validatePath(testPath)
          const result3 = manager.validatePath(testPath)

          expect(result1).toBe(result2)
          expect(result2).toBe(result3)
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property: Sandbox reconfiguration should update path', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryValidSandboxPath(),
        arbitraryValidSandboxPath(),
        async (path1, path2) => {
          // 配置第一个沙箱
          await manager.configureSandbox(path1)
          expect(manager.getSandboxPath()).toBe(path1)

          // 重新配置第二个沙箱
          await manager.configureSandbox(path2)
          expect(manager.getSandboxPath()).toBe(path2)

          // 验证路径已更新
          const insidePath1 = `${path1}/file.txt`
          const insidePath2 = `${path2}/file.txt`

          // path1 下的文件现在应该无效（除非 path2 是 path1 的父目录）
          if (!path1.startsWith(path2)) {
            expect(manager.validatePath(insidePath1)).toBe(false)
          }

          // path2 下的文件应该有效
          expect(manager.validatePath(insidePath2)).toBe(true)
        },
      ),
      { numRuns: 30 },
    )
  })
})

// ==================== 自定义生成器 ====================

/**
 * 生成有效的沙箱路径
 */
function arbitraryValidSandboxPath(): fc.Arbitrary<string> {
  return fc.oneof(
    // Unix-style paths
    fc.string({ minLength: 1, maxLength: 20 }).map(s => `/home/user/${s.trim().replace(/[~\s.]/g, 'x') || 'sandbox'}`),
    fc.string({ minLength: 1, maxLength: 20 }).map(s => `/tmp/${s.trim().replace(/[~\s.]/g, 'x') || 'sandbox'}`),
    fc.string({ minLength: 1, maxLength: 20 }).map(s => `/var/data/${s.trim().replace(/[~\s.]/g, 'x') || 'sandbox'}`),
    
    // Windows-style paths
    fc.string({ minLength: 1, maxLength: 20 }).map(s => `D:\\Users\\user\\${s.trim().replace(/[~\s.]/g, 'x') || 'sandbox'}`),
    fc.string({ minLength: 1, maxLength: 20 }).map(s => `E:\\Data\\${s.trim().replace(/[~\s.]/g, 'x') || 'sandbox'}`),
  )
}

/**
 * 生成无效的沙箱路径
 */
function arbitraryInvalidSandboxPath(): fc.Arbitrary<string> {
  return fc.oneof(
    // 空路径
    fc.constant(''),
    fc.constant('   '),
    
    // 包含 .. 的路径
    fc.constant('/home/user/../admin'),
    fc.constant('/tmp/../etc'),
    
    // 包含 ~ 的路径
    fc.constant('~/sandbox'),
    fc.constant('~user/data'),
    
    // 系统保护目录
    fc.constant('/System/test'),
    fc.constant('C:\\Windows\\test'),
    fc.constant('C:\\Program Files\\test'),
    fc.constant('/usr/local'),
    fc.constant('/bin/test'),
    fc.constant('/sbin/test'),
    fc.constant('/etc/config'),
  )
}
