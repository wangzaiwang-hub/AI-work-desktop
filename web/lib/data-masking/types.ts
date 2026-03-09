/**
 * 数据脱敏功能核心类型定义
 * Data Masking Core Type Definitions
 */

// ==================== 脱敏规则相关类型 ====================

/**
 * 脱敏策略类型
 */
export type MaskingStrategy =
  | { type: 'replacement'; value: string }
  | { type: 'tokenization'; prefix: string }
  | { type: 'format-preserving'; format: string }
  | { type: 'partial-mask'; keepFirst: number; keepLast: number; maskChar: string }
  | { type: 'context-keyword'; keywords: string[]; value: string }

/**
 * 脱敏规则
 */
export interface MaskingRule {
  id: string
  name: string
  description: string
  pattern: string | RegExp
  strategy: MaskingStrategy
  enabled: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

/**
 * 规则验证结果
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

// ==================== 脱敏操作相关类型 ====================

/**
 * 脱敏结果
 */
export interface MaskingResult {
  maskedContent: string
  mappingId: string
  matchCount: number
  timestamp: Date
}

/**
 * 映射条目
 */
export interface MappingEntry {
  originalValue: string // 加密存储
  maskedValue: string
  position: number
  ruleId: string
  context?: string
}

/**
 * 映射数据
 */
export interface MappingData {
  id: string
  fileName: string
  filePath: string
  fileHash: string
  entries: MappingEntry[]
  createdAt: Date
  expiresAt?: Date
}

/**
 * 映射信息（列表显示用）
 */
export interface MappingInfo {
  id: string
  fileName: string
  entryCount: number
  createdAt: Date
}

// ==================== 沙箱相关类型 ====================

/**
 * 沙箱配置
 */
export interface SandboxConfig {
  path: string
  createdAt: Date
  lastModified: Date
  maxSize?: number
  autoCleanup: boolean
  cleanupDays?: number
}

/**
 * 配置结果
 */
export interface ConfigResult {
  success: boolean
  sandboxPath: string
  error?: string
}

/**
 * 文件信息
 */
export interface FileInfo {
  name: string
  path: string
  size: number
  createdAt: Date
  isMasked: boolean
}

// ==================== 文件上传相关类型 ====================

/**
 * 上传结果
 */
export interface UploadResult {
  success: boolean
  fileId: string
  error?: string
}

/**
 * 上传进度回调
 */
export type UploadProgressCallback = (progress: number) => void

// ==================== 反向替换相关类型 ====================

/**
 * 替换结果
 */
export interface SubstitutionResult {
  response: any
  substituted: string[]
  failed: string[]
  partial: boolean
}

// ==================== 日志相关类型 ====================

/**
 * 脱敏日志
 */
export interface MaskingLog {
  id: string
  operation: 'mask' | 'upload' | 'substitute' | 'delete'
  fileName: string
  mappingId?: string
  status: 'success' | 'failure' | 'partial'
  message: string
  timestamp: Date
  details?: any
}

// ==================== 错误类型 ====================

/**
 * 脱敏错误
 */
export class MaskingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'MaskingError'
  }
}

/**
 * 上传错误
 */
export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

/**
 * 沙箱错误
 */
export class SandboxError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'SandboxError'
  }
}

// ==================== 数据库架构类型 ====================

/**
 * 数据库脱敏规则记录
 */
export interface DBMaskingRule {
  id: string
  name: string
  description: string | null
  pattern: string
  strategy_type: string
  strategy_config: string
  enabled: number
  priority: number
  created_at: string
  updated_at: string
}

/**
 * 数据库映射记录
 */
export interface DBMapping {
  id: string
  file_name: string
  file_path: string
  file_hash: string
  created_at: string
  expires_at: string | null
}

/**
 * 数据库映射条目记录
 */
export interface DBMappingEntry {
  id: number
  mapping_id: string
  original_value_encrypted: string
  masked_value: string
  position: number
  rule_id: string
  context: string | null
}

/**
 * 数据库沙箱配置记录
 */
export interface DBSandboxConfig {
  id: number
  path: string
  created_at: string
  last_modified: string
  max_size: number | null
  auto_cleanup: number
  cleanup_days: number | null
}

/**
 * 数据库日志记录
 */
export interface DBMaskingLog {
  id: string
  operation: string
  file_name: string
  mapping_id: string | null
  status: string
  message: string
  timestamp: string
  details: string | null
}
