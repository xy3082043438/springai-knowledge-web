import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: '',
    timeout: 30000,
})

// 请求拦截器 — 自动注入 JWT token
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

/**
 * 常见英文后端消息 → 友好中文映射
 * 后端历史遗留或第三方库可能返回英文，在此做最终兜底翻译
 */
const MESSAGE_MAP: Record<string, string> = {
    'username already exists': '该用户名已被其他用户注册，请尝试使用其他名称',
    'user not found': '抱歉，未找到该用户信息，可能已被移除',
    'role not found': '无法完成操作，您指定的角色似乎不存在',
    'role already exists': '该角色名称已存在，请选择一个不同的名称',
    'system role cannot be deleted': '抱歉，系统内置角色受到保护，无法删除',
    'system role name cannot be changed': '抱歉，系统内置角色的名称受保护，无法修改',
    'role is assigned to users': '无法删除角色，该角色下还有关联用户，请先移除',
    'role is referenced by documents': '无法删除角色，该角色下还有关联文档，请先移除',
    'role name is required': '请输入角色名称',
    'role name cannot be blank': '角色名称不能为空，请填写后重试',
    'current user cannot be deleted': '安全提示：您不能删除当前正在登录的账号',
    'role id is missing': '角色数据出现异常，请联系管理员处理',
    'access denied': '抱歉，您暂无执行此操作的权限',
    'bad credentials': '用户名或密码不正确，请检查后重试',
    'forbidden': '抱歉，您暂无执行此操作的权限',
    'unauthorized': '您的登录状态已过期，为了安全，请重新登录',
    'not found': '很抱歉，您请求的资源不存在或已被删除',
}

/** HTTP 状态码 → 默认友好消息 */
const STATUS_MAP: Record<number, string> = {
    400: '抱歉，请求参数有误，请检查后重新提交',
    401: '您的登录状态已过期，为了安全，请重新登录',
    403: '您暂无执行此操作的权限，如有需要请联系系统管理员',
    404: '很抱歉，您请求的资源不存在或已被删除',
    408: '请求超时，可能是网络不稳定，请稍后重试',
    409: '操作发生冲突，数据可能已被其他人修改',
    413: '您上传的文件体积过大，请压缩后再试',
    422: '提交的数据格式不符合要求，请检查',
    429: '您的操作过于频繁，请稍作休息后再试',
    500: '抱歉，服务器开小差了，请稍后重试',
    502: '服务暂时不可用，可能是网络波动，请稍后重试',
    503: '系统正在进行维护升级，请稍后重试',
    504: '服务器响应超时，请检查网络后重试',
}

function friendlyMessage(raw: string | undefined | null): string | null {
    if (!raw) return null
    const lower = raw.toLowerCase().trim()
    // 精确匹配
    if (MESSAGE_MAP[lower]) return MESSAGE_MAP[lower]
    // 部分匹配
    for (const [key, val] of Object.entries(MESSAGE_MAP)) {
        if (lower.includes(key)) return val
    }
    // 如果消息本身已经是中文（至少包含一个中文字符），直接使用
    if (/[\u4e00-\u9fff]/.test(raw)) return raw
    // 否则返回 null，让调用方用状态码兜底
    return null
}

// 响应拦截器 — 401 视为会话失效，其他统一友好提示
request.interceptors.response.use(
    (response) => response,
    (error) => {
        const status: number = error.response?.status ?? 0
        const serverMsg: string | undefined = error.response?.data?.message || error.response?.data?.error
        const requestUrl: string = error.config?.url || ''

        if (status === 401) {
            const msg = friendlyMessage(serverMsg) || '您的登录状态已过期，为了安全，请重新登录'

            if (requestUrl.includes('/api/auth/login')) {
                ElMessage.error(msg)
                return Promise.reject(error)
            }

            localStorage.removeItem('token')
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('auth_redirect_message', msg)
                if (window.location.pathname !== '/login') {
                    window.location.replace('/login')
                }
            }
        } else if (status === 403) {
            ElMessage.error(friendlyMessage(serverMsg) || STATUS_MAP[403]!)
        } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            ElMessage.error('请求超时，可能是网络不稳定，请稍后重试')
        } else if (!error.response) {
            ElMessage.error('无法连接到服务器，请检查您的网络连接')
        } else {
            const msg = friendlyMessage(serverMsg) || STATUS_MAP[status] || '操作未能成功，请稍后重试'
            ElMessage.error(msg)
        }
        return Promise.reject(error)
    }
)

export default request
