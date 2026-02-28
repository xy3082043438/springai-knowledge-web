import request from '@/utils/request'
import type {
    UserResponse,
    UserCreateRequest,
    UserUpdateRequest,
    MeUpdateRequest,
} from '@/types/api'

export function listUsers() {
    return request.get<UserResponse[]>('/api/users')
}

export function createUser(data: UserCreateRequest) {
    return request.post<UserResponse>('/api/users', data)
}

export function updateUser(id: number, data: UserUpdateRequest) {
    return request.patch<UserResponse>(`/api/users/${id}`, data)
}

export function getMe() {
    return request.get<UserResponse>('/api/users/me')
}

export function updateMe(data: MeUpdateRequest) {
    return request.patch<UserResponse>('/api/users/me', data)
}
