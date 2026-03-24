import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

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

// 响应拦截器 — 仅 401 视为会话失效，403 保留当前登录态
request.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        if (status === 401) {
            localStorage.removeItem('token')
            router.push('/login')
            ElMessage.error('登录已过期，请重新登录')
        } else if (status === 403) {
            const msg = error.response?.data?.message || '权限不足，无法执行当前操作'
            ElMessage.error(msg)
        } else {
            const msg = error.response?.data?.message || error.message || '请求失败'
            ElMessage.error(msg)
        }
        return Promise.reject(error)
    }
)

export default request
