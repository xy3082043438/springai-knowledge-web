import request from '@/utils/request';
export function searchQaLogs(params) {
    return request.get('/api/logs/qa', { params });
}
export function searchOperationLogs(params) {
    return request.get('/api/logs/operations', { params });
}
export function exportQaLogs(params) {
    return request.get('/api/logs/qa/export', {
        params,
        responseType: 'blob'
    });
}
export function exportOperationLogs(params) {
    return request.get('/api/logs/operations/export', {
        params,
        responseType: 'blob'
    });
}
//# sourceMappingURL=log.js.map