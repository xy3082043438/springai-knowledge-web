<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
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
        <el-card shadow="hover">
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
        <el-card shadow="hover">
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
        <el-card shadow="hover">
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
      <p>本系统基于企业文档提供智能问答服务。</p>
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
</style>
