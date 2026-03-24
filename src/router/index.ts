import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { pinia } from '@/store'
import { useUserStore } from '@/store/user'
import { ADMIN_ROLE, hasAnyRole } from '@/utils/access'
import Layout from '../layout/index.vue'

const adminOnlyRoles = [ADMIN_ROLE]

const routes: Array<RouteRecordRaw> = [
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
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'qa',
        name: 'Q&A',
        component: () => import('../views/qa/index.vue'),
        meta: { title: '智能问答', icon: 'ChatDotRound' }
      },
      {
        path: 'knowledge',
        name: 'KnowledgeBase',
        component: () => import('../views/knowledge/index.vue'),
        meta: { title: '知识库管理', icon: 'Document' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/users/index.vue'),
        meta: { title: '用户管理', icon: 'User', roles: adminOnlyRoles }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('../views/logs/index.vue'),
        meta: { title: '日志与反馈', icon: 'List', roles: adminOnlyRoles }
      },
      {
        path: 'system',
        name: 'SystemConfig',
        component: () => import('../views/system/index.vue'),
        meta: { title: '系统配置', icon: 'Setting', roles: adminOnlyRoles }
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 — 未登录与无权限拦截
router.beforeEach(async (to) => {
  const userStore = useUserStore(pinia)
  const token = userStore.token || localStorage.getItem('token')

  if (to.path === '/login') {
    if (!token) {
      return true
    }

    try {
      await userStore.ensureUserInfo()
      return '/dashboard'
    } catch {
      userStore.clearSession()
      return true
    }
  }

  if (!token) {
    return '/login'
  }

  try {
    await userStore.ensureUserInfo()
  } catch {
    userStore.clearSession()
    return '/login'
  }

  if (!hasAnyRole(userStore.userInfo?.role, to.meta.roles)) {
    if (to.path === '/403') {
      return true
    }

    return {
      path: '/403',
      query: { redirect: to.fullPath }
    }
  }

  return true
})

export default router
