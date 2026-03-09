/**
 * 沙箱管理器单元测试
 * Sandbox Manager Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SandboxManager } from '../sandbox-manager'
import { SandboxError } from '../types'

// 辅助函数：清理沙箱配置
async function clearSandboxConfig(manager: SandboxManager): Promise<void> {
  if (manager['db']) {
    try {
      const transaction = manager['db'].transaction(['sandbox_config'], 'readwrite')
      const store = transaction.objectStore('sandbox_config')
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      // 重置内部状态
      manager['sandboxPath'] = null
    }
    catch (error) {
      // 忽略清理错误
    }
  }
}

describe('SandboxManager', () => {
  let manager: SandboxManager

  beforeEach(async () => {
    manager = new SandboxManager()
    await manager.initialize()
  })

  afterEach(async () => {
    // 清理沙箱配置
    if (manager['db']) {
      try {
        const transaction = manager['db'].transaction(['sandbox_config'], 'readwrite')
        const store = transaction.objectStore('sandbox_config')
        await new Promise<void>((resolve, reject) => {
          const request = store.clear()
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      }
      catch (error) {
        // 忽略清理错误
      }
    }
    
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

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const newManager = new SandboxManager()
      await expect(newManager.initialize()).resolves.not.toThrow()
      newManager.close()
    })
  })

  describe('configureSandbox', () => {
    it('should configure a valid sandbox path', async () => {
      const result = await manager.configureSandbox('/home/user/sandbox')

      expect(result.success).toBe(true)
      expect(result.sandboxPath).toBe('/home/user/sandbox')
      expect(result.error).toBeUndefined()
    })

    it('should reject empty path', async () => {
      const result = await manager.configureSandbox('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Path cannot be empty')
    })

    it('should reject path with .. (parent directory)', async () => {
      const result = await manager.configureSandbox('/home/user/../admin')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Path contains invalid characters')
    })

    it('should reject path with ~ (home directory)', async () => {
      const result = await manager.configureSandbox('~/sandbox')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Path contains invalid characters')
    })

    it('should reject system protected directories', async () => {
      const protectedPaths = [
        '/System/test',
        'C:\\Windows\\test',
        'C:\\Program Files\\test',
        '/usr/local',
        '/bin/test',
        '/sbin/test',
        '/etc/config',
      ]

      for (const path of protectedPaths) {
        const result = await manager.configureSandbox(path)
        expect(result.success).toBe(false)
        expect(result.error).toBe('Cannot use system protected directory as sandbox')
      }
    })

    it('should update sandbox path when configured multiple times', async () => {
      await manager.configureSandbox('/home/user/sandbox1')
      const result = await manager.configureSandbox('/home/user/sandbox2')

      expect(result.success).toBe(true)
      expect(result.sandboxPath).toBe('/home/user/sandbox2')
      expect(manager.getSandboxPath()).toBe('/home/user/sandbox2')
    })

    it('should throw error when not initialized', async () => {
      const uninitializedManager = new SandboxManager()

      await expect(
        uninitializedManager.configureSandbox('/home/user/sandbox'),
      ).rejects.toThrow(SandboxError)
    })
  })

  describe('validatePath', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should validate path inside sandbox', () => {
      expect(manager.validatePath('/home/user/sandbox/file.txt')).toBe(true)
      expect(manager.validatePath('/home/user/sandbox/subdir/file.txt')).toBe(true)
    })

    it('should reject path outside sandbox', () => {
      expect(manager.validatePath('/home/user/other/file.txt')).toBe(false)
      expect(manager.validatePath('/tmp/file.txt')).toBe(false)
    })

    it('should reject path traversal attempts', () => {
      expect(manager.validatePath('/home/user/sandbox/../other/file.txt')).toBe(false)
    })

    it('should handle paths with trailing slashes', () => {
      expect(manager.validatePath('/home/user/sandbox/file.txt')).toBe(true)
    })

    it('should handle paths with backslashes (Windows)', () => {
      expect(manager.validatePath('/home/user/sandbox\\file.txt')).toBe(true)
    })

    it('should return false when sandbox not configured', () => {
      const newManager = new SandboxManager()
      expect(newManager.validatePath('/any/path')).toBe(false)
    })
  })

  describe('saveFile', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should save file in sandbox', async () => {
      const content = 'test content'
      const filePath = await manager.saveFile('test.txt', content)

      expect(filePath).toBe('/home/user/sandbox/test.txt')
      expect(manager.validatePath(filePath)).toBe(true)
    })

    it('should save file with subdirectory', async () => {
      const content = 'test content'
      const filePath = await manager.saveFile('subdir/test.txt', content)

      expect(filePath).toBe('/home/user/sandbox/subdir/test.txt')
      expect(manager.validatePath(filePath)).toBe(true)
    })

    it('should throw error when sandbox not configured', async () => {
      const newManager = new SandboxManager()
      await newManager.initialize()
      await clearSandboxConfig(newManager)

      await expect(newManager.saveFile('test.txt', 'content')).rejects.toThrow(
        SandboxError,
      )
      await expect(newManager.saveFile('test.txt', 'content')).rejects.toThrow(
        'Sandbox not configured',
      )

      newManager.close()
    })

    it('should throw error for path traversal attempt', async () => {
      await expect(
        manager.saveFile('../outside.txt', 'content'),
      ).rejects.toThrow(SandboxError)
      await expect(
        manager.saveFile('../outside.txt', 'content'),
      ).rejects.toThrow('Path is outside sandbox')
    })

    it('should save multiple files', async () => {
      await manager.saveFile('file1.txt', 'content1')
      await manager.saveFile('file2.txt', 'content2')
      await manager.saveFile('file3.txt', 'content3')

      const files = await manager.listFiles()
      expect(files.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('readFile', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should read saved file', async () => {
      const content = 'test content'
      const filePath = await manager.saveFile('test.txt', content)

      const readContent = await manager.readFile(filePath)
      expect(readContent).toBe(content)
    })

    it('should throw error for non-existent file', async () => {
      await expect(
        manager.readFile('/home/user/sandbox/nonexistent.txt'),
      ).rejects.toThrow(SandboxError)
      await expect(
        manager.readFile('/home/user/sandbox/nonexistent.txt'),
      ).rejects.toThrow('File not found')
    })

    it('should throw error when sandbox not configured', async () => {
      const newManager = new SandboxManager()
      await newManager.initialize()
      await clearSandboxConfig(newManager)

      await expect(
        newManager.readFile('/any/path/file.txt'),
      ).rejects.toThrow(SandboxError)
      await expect(
        newManager.readFile('/any/path/file.txt'),
      ).rejects.toThrow('Sandbox not configured')

      newManager.close()
    })

    it('should throw error for path outside sandbox', async () => {
      await expect(
        manager.readFile('/home/user/other/file.txt'),
      ).rejects.toThrow(SandboxError)
      await expect(
        manager.readFile('/home/user/other/file.txt'),
      ).rejects.toThrow('Path is outside sandbox')
    })

    it('should read file with special characters', async () => {
      const content = 'Special: @#$%^&*()_+-=[]{}|;:,.<>?'
      const filePath = await manager.saveFile('special.txt', content)

      const readContent = await manager.readFile(filePath)
      expect(readContent).toBe(content)
    })
  })

  describe('listFiles', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should list saved files', async () => {
      await manager.saveFile('file1.txt', 'content1')
      await manager.saveFile('file2.txt', 'content2')

      const files = await manager.listFiles()

      expect(files.length).toBeGreaterThanOrEqual(2)
      expect(files.some(f => f.name === 'file1.txt')).toBe(true)
      expect(files.some(f => f.name === 'file2.txt')).toBe(true)
    })

    it('should return empty array when no files exist', async () => {
      const files = await manager.listFiles()
      expect(files).toBeInstanceOf(Array)
    })

    it('should include file metadata', async () => {
      const content = 'test content'
      await manager.saveFile('test.txt', content)

      const files = await manager.listFiles()
      const file = files.find(f => f.name === 'test.txt')

      expect(file).toBeDefined()
      expect(file!.path).toBe('/home/user/sandbox/test.txt')
      expect(file!.size).toBe(content.length)
      expect(file!.createdAt).toBeInstanceOf(Date)
      expect(file!.isMasked).toBe(true)
    })

    it('should throw error when sandbox not configured', async () => {
      const newManager = new SandboxManager()
      await newManager.initialize()
      await clearSandboxConfig(newManager)

      await expect(newManager.listFiles()).rejects.toThrow(SandboxError)
      await expect(newManager.listFiles()).rejects.toThrow('Sandbox not configured')

      newManager.close()
    })
  })

  describe('deleteFile', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should delete saved file', async () => {
      const filePath = await manager.saveFile('test.txt', 'content')

      // 验证文件存在
      const contentBefore = await manager.readFile(filePath)
      expect(contentBefore).toBe('content')

      // 删除文件
      await manager.deleteFile(filePath)

      // 验证文件已删除
      await expect(manager.readFile(filePath)).rejects.toThrow('File not found')
    })

    it('should not throw error when deleting non-existent file', async () => {
      await expect(
        manager.deleteFile('/home/user/sandbox/nonexistent.txt'),
      ).resolves.not.toThrow()
    })

    it('should throw error when sandbox not configured', async () => {
      const newManager = new SandboxManager()
      await newManager.initialize()
      await clearSandboxConfig(newManager)

      await expect(
        newManager.deleteFile('/any/path/file.txt'),
      ).rejects.toThrow(SandboxError)
      await expect(
        newManager.deleteFile('/any/path/file.txt'),
      ).rejects.toThrow('Sandbox not configured')

      newManager.close()
    })

    it('should throw error for path outside sandbox', async () => {
      await expect(
        manager.deleteFile('/home/user/other/file.txt'),
      ).rejects.toThrow(SandboxError)
      await expect(
        manager.deleteFile('/home/user/other/file.txt'),
      ).rejects.toThrow('Path is outside sandbox')
    })

    it('should remove file from list after deletion', async () => {
      await manager.saveFile('file1.txt', 'content1')
      await manager.saveFile('file2.txt', 'content2')

      const filesBefore = await manager.listFiles()
      expect(filesBefore.some(f => f.name === 'file1.txt')).toBe(true)

      await manager.deleteFile('/home/user/sandbox/file1.txt')

      const filesAfter = await manager.listFiles()
      expect(filesAfter.some(f => f.name === 'file1.txt')).toBe(false)
      expect(filesAfter.some(f => f.name === 'file2.txt')).toBe(true)
    })
  })

  describe('getSandboxPath', () => {
    it('should return null when not configured', () => {
      const newManager = new SandboxManager()
      expect(newManager.getSandboxPath()).toBeNull()
    })

    it('should return configured path', async () => {
      await manager.configureSandbox('/home/user/sandbox')
      expect(manager.getSandboxPath()).toBe('/home/user/sandbox')
    })
  })

  describe('close', () => {
    it('should close database connection', () => {
      expect(() => manager.close()).not.toThrow()
    })

    it('should throw error when using manager after close', async () => {
      manager.close()

      await expect(
        manager.configureSandbox('/home/user/sandbox'),
      ).rejects.toThrow(SandboxError)
    })
  })

  describe('path normalization', () => {
    beforeEach(async () => {
      await manager.configureSandbox('/home/user/sandbox')
    })

    it('should handle paths with multiple slashes', () => {
      expect(manager.validatePath('/home/user/sandbox//file.txt')).toBe(true)
      expect(manager.validatePath('/home/user/sandbox///subdir//file.txt')).toBe(true)
    })

    it('should handle paths with trailing slashes', () => {
      expect(manager.validatePath('/home/user/sandbox/file.txt/')).toBe(true)
    })

    it('should handle mixed slashes (Windows/Unix)', () => {
      expect(manager.validatePath('/home/user/sandbox\\file.txt')).toBe(true)
      expect(manager.validatePath('/home/user/sandbox/subdir\\file.txt')).toBe(true)
    })
  })
})
