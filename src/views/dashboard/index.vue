<template>
  <div class="dashboard-container">
    <div class="hero-card">
      <div class="hero-title">企业知识库智能问答助手</div>
      <div class="hero-subtitle">沉淀知识资产，统一检索入口，保障协作一致性</div>
      <div class="hero-tags">
        <el-tag type="success" v-if="stats.systemHealthy">系统健康</el-tag>
        <el-tag type="danger" v-else-if="stats.systemHealthy === false">系统异常</el-tag>
        <el-tag type="info" v-else>状态未知</el-tag>
        <span class="hero-status">{{ stats.systemStatus || '加载中...' }}</span>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="metricSpan">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>文档总数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ stats.docCount }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="showAdminMetrics" :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>问答总数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ stats.qaCount }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="showAdminMetrics" :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>系统用户</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ stats.userCount }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="metricSpan">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
            </div>
          </template>
          <div class="card-content">
            <el-tag :type="stats.systemHealthy === false ? 'danger' : (stats.systemStatus ? 'success' : 'info')">
              {{ stats.systemStatus || '加载中...' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { listDocuments } from '@/api/document'
import { listUsers } from '@/api/user'
import { searchQaLogs } from '@/api/log'
import { getSystemStatus } from '@/api/config'
import { useUserStore } from '@/store/user'
import { isAdminRole } from '@/utils/access'

const stats = reactive({
  docCount: 0,
  qaCount: 0,
  userCount: 0,
  systemStatus: '',
  systemHealthy: null as boolean | null,
})

const userStore = useUserStore()
const showAdminMetrics = computed(() => isAdminRole(userStore.userInfo?.role))
const metricSpan = computed(() => (showAdminMetrics.value ? 6 : 12))

onMounted(async () => {
  try {
    if (userStore.token && !userStore.userInfo) {
      await userStore.ensureUserInfo()
    }

    const requests = await Promise.allSettled([
      listDocuments(),
      getSystemStatus(),
      showAdminMetrics.value ? listUsers() : Promise.resolve(null),
      showAdminMetrics.value ? searchQaLogs({ page: 0, size: 1 }) : Promise.resolve(null),
    ])

    const [docRes, statusRes, userRes, qaRes] = requests

    if (docRes.status === 'fulfilled') {
      stats.docCount = docRes.value.data.length
    }

    if (statusRes.status === 'fulfilled') {
      stats.systemStatus = statusRes.value.data.message || statusRes.value.data.status
      stats.systemHealthy = statusRes.value.data.healthy
    }

    if (userRes.status === 'fulfilled' && userRes.value) {
      stats.userCount = userRes.value.data.length
    }

    if (qaRes.status === 'fulfilled' && qaRes.value) {
      stats.qaCount = qaRes.value.data.total
    }
  } catch {
    // individual request errors are handled by interceptor
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-content h2 {
  margin: 0;
  font-size: 28px;
  color: #409EFF;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card {
  background: linear-gradient(135deg, #ffffff, #f5f9ff 45%, #eef8f6);
  border: 1px solid #e7ecf5;
  border-radius: 18px;
  padding: 22px 26px;
  box-shadow: 0 14px 30px rgba(20, 32, 55, 0.08);
}

.hero-title {
  font-size: 20px;
  font-weight: 700;
}

.hero-subtitle {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
}

.hero-tags {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
}

.hero-status {
  font-size: 12px;
}

.stat-card :deep(.el-card__header) {
  padding: 14px 18px;
}

.stat-card :deep(.el-card__body) {
  padding: 16px 18px;
}
</style>
