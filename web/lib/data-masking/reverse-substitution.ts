/**
 * 反向替换器
 * Reverse Substitution
 * 
 * 在 Dify 后端响应中识别脱敏值并恢复原始值
 */

import type { SubstitutionResult } from './types'
import { MaskingError } from './types'
import type { MappingStore } from './mapping-store'

/**
 * 反向替换器类
 */
export class ReverseSubstitution {
  private mappingStore: MappingStore

  constructor(mappingStore: MappingStore) {
    this.mappingStore = mappingStore
  }

  /**
   * 对响应数据执行反向替换
   * @param response - Dify 后端响应
   * @param mappingId - 映射ID
   * @returns 恢复后的响应
   */
  async substitute(response: any, mappingId: string): Promise<SubstitutionResult> {
    // 识别响应中的脱敏值
    const maskedValues = this.identifyMaskedValues(response)
    
    const substituted: string[] = []
    const failed: string[] = []
    
    // 创建替换映射表
    const replacementMap = new Map<string, string>()
    
    // 批量查询所有脱敏值的原始值
    for (const maskedValue of maskedValues) {
      try {
        const originalValue = await this.mappingStore.findOriginalValue(
          maskedValue,
          mappingId,
        )
        
        if (originalValue) {
          replacementMap.set(maskedValue, originalValue)
          substituted.push(maskedValue)
        }
        else {
          failed.push(maskedValue)
        }
      }
      catch (error) {
        failed.push(maskedValue)
        console.warn(`Failed to find original value for masked value: ${maskedValue}`, error)
      }
    }
    
    // 执行替换
    const substitutedResponse = this.performSubstitution(response, replacementMap)
    
    return {
      response: substitutedResponse,
      substituted,
      failed,
      partial: failed.length > 0,
    }
  }

  /**
   * 识别响应中的脱敏值
   * @param response - 响应数据
   * @returns 脱敏值列表
   */
  identifyMaskedValues(response: any): string[] {
    const maskedValues = new Set<string>()
    
    // 定义脱敏值的模式（按优先级排序，更具体的模式在前）
    const patterns = [
      /\*\*\*@\*\*\*\.\*\*\*/g,           // Email replacement: ***@***.***
      /XXX-XXX-XXXX/g,                     // Phone replacement: XXX-XXX-XXXX
      /TOKEN_[A-Za-z0-9]+/g,               // Tokenization: TOKEN_xxx
      /MASKED_\d+/g,                       // Format-preserving: MASKED_123
    ]
    
    this.extractMaskedValues(response, patterns, maskedValues)
    
    return Array.from(maskedValues)
  }

  // ==================== 私有方法 ====================

  /**
   * 递归提取脱敏值
   */
  private extractMaskedValues(
    data: any,
    patterns: RegExp[],
    maskedValues: Set<string>,
  ): void {
    if (typeof data === 'string') {
      // 对字符串应用所有模式
      for (const pattern of patterns) {
        const matches = data.match(pattern)
        if (matches) {
          matches.forEach(match => maskedValues.add(match))
        }
      }
    }
    else if (Array.isArray(data)) {
      // 递归处理数组
      data.forEach(item => this.extractMaskedValues(item, patterns, maskedValues))
    }
    else if (data && typeof data === 'object') {
      // 递归处理对象
      Object.values(data).forEach(value =>
        this.extractMaskedValues(value, patterns, maskedValues),
      )
    }
  }

  /**
   * 执行替换操作
   */
  private performSubstitution(data: any, replacementMap: Map<string, string>): any {
    if (typeof data === 'string') {
      // 替换字符串中的所有脱敏值
      let result = data
      for (const [maskedValue, originalValue] of replacementMap.entries()) {
        // 使用全局替换
        result = result.split(maskedValue).join(originalValue)
      }
      return result
    }
    else if (Array.isArray(data)) {
      // 递归处理数组
      return data.map(item => this.performSubstitution(item, replacementMap))
    }
    else if (data && typeof data === 'object') {
      // 递归处理对象
      const result: any = {}
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.performSubstitution(value, replacementMap)
      }
      return result
    }
    
    // 其他类型直接返回
    return data
  }
}
