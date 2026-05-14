import request from '@/utils/request';
export function createFeedback(data) {
    return request.post('/api/feedback', data);
}
export function searchFeedback(params) {
    return request.get('/api/feedback', { params });
}
export function exportFeedback(params) {
    return request.get('/api/feedback/export', {
        params,
        responseType: 'blob'
    });
}
//# sourceMappingURL=feedback.js.map