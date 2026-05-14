import { createRouter, createWebHistory } from 'vue-router';
import { pinia } from '@/store';
import { useUserStore } from '@/store/user';
import { hasAnyPermission } from '@/utils/access';
import Layout from '../layout/index.vue';
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/dashboard/index.vue'),
                meta: { title: '仪表盘', icon: 'Odometer', permissions: ['DASHBOARD_READ'] }
            },
            {
                path: 'qa',
                name: 'Q&A',
                component: () => import('../views/qa/index.vue'),
                meta: { title: '智能问答', icon: 'ChatDotRound', permissions: ['QA_READ'] }
            },
            {
                path: 'knowledge',
                name: 'KnowledgeBase',
                component: () => import('../views/knowledge/index.vue'),
                meta: { title: '知识库管理', icon: 'Document', permissions: ['DOC_READ'] }
            },
            {
                path: 'users',
                name: 'UserManagement',
                component: () => import('../views/system/users/index.vue'),
                meta: { title: '用户管理', icon: 'User', permissions: ['USER_READ'] }
            },
            {
                path: 'roles',
                name: 'RoleManagement',
                component: () => import('../views/system/roles/index.vue'),
                meta: { title: '角色管理', icon: 'Lock', permissions: ['ROLE_READ'] }
            },
            {
                path: 'logs',
                name: 'Logs',
                component: () => import('../views/system/logs/index.vue'),
                meta: { title: '日志与反馈', icon: 'List', permissions: ['LOG_READ', 'FEEDBACK_READ'] }
            },
            {
                path: 'system',
                name: 'SystemConfig',
                component: () => import('../views/system/config/index.vue'),
                meta: { title: '系统配置', icon: 'Setting', permissions: ['CONFIG_READ'] }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/profile/index.vue'),
                meta: { title: '个人信息', hidden: true }
            },
            {
                path: '403',
                name: 'Forbidden',
                component: () => import('../views/error/Forbidden.vue'),
                meta: { title: '无权限', hidden: true }
            }
        ]
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
// 路由守卫 — 未登录与无权限拦截
router.beforeEach(async (to) => {
    const userStore = useUserStore(pinia);
    const token = userStore.token || localStorage.getItem('token');
    if (to.path === '/login') {
        if (!token) {
            return true;
        }
        try {
            await userStore.ensureUserInfo();
            return '/dashboard';
        }
        catch {
            userStore.clearSession();
            return true;
        }
    }
    if (!token) {
        return '/login';
    }
    try {
        await userStore.ensureUserInfo();
    }
    catch {
        userStore.clearSession();
        return '/login';
    }
    if (!hasAnyPermission(userStore.userInfo?.permissions, to.meta.permissions)) {
        if (to.path === '/403') {
            return true;
        }
        return {
            path: '/403',
            query: { redirect: to.fullPath }
        };
    }
    return true;
});
export default router;
//# sourceMappingURL=index.js.map