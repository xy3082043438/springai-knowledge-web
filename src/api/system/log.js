import request from '@/utils/request';
export function searchQaLogs(params) {
    return request.get('/api/logs/qa', { params });
}
export function searchOperationLogs(params) {
    return request.get('/api/logs/operations', { params });
}
//# sourceMappingURL=log.js.map