/**
 * 规则管理器
 * Rules Manager
 * 
 * 管理脱敏规则的CRUD操作
 */

import type { MaskingRule, ValidationResult } from './types'
import { MaskingError } from './types'
import { getIndexedDB, STORES, getAllRecords, getRecord, addRecord, updateRecord, deleteRecord } from './indexeddb'
import { v4 as uuidv4 } from 'uuid'

/**
 * 规则管理器类
 */
export class RulesManager {
  private db: IDBDatabase | null = null

  /**
   * 初始化规则管理器
   */
  async initialize(): Promise<void> {
    this.db = await getIndexedDB()
  }

  /**
   * 创建脱敏规则
   * @param rule - 规则数据（不包含id、createdAt、updatedAt）
   * @returns 创建的规则
   */
  async createRule(rule: Omit<MaskingRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaskingRule> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    // 验证规则
    const validation = this.validateRuleData(rule)
    if (!validation.valid) {
      throw new MaskingError(
        `Invalid rule: ${validation.errors.join(', ')}`,
        'INVALID_RULE',
        { errors: validation.errors },
      )
    }

    const now = new Date()
    const newRule: MaskingRule = {
      ...rule,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }

    try {
      // 存储到数据库
      await addRecord(this.db, STORES.MASKING_RULES, {
        id: newRule.id,
        name: newRule.name,
        description: newRule.description,
        pattern: typeof newRule.pattern === 'string' ? newRule.pattern : newRule.pattern.source,
        strategy_type: newRule.strategy.type,
        strategy_config: JSON.stringify(newRule.strategy),
        enabled: newRule.enabled ? 1 : 0,
        priority: newRule.priority,
        created_at: newRule.createdAt.toISOString(),
        updated_at: newRule.updatedAt.toISOString(),
      })

      return newRule
    }
    catch (error) {
      throw new MaskingError(
        'Failed to create rule',
        'CREATE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 获取所有规则
   * @returns 规则列表
   */
  async getAllRules(): Promise<MaskingRule[]> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    try {
      const records = await getAllRecords(this.db, STORES.MASKING_RULES)
      return records.map(this.dbRecordToRule)
    }
    catch (error) {
      throw new MaskingError(
        'Failed to fetch rules',
        'FETCH_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 获取单个规则
   * @param ruleId - 规则ID
   * @returns 规则数据，如果不存在则返回null
   */
  async getRule(ruleId: string): Promise<MaskingRule | null> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    try {
      const record = await getRecord(this.db, STORES.MASKING_RULES, ruleId)
      if (!record) {
        return null
      }
      return this.dbRecordToRule(record)
    }
    catch (error) {
      throw new MaskingError(
        'Failed to fetch rule',
        'FETCH_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 更新规则
   * @param ruleId - 规则ID
   * @param updates - 要更新的字段
   * @returns 更新后的规则
   */
  async updateRule(
    ruleId: string,
    updates: Partial<Omit<MaskingRule, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<MaskingRule> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    // 获取现有规则
    const existingRule = await this.getRule(ruleId)
    if (!existingRule) {
      throw new MaskingError('Rule not found', 'NOT_FOUND', { ruleId })
    }

    // 合并更新
    const updatedRule: MaskingRule = {
      ...existingRule,
      ...updates,
      id: ruleId,
      createdAt: existingRule.createdAt,
      updatedAt: new Date(),
    }

    // 验证更新后的规则
    const validation = this.validateRuleData(updatedRule)
    if (!validation.valid) {
      throw new MaskingError(
        `Invalid rule updates: ${validation.errors.join(', ')}`,
        'INVALID_RULE',
        { errors: validation.errors },
      )
    }

    try {
      // 更新数据库
      await updateRecord(this.db, STORES.MASKING_RULES, {
        id: updatedRule.id,
        name: updatedRule.name,
        description: updatedRule.description,
        pattern: typeof updatedRule.pattern === 'string' ? updatedRule.pattern : updatedRule.pattern.source,
        strategy_type: updatedRule.strategy.type,
        strategy_config: JSON.stringify(updatedRule.strategy),
        enabled: updatedRule.enabled ? 1 : 0,
        priority: updatedRule.priority,
        created_at: updatedRule.createdAt.toISOString(),
        updated_at: updatedRule.updatedAt.toISOString(),
      })

      return updatedRule
    }
    catch (error) {
      throw new MaskingError(
        'Failed to update rule',
        'UPDATE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 删除规则
   * @param ruleId - 规则ID
   */
  async deleteRule(ruleId: string): Promise<void> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    try {
      await deleteRecord(this.db, STORES.MASKING_RULES, ruleId)
    }
    catch (error) {
      throw new MaskingError(
        'Failed to delete rule',
        'DELETE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 获取启用的规则
   * @returns 启用的规则列表
   */
  async getEnabledRules(): Promise<MaskingRule[]> {
    const allRules = await this.getAllRules()
    return allRules.filter(rule => rule.enabled)
  }

  /**
   * 批量更新规则状态
   * @param ruleIds - 规则ID列表
   * @param enabled - 是否启用
   */
  async batchUpdateRuleStatus(ruleIds: string[], enabled: boolean): Promise<void> {
    if (!this.db) {
      throw new MaskingError('Rules manager not initialized', 'NOT_INITIALIZED')
    }

    try {
      for (const ruleId of ruleIds) {
        await this.updateRule(ruleId, { enabled })
      }
    }
    catch (error) {
      throw new MaskingError(
        'Failed to batch update rules',
        'BATCH_UPDATE_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 验证规则数据
   */
  private validateRuleData(rule: Partial<MaskingRule>): ValidationResult {
    const errors: string[] = []

    if (!rule.name || rule.name.trim().length === 0) {
      errors.push('Rule name is required')
    }

    if (!rule.pattern) {
      errors.push('Pattern is required')
    }
    else {
      // 验证正则表达式
      try {
        if (typeof rule.pattern === 'string') {
          new RegExp(rule.pattern)
        }
      }
      catch (error) {
        errors.push('Invalid regular expression pattern')
      }
    }

    if (!rule.strategy) {
      errors.push('Strategy is required')
    }
    else {
      // 验证策略配置
      if (!['replacement', 'tokenization', 'format-preserving'].includes(rule.strategy.type)) {
        errors.push('Invalid strategy type')
      }
    }

    if (rule.priority !== undefined && (rule.priority < 0 || !Number.isInteger(rule.priority))) {
      errors.push('Priority must be a non-negative integer')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * 将数据库记录转换为规则对象
   */
  private dbRecordToRule(record: any): MaskingRule {
    const strategy = JSON.parse(record.strategy_config)
    
    return {
      id: record.id,
      name: record.name,
      description: record.description || '',
      pattern: record.pattern,
      strategy,
      enabled: record.enabled === 1,
      priority: record.priority,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    }
  }
}

/**
 * 预定义规则模板
 */
export const RULE_TEMPLATES = {
  phone: {
    name: '手机号码',
    description: '匹配中国手机号，保留前3后4位',
    pattern: '1[3-9]\\d{9}',
    strategy: { type: 'partial-mask' as const, keepFirst: 3, keepLast: 4, maskChar: '*' },
    enabled: true,
    priority: 1,
  },
  email: {
    name: '邮箱地址',
    description: '匹配邮箱，保留首字母和域名',
    pattern: '[\\w.-]+@[\\w.-]+\\.\\w+',
    strategy: { type: 'partial-mask' as const, keepFirst: 1, keepLast: 0, maskChar: '*' },
    enabled: true,
    priority: 2,
  },
  idCard: {
    name: '身份证号',
    description: '匹配18位身份证号，保留前6后4位',
    pattern: '[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]',
    strategy: { type: 'partial-mask' as const, keepFirst: 6, keepLast: 4, maskChar: '*' },
    enabled: true,
    priority: 3,
  },
  bankCard: {
    name: '银行卡号',
    description: '匹配16-19位银行卡号，保留后4位',
    pattern: '\\b[1-9]\\d{15,18}\\b',
    strategy: { type: 'partial-mask' as const, keepFirst: 0, keepLast: 4, maskChar: '*' },
    enabled: true,
    priority: 4,
  },
  ipAddress: {
    name: 'IP地址',
    description: '匹配IPv4地址，替换后两段',
    pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b',
    strategy: { type: 'replacement' as const, value: '$1.*.*' },
    enabled: true,
    priority: 5,
  },
  contextName: {
    name: '上下文人名',
    description: '仅在"姓名/联系人/负责人/经办人"等关键词后匹配中文姓名',
    pattern: '(?:姓名|联系人|负责人|经办人|签字|审批人|项目经理|编制人|审核人|批准人)[：:：\\s]*([\\u4e00-\\u9fa5]{2,4})',
    strategy: { type: 'context-keyword' as const, keywords: ['姓名', '联系人', '负责人', '经办人', '签字', '审批人'], value: '***' },
    enabled: true,
    priority: 6,
  },
  contextPhone: {
    name: '上下文电话',
    description: '仅在"电话/手机/联系方式/Tel"等关键词后匹配号码',
    pattern: '(?:电话|手机|联系方式|联系电话|Tel|TEL|tel)[：:：\\s]*([\\d-]{7,13})',
    strategy: { type: 'context-keyword' as const, keywords: ['电话', '手机', '联系方式', 'Tel'], value: '***-****-****' },
    enabled: true,
    priority: 7,
  },
  contextAddress: {
    name: '上下文地址',
    description: '仅在"地址/住址"等关键词后匹配地址文本',
    pattern: '(?:地址|住址|通讯地址|联系地址)[：:：\\s]*([^\\n]{5,50})',
    strategy: { type: 'context-keyword' as const, keywords: ['地址', '住址'], value: '[地址已脱敏]' },
    enabled: true,
    priority: 8,
  },
  companyProject: {
    name: '公司/项目名称',
    description: '匹配"XX公司/XX有限公司/XX项目"等，替换为代号',
    pattern: '[\\u4e00-\\u9fa5]{2,10}(?:有限公司|股份公司|集团|公司|项目部)',
    strategy: { type: 'tokenization' as const, prefix: 'ORG' },
    enabled: false,
    priority: 9,
  },
  amount: {
    name: '金额数字',
    description: '匹配带单位的金额（万元/元/¥），保留量级',
    pattern: '[¥￥]?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{1,2})?\\s*(?:万元|元|万)',
    strategy: { type: 'replacement' as const, value: '[金额已脱敏]' },
    enabled: false,
    priority: 10,
  },
}
