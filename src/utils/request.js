import axios from 'axios';
import { ElMessage } from 'element-plus';
const request = axios.create({
    baseURL: '',
    timeout: 30000,
});
// 请求拦截器 — 自动注入 JWT token
request.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
/**
 * 常见英文后端消息 → 友好中文映射
 * 后端历史遗留或第三方库可能返回英文，在此做最终兜底翻译
 */
const MESSAGE_MAP = {
    'username already exists': '该用户名已被使用，请换一个',
    'user not found': '用户不存在',
    'role not found': '指定的角色不存在',
    'role already exists': '该角色名称已存在',
    'system role cannot be deleted': '系统内置角色不可删除',
    'system role name cannot be changed': '系统内置角色名称不可修改',
    'role is assigned to users': '该角色下还有关联用户，请先移除',
    'role is referenced by documents': '该角色下还有关联文档，请先移除',
    'role name is required': '请输入角色名称',
    'role name cannot be blank': '角色名称不能为空',
    'current user cannot be deleted': '不能删除当前登录的用户',
    'role id is missing': '角色数据异常，请联系管理员',
    'access denied': '权限不足，无法执行当前操作',
    'bad credentials': '用户名或密码错误',
    'forbidden': '权限不足，无法执行当前操作',
    'unauthorized': '登录已过期，请重新登录',
    'not found': '请求的资源不存在',
};
/** HTTP 状态码 → 默认友好消息 */
const STATUS_MAP = {
    400: '请求信息有误，请检查后重试',
    401: '登录已过期，请重新登录',
    403: '权限不足，无法执行当前操作',
    404: '请求的资源不存在',
    408: '请求超时，请稍后重试',
    409: '操作冲突，数据可能已被修改',
    413: '上传的文件过大',
    422: '提交的数据格式有误',
    429: '操作过于频繁，请稍后再试',
    500: '服务异常，请稍后重试',
    502: '服务暂时不可用，请稍后重试',
    503: '服务正在维护中，请稍后重试',
    504: '服务响应超时，请稍后重试',
};
function friendlyMessage(raw) {
    if (!raw)
        return null;
    const lower = raw.toLowerCase().trim();
    // 精确匹配
    if (MESSAGE_MAP[lower])
        return MESSAGE_MAP[lower];
    // 部分匹配
    for (const [key, val] of Object.entries(MESSAGE_MAP)) {
        if (lower.includes(key))
            return val;
    }
    // 如果消息本身已经是中文（至少包含一个中文字符），直接使用
    if (/[\u4e00-\u9fff]/.test(raw))
        return raw;
    // 否则返回 null，让调用方用状态码兜底
    return null;
}
// 响应拦截器 — 401 视为会话失效，其他统一友好提示
request.interceptors.response.use((response) => response, (error) => {
    const status = error.response?.status ?? 0;
    const serverMsg = error.response?.data?.message || error.response?.data?.error;
    const requestUrl = error.config?.url || '';
    if (status === 401) {
        const msg = friendlyMessage(serverMsg) || '登录已过期，请重新登录';
        if (requestUrl.includes('/api/auth/login')) {
            ElMessage.error(msg);
            return Promise.reject(error);
        }
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('auth_redirect_message', msg);
            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }
    }
    else if (status === 403) {
        ElMessage.error(friendlyMessage(serverMsg) || STATUS_MAP[403]);
    }
    else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        ElMessage.error('请求超时，请检查网络后重试');
    }
    else if (!error.response) {
        ElMessage.error('无法连接到服务器，请检查网络');
    }
    else {
        const msg = friendlyMessage(serverMsg) || STATUS_MAP[status] || '操作失败，请稍后重试';
        ElMessage.error(msg);
    }
    return Promise.reject(error);
});
export default request;
//# sourceMappingURL=request.js.map