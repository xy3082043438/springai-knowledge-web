<template>
  <div class="dashboard-container">
    <div class="hero-card">
      <div class="hero-left">
        <div class="hero-title">企业知识库智能问答助手</div>
        <div class="hero-subtitle">沉淀知识资产，统一检索入口，保障协作一致性</div>
        <div class="hero-tags">
          <el-tag type="success" v-if="stats.systemHealthy">系统健康</el-tag>
          <el-tag type="danger" v-else-if="stats.systemHealthy === false">系统异常</el-tag>
          <el-tag type="info" v-else>状态未知</el-tag>
          <span class="hero-status">{{ stats.systemStatus || '加载中...' }}</span>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-metric">
          <div class="metric-label">问答总数</div>
          <div class="metric-value">{{ stats.qaCount }}</div>
        </div>
        <div class="hero-metric">
          <div class="metric-label">系统用户</div>
          <div class="metric-value">{{ stats.userCount }}</div>
        </div>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
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
      <el-col :span="6">
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
      <el-col :span="6">
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
      <el-col :span="6">
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

    <el-card class="welcome-card" style="margin-top: 20px;">
      <h1>欢迎使用企业知识库系统</h1>
      <p>统一采集、分发与检索企业文档，结合检索增强问答服务，提升业务响应效率。</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { listDocuments } from '@/api/document'
import { listUsers } from '@/api/user'
import { searchQaLogs } from '@/api/log'
import { getSystemStatus } from '@/api/config'

const stats = reactive({
  docCount: 0,
  qaCount: 0,
  userCount: 0,
  systemStatus: '',
  systemHealthy: null as boolean | null,
})

onMounted(async () => {
  try {
    const [docRes, userRes, qaRes, statusRes] = await Promise.all([
      listDocuments(),
      listUsers(),
      searchQaLogs({ page: 0, size: 1 }),
      getSystemStatus(),
    ])
    stats.docCount = docRes.data.length
    stats.userCount = userRes.data.length
    stats.qaCount = qaRes.data.total
    stats.systemStatus = statusRes.data.message || statusRes.data.status
    stats.systemHealthy = statusRes.data.healthy
  } catch {
    // errors handled by interceptor
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
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

.hero-right {
  display: flex;
  gap: 20px;
}

.hero-metric {
  background: #ffffff;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 120px;
  text-align: center;
}

.metric-label {
  color: #6b7280;
  font-size: 12px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
  color: #1f6feb;
}

.stat-card :deep(.el-card__header) {
  padding: 14px 18px;
}

.stat-card :deep(.el-card__body) {
  padding: 16px 18px;
}

.welcome-card {
  border-radius: 18px;
  border: 1px solid #e8edf5;
  background: #ffffff;
}
</style>
