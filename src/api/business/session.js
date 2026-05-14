import request from '@/utils/request';
/**
 * 获取会话列表
 */
export function listSessions() {
    return request({
        url: '/api/aiqa/sessions',
        method: 'get'
    });
}
/**
 * 获取会话历史记录
 */
export function listSessionLogs(id) {
    return request({
        url: `/api/aiqa/sessions/${id}/logs`,
        method: 'get'
    });
}
/**
 * 删除会话
 */
export function deleteSession(id) {
    return request({
        url: `/api/aiqa/sessions/${id}`,
        method: 'delete'
    });
}
//# sourceMappingURL=session.js.map