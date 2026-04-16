<template>
  <div class="profile-container">
    <!-- 顶部 banner：仅头像和用户名 -->
    <div class="profile-banner">
      <div class="avatar">{{ avatarChar }}</div>
      <div class="username">{{ userInfo?.username }}</div>
    </div>

    <!-- 信息列表 -->
    <div class="info-card">
      <div class="info-item">
        <span class="info-label">角色</span>
        <el-tag size="small" type="primary">{{ userInfo?.role }}</el-tag>
      </div>
      <div class="info-item">
        <span class="info-label">注册时间</span>
        <span class="info-value">{{ formatDateTime(userInfo?.createdAt) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">最近更新</span>
        <span class="info-value">{{ formatDateTime(userInfo?.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { formatDateTime } from '@/utils/date'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const avatarChar = computed(() => userInfo.value?.username?.charAt(0).toUpperCase() || 'U')

// Local redundant function removed.
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #1e3a5f 0%, #1a5fd4 60%, #2d8cff 100%);
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(29, 111, 235, 0.25);
}

.username {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.info-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e8edf5;
  padding: 6px 0;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border-bottom: 1px solid #f3f6fb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 90px;
  font-size: 13px;
  color: #9aa5b8;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2a37;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2.5px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
</style>
