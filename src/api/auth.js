import request from '@/utils/request';
export function login(data) {
    return request.post('/api/auth/login', data);
}
export function logout() {
    return request.post('/api/auth/logout');
}
export function getCaptcha() {
    return request.get('/api/auth/captcha');
}
//# sourceMappingURL=auth.js.map