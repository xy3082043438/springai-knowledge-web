import request from '@/utils/request';
export function listUsers() {
    return request.get('/api/users');
}
export function createUser(data) {
    return request.post('/api/users', data);
}
export function updateUser(id, data) {
    return request.patch(`/api/users/${id}`, data);
}
export function deleteUser(id) {
    return request.delete(`/api/users/${id}`);
}
export function getMe() {
    return request.get('/api/users/me');
}
export function updateMe(data) {
    return request.patch('/api/users/me', data);
}
//# sourceMappingURL=user.js.map