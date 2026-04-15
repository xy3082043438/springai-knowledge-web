<template>
  <el-container class="layout-container">
    <el-aside class="app-aside" :width="isCollapse ? '68px' : '236px'">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <div class="logo" :class="{ 'logo-collapsed': isCollapse }">
          <img src="/logo.svg" class="logo-badge" alt="logo" />
          <div v-if="!isCollapse" class="logo-text">
            <div class="logo-title">企业知识库</div>
            <div class="logo-subtitle">基于 SpringAI 架构</div>
          </div>
        </div>
        <el-menu-item v-for="item in topLevelMenu" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>

        <el-sub-menu v-if="systemMenu.length > 0" index="/system-group">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item v-for="item in systemMenu" :key="item.path" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <el-icon class="fold-btn" @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <div class="header-title">
            <div class="title-main">企业知识库智能问答助手</div>
            <div class="title-sub">基于 SpringAI 与 RAG 架构的企业级应用</div>
          </div>
          <div class="right-menu">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ displayName }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push('/profile')">个人信息</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer,
  ChatDotRound,
  Document,
  User,
  Lock,
  List,
  Setting,
  Expand,
  Fold,
  ArrowDown,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { ADMIN_ROLE, hasAnyRole } from '@/utils/access'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

interface MenuItem {
  path: string
  title: string
  icon: Component
  roles?: string[]
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', title: '仪表盘', icon: Odometer },
  { path: '/qa', title: '智能问答', icon: ChatDotRound },
  { path: '/knowledge', title: '知识库管理', icon: Document },
]

const systemMenuItems: MenuItem[] = [
  { path: '/users', title: '用户管理', icon: User, roles: [ADMIN_ROLE] },
  { path: '/roles', title: '角色管理', icon: Lock, roles: [ADMIN_ROLE] },
  { path: '/system', title: '系统配置', icon: Setting, roles: [ADMIN_ROLE] },
  { path: '/logs', title: '日志与反馈', icon: List, roles: [ADMIN_ROLE] },
]

const activeMenu = computed(() => route.path)
const displayName = computed(() => userStore.userInfo?.username || '用户')

const topLevelMenu = computed(() =>
  menuItems.filter((item) => hasAnyRole(userStore.userInfo?.role, item.roles))
)

const systemMenu = computed(() =>
  systemMenuItems.filter((item) => hasAnyRole(userStore.userInfo?.role, item.roles))
)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.ensureUserInfo()
    } catch {
      // interceptor handles 401
    }
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.app-aside {
  background: linear-gradient(180deg, #2b3b55 0%, #243247 100%);
  color: #d7e0ea;
  transition: width 0.3s;
  box-shadow: 6px 0 18px rgba(15, 23, 42, 0.12);
}

.el-menu-vertical {
  border-right: none;
  padding-top: 6px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 68px;
  padding: 0 18px;
  color: #fff;
  font-weight: 700;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 8px;
}

.logo-collapsed {
  justify-content: center;
  padding: 0;
}

.logo-badge {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: block;
}

.logo-text {
  line-height: 1.1;
}

.logo-title {
  font-size: 16px;
}

.logo-subtitle {
  font-size: 12px;
  color: #a8b7cc;
  margin-top: 4px;
}

.app-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e6e9ef;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fold-btn {
  font-size: 20px;
  cursor: pointer;
}

.header-title {
  flex: 1;
  margin-left: 14px;
}

.title-main {
  font-weight: 700;
  color: #1f2a37;
}

.title-sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.right-menu {
  cursor: pointer;
}

.app-main {
  padding: 20px;
}

:deep(.el-menu-vertical .el-menu-item),
:deep(.el-menu-vertical .el-sub-menu__title) {
  margin: 3px 10px;
  border-radius: 10px;
  height: 46px;
  line-height: 46px;
  font-size: 14px;
  color: #b8c8dc;
  transition: all 0.2s;
}

:deep(.el-menu-vertical .el-sub-menu .el-menu-item) {
  padding-left: 48px !important;
}

:deep(.el-menu-vertical .el-menu-item .el-icon),
:deep(.el-menu-vertical .el-sub-menu__title .el-icon) {
  font-size: 17px;
  vertical-align: middle;
}

/* 折叠态：菜单项宽高相等，形成正方形 */
:deep(.el-menu-vertical.el-menu--collapse) {
  width: 100%;
}

:deep(.el-menu-vertical.el-menu--collapse .el-menu-item),
:deep(.el-menu-vertical.el-menu--collapse .el-sub-menu__title) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 0 !important;
  margin: 4px auto !important;
  width: 44px !important;
  height: 44px !important;
  line-height: 44px !important;
  border-radius: 12px !important;
  box-sizing: border-box !important;
}

/* 强制隐藏子菜单中多余的元素，防止带偏 Flex 居中计算 */
:deep(.el-menu-vertical.el-menu--collapse .el-sub-menu__title span),
:deep(.el-menu-vertical.el-menu--collapse .el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none !important;
}

:deep(.el-menu-vertical.el-menu--collapse .el-menu-item > *),
:deep(.el-menu-vertical.el-menu--collapse .el-sub-menu__title > *) {
  margin: 0 !important;
}

:deep(.el-menu-vertical.el-menu--collapse .el-menu-item .el-tooltip__trigger) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

:deep(.el-menu-vertical.el-menu--collapse .el-menu-item .el-icon),
:deep(.el-menu-vertical.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0 !important;
  font-size: 20px;
}

:deep(.el-menu-vertical .el-menu-item.is-active) {
  background: rgba(45, 140, 255, 0.18);
  color: #ffffff;
  font-weight: 600;
}

:deep(.el-menu-vertical.el-menu--collapse .el-menu-item.is-active) {
  background: rgba(45, 140, 255, 0.25);
  box-shadow: none;
}

:deep(.el-menu-vertical .el-menu-item.is-active .el-icon) {
  color: #5ab4ff;
}

:deep(.el-menu-vertical .el-menu-item:hover:not(.is-active)),
:deep(.el-menu-vertical .el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.07);
  color: #e0eaf5;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
