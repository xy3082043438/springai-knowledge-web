import request from '@/utils/request'
import type {
    SystemConfigRequest,
    SystemConfigResponse,
    SystemStatusResponse,
} from '@/types/api'

export function listConfigs() {
    return request.get<SystemConfigResponse[]>('/api/config')
}

export function upsertConfig(key: string, data: SystemConfigRequest) {
    return request.put<SystemConfigResponse>(`/api/config/${key}`, data)
}

export function refreshConfig() {
    return request.post('/api/config/refresh')
}

export function getSystemStatus() {
    return request.get<SystemStatusResponse>('/api/system/status')
}
