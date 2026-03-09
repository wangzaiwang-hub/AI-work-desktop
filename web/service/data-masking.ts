import { del, get, patch, post } from './base'

export type Fetcher<Data = unknown, Key = string> = (arg: Key) => Promise<Data>

// 数据脱敏规则类型定义
export type MaskingRule = {
  id: string
  name: string
  type: string
  pattern: string
  maskChar: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export type CreateMaskingRuleRequest = {
  name: string
  type: string
  pattern: string
  maskChar: string
  enabled: boolean
}

export type UpdateMaskingRuleRequest = {
  name?: string
  type?: string
  pattern?: string
  maskChar?: string
  enabled?: boolean
}

export type MaskingRulesResponse = {
  data: MaskingRule[]
  total: number
}

// TODO: 后端接口实现后，更新以下 API 路径
const API_PREFIX = '/console/api/data-masking'

/**
 * 获取数据脱敏规则列表
 */
export const fetchMaskingRules: Fetcher<MaskingRulesResponse, string> = (url: string) => {
  return get<MaskingRulesResponse>(url)
}

/**
 * 创建数据脱敏规则
 */
export const createMaskingRule = (body: CreateMaskingRuleRequest) => {
  return post<MaskingRule>(`${API_PREFIX}/rules`, { body })
}

/**
 * 更新数据脱敏规则
 */
export const updateMaskingRule = (ruleId: string, body: UpdateMaskingRuleRequest) => {
  return patch<MaskingRule>(`${API_PREFIX}/rules/${ruleId}`, { body })
}

/**
 * 删除数据脱敏规则
 */
export const deleteMaskingRule = (ruleId: string) => {
  return del<{ result: string }>(`${API_PREFIX}/rules/${ruleId}`)
}

/**
 * 获取单个数据脱敏规则详情
 */
export const fetchMaskingRuleDetail = (ruleId: string) => {
  return get<MaskingRule>(`${API_PREFIX}/rules/${ruleId}`)
}

/**
 * 批量启用/禁用规则
 */
export const batchUpdateMaskingRules = (ruleIds: string[], enabled: boolean) => {
  return post<{ success: boolean }>(`${API_PREFIX}/rules/batch`, {
    body: { ruleIds, enabled },
  })
}
