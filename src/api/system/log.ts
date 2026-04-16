import request from '@/utils/request'
import type {
    QaLogResponse,
    OperationLogResponse,
    PageResponse,
} from '@/types/api'

export function searchQaLogs(params?: {
    userId?: number
    from?: string
    to?: string
    page?: number
    size?: number
}) {
    return request.get<PageResponse<QaLogResponse>>('/api/logs/qa', { params })
}

export function searchOperationLogs(params?: {
    userId?: number
    from?: string
    to?: string
    page?: number
    size?: number
}) {
    return request.get<PageResponse<OperationLogResponse>>('/api/logs/operations', { params })
}

export function exportQaLogs(params?: {
    userId?: number
    from?: string
    to?: string
}) {
    return request.get('/api/logs/qa/export', { 
        params,
        responseType: 'blob' 
    })
}



export function exportOperationLogs(params?: {
    userId?: number
    from?: string
    to?: string
}) {
    return request.get('/api/logs/operations/export', { 
        params,
        responseType: 'blob' 
    })
}
