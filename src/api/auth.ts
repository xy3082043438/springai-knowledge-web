import request from '@/utils/request'
import type { AuthLoginRequest, AuthLoginResponse } from '@/types/api'

export function login(data: AuthLoginRequest) {
    return request.post<AuthLoginResponse>('/api/auth/login', data)
}

export function logout() {
    return request.post('/api/auth/logout')
}
