import request from '@/utils/request';
export function getDashboard(params) {
    return request.get('/api/dashboard', { params });
}
//# sourceMappingURL=dashboard.js.map