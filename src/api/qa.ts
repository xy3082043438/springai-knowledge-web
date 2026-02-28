import request from '@/utils/request'
import type { QaRequest, QaResponse } from '@/types/api'

export function ask(data: QaRequest) {
    return request.post<QaResponse>('/api/qa', data)
}
