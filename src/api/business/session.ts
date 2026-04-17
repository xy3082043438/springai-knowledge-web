import request from '@/utils/request'
import type { QaLogResponse } from '@/types/api'

export interface ChatSession {
  id: number
  userId: number
  title: string
  latestQuestion: string
  createdAt: string
  updatedAt: string
}

/**
 * 获取会话列表
 */
export function listSessions() {
  return request<ChatSession[]>({
    url: '/api/aiqa/sessions',
    method: 'get'
  })
}

/**
 * 获取会话历史记录
 */
export function listSessionLogs(id: number) {
  return request<QaLogResponse[]>({
    url: `/api/aiqa/sessions/${id}/logs`,
    method: 'get'
  })
}

/**
 * 删除会话
 */
export function deleteSession(id: number) {
  return request<void>({
    url: `/api/aiqa/sessions/${id}`,
    method: 'delete'
  })
}
