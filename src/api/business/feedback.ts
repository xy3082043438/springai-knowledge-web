import request from '@/utils/request'
import type {
    QaFeedbackRequest,
    QaFeedbackResponse,
    PageResponse,
} from '@/types/api'

export function createFeedback(data: QaFeedbackRequest) {
    return request.post<QaFeedbackResponse>('/api/feedback', data)
}

export function searchFeedback(params?: {
    userId?: number
    from?: string
    to?: string
    page?: number
    size?: number
}) {
    return request.get<PageResponse<QaFeedbackResponse>>('/api/feedback', { params })
}

export function exportFeedback(params?: {
    userId?: number
    from?: string
    to?: string
}) {
    return request.get('/api/feedback/export', { 
        params,
        responseType: 'blob' 
    })
}
