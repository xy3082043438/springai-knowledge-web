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
        <div class="logo">
          <div class="logo-badge">AI</div>
          <div v-if="!isCollapse" class="logo-text">
            <div class="logo-title">企业知识库</div>
            <div class="logo-subtitle">智能问答助手</div>
          </div>
        </div>
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-menu-item index="/qa">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>智能问答</template>
        </el-menu-item>
        <el-menu-item index="/knowledge">
          <el-icon><Document /></el-icon>
          <template #title>知识库管理</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/logs">
          <el-icon><List /></el-icon>
          <template #title>日志与反馈</template>
        </el-menu-item>
        <el-menu-item index="/system">
          <el-icon><Setting /></el-icon>
          <template #title>系统配置</template>
        </el-menu-item>
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
            <div class="title-sub">统一知识沉淀与检索，提升协作效率</div>
          </div>
          <div class="right-menu">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ displayName }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  ChatDotRound,
  Document,
  User,
  List,
  Setting,
  Expand,
  Fold,
  ArrowDown,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const displayName = computed(() => userStore.userInfo?.username || '用户')

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogout = () => {
  userStore.logout()
}

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
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
  padding: 0 16px;
  color: #fff;
  font-weight: 700;
  overflow: hidden;
}

.logo-badge {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #2d8cff, #1f6feb);
  color: #fff;
  font-weight: 800;
  letter-spacing: 1px;
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

:deep(.el-menu-vertical .el-menu-item) {
  margin: 6px 12px;
  border-radius: 10px;
  height: 44px;
}

:deep(.el-menu-vertical .el-menu-item.is-active) {
  background: rgba(31, 111, 235, 0.18);
  color: #ffffff;
}

:deep(.el-menu-vertical .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
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
