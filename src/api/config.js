import request from '@/utils/request';
export function listConfigs() {
    return request.get('/api/config');
}
export function getConfig(key) {
    return request.get(`/api/config/${key}`);
}
export function upsertConfig(key, data) {
    return request.put(`/api/config/${key}`, data);
}
export function refreshConfig() {
    return request.post('/api/config/refresh');
}
export function getBoundary() {
    return request.get('/api/system/boundary');
}
export function getSystemStatus() {
    return request.get('/api/system/status');
}
//# sourceMappingURL=config.js.map