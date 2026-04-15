import request from '@/utils/request'
import type { DashboardResponse } from '@/types/api'

export function getDashboard(params?: {
    trendDays?: number
    keywordDays?: number
    keywordLimit?: number
}) {
    return request.get<DashboardResponse>('/api/dashboard', { params })
}
