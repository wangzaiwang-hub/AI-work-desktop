/**
 * 脱敏引擎 (Masking Engine)
 * 负责识别和替换敏感数据
 */

import { v4 as uuidv4 } from 'uuid'
import type {
  MaskingRule,
  MaskingResult,
  MaskingStrategy,
  ValidationResult,
  MappingEntry,
} from './types'
import { MaskingError } from './types'

/**
 * 脱敏引擎类
 */
export class MaskingEngine {
  private tokenCounter = 0

  /**
   * 对文件内容应用脱敏规则
   * @param content - 原始文件内容
   * @param rules - 要应用的脱敏规则数组
   * @returns 脱敏结果，包含脱敏后的内容和映射ID
   */
  async maskContent(content: string, rules: MaskingRule[]): Promise<MaskingResult> {
    try {
      // 验证输入
      if (typeof content !== 'string')
        throw new MaskingError('Content must be a string', 'INVALID_CONTENT')

      if (!Array.isArray(rules))
        throw new MaskingError('Rules must be an array', 'INVALID_RULES')

      // 过滤并排序规则：只使用启用的规则，按优先级排序
      const enabledRules = rules
        .filter(rule => rule.enabled)
        .sort((a, b) => a.priority - b.priority)

      // 如果没有启用的规则，直接返回原内容
      if (enabledRules.length === 0) {
        return {
          maskedContent: content,
          mappingId: uuidv4(),
          matchCount: 0,
          timestamp: new Date(),
        }
      }

      // 存储映射条目
      const entries: MappingEntry[] = []
      let maskedContent = content
      let totalMatches = 0

      // 按优先级应用每个规则
      for (const rule of enabledRules) {
        const result = this.applyRule(maskedContent, rule, entries)
        maskedContent = result.content
        totalMatches += result.matchCount
      }

      return {
        maskedContent,
        mappingId: uuidv4(),
        matchCount: totalMatches,
        timestamp: new Date(),
      }
    }
    catch (error) {
      if (error instanceof MaskingError)
        throw error

      throw new MaskingError(
        'Failed to mask content',
        'MASKING_FAILED',
        { originalError: error },
      )
    }
  }

  /**
   * 应用单个脱敏规则
   * @param content - 内容
   * @param rule - 脱敏规则
   * @param entries - 映射条目数组（会被修改）
   * @returns 脱敏后的内容和匹配数量
   */
  private applyRule(
    content: string,
    rule: MaskingRule,
    entries: MappingEntry[],
  ): { content: string; matchCount: number } {
    let matchCount = 0
    let result = content

    // 将 pattern 转换为 RegExp
    const regex = typeof rule.pattern === 'string'
      ? new RegExp(rule.pattern, 'g')
      : new RegExp(rule.pattern.source, 'g')

    // 查找所有匹配项
    const matches = Array.from(content.matchAll(regex))

    // 从后向前替换，避免位置偏移问题
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i]
      const originalValue = match[0]
      const position = match.index!

      // 生成脱敏值
      const maskedValue = this.generateMaskedValue(originalValue, rule.strategy)

      // 记录映射
      entries.push({
        originalValue,
        maskedValue,
        position,
        ruleId: rule.id,
        context: this.extractContext(content, position, originalValue.length),
      })

      // 替换内容
      result = result.substring(0, position)
        + maskedValue
        + result.substring(position + originalValue.length)

      matchCount++
    }

    return { content: result, matchCount }
  }

  /**
   * 根据策略生成脱敏值
   * @param originalValue - 原始值
   * @param strategy - 脱敏策略
   * @returns 脱敏值
   */
  private generateMaskedValue(originalValue: string, strategy: MaskingStrategy): string {
    switch (strategy.type) {
      case 'replacement':
        // 替换策略：用固定值替换
        return strategy.value

      case 'tokenization':
        // 令牌化策略：生成唯一令牌
        this.tokenCounter++
        return `${strategy.prefix}${String(this.tokenCounter).padStart(6, '0')}`

      case 'format-preserving':
        // 格式保留策略：保持原始格式
        return this.preserveFormat(originalValue, strategy.format)

      default:
        throw new MaskingError(
          `Unknown masking strategy: ${(strategy as any).type}`,
          'INVALID_STRATEGY',
        )
    }
  }

  /**
   * 格式保留脱敏
   * @param value - 原始值
   * @param format - 格式模板
   * @returns 格式保留的脱敏值
   */
  private preserveFormat(value: string, format: string): string {
    // 简单实现：保持字符类型（字母/数字/符号）
    return value
      .split('')
      .map((char) => {
        if (/[a-zA-Z]/.test(char))
          return 'X'
        if (/[0-9]/.test(char))
          return '0'
        return char
      })
      .join('')
  }

  /**
   * 提取上下文信息
   * @param content - 完整内容
   * @param position - 位置
   * @param length - 长度
   * @returns 上下文字符串
   */
  private extractContext(content: string, position: number, length: number): string {
    const contextLength = 20
    const start = Math.max(0, position - contextLength)
    const end = Math.min(content.length, position + length + contextLength)

    let context = content.substring(start, end)

    // 添加省略号
    if (start > 0)
      context = `...${context}`
    if (end < content.length)
      context = `${context}...`

    return context
  }

  /**
   * 验证脱敏规则的有效性
   * @param rule - 要验证的脱敏规则
   * @returns 验证结果
   */
  validateRule(rule: MaskingRule): ValidationResult {
    const errors: string[] = []

    // 验证必填字段
    if (!rule.id)
      errors.push('Rule ID is required')

    if (!rule.name)
      errors.push('Rule name is required')

    if (!rule.pattern)
      errors.push('Rule pattern is required')

    if (!rule.strategy)
      errors.push('Rule strategy is required')

    // 验证 pattern
    if (rule.pattern) {
      try {
        // 尝试创建 RegExp
        if (typeof rule.pattern === 'string')
          new RegExp(rule.pattern)
        else
          new RegExp(rule.pattern.source)
      }
      catch (error) {
        errors.push(`Invalid pattern: ${(error as Error).message}`)
      }
    }

    // 验证 strategy
    if (rule.strategy) {
      switch (rule.strategy.type) {
        case 'replacement':
          if (!rule.strategy.value && rule.strategy.value !== '')
            errors.push('Replacement strategy requires a value')
          break

        case 'tokenization':
          if (!rule.strategy.prefix)
            errors.push('Tokenization strategy requires a prefix')
          break

        case 'format-preserving':
          if (!rule.strategy.format)
            errors.push('Format-preserving strategy requires a format')
          break

        default:
          errors.push(`Unknown strategy type: ${(rule.strategy as any).type}`)
      }
    }

    // 验证优先级
    if (typeof rule.priority !== 'number' || rule.priority < 0)
      errors.push('Priority must be a non-negative number')

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * 重置令牌计数器
   */
  resetTokenCounter(): void {
    this.tokenCounter = 0
  }
}
