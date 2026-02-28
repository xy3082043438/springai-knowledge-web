import request from '@/utils/request'
import type {
    RoleResponse,
    RoleCreateRequest,
    RoleUpdateRequest,
} from '@/types/api'

export function listRoles() {
    return request.get<RoleResponse[]>('/api/roles')
}

export function getRole(id: number) {
    return request.get<RoleResponse>(`/api/roles/${id}`)
}

export function createRole(data: RoleCreateRequest) {
    return request.post<RoleResponse>('/api/roles', data)
}

export function updateRole(id: number, data: RoleUpdateRequest) {
    return request.patch<RoleResponse>(`/api/roles/${id}`, data)
}
