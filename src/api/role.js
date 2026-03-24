import request from '@/utils/request';
export function listRoles() {
    return request.get('/api/roles');
}
export function getRole(id) {
    return request.get(`/api/roles/${id}`);
}
export function createRole(data) {
    return request.post('/api/roles', data);
}
export function updateRole(id, data) {
    return request.patch(`/api/roles/${id}`, data);
}
//# sourceMappingURL=role.js.map