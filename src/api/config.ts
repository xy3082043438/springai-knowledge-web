import request from '@/utils/request'
import type {
    SystemConfigRequest,
    SystemConfigResponse,
    SystemBoundaryResponse,
} from '@/types/api'

export function listConfigs() {
    return request.get<SystemConfigResponse[]>('/api/config')
}

export function getConfig(key: string) {
    return request.get<SystemConfigResponse>(`/api/config/${key}`)
}

export function upsertConfig(key: string, data: SystemConfigRequest) {
    return request.put<SystemConfigResponse>(`/api/config/${key}`, data)
}

export function refreshConfig() {
    return request.post('/api/config/refresh')
}

export function getBoundary() {
    return request.get<SystemBoundaryResponse>('/api/system/boundary')
}
