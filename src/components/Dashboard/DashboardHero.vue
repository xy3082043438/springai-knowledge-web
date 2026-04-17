<template>
  <div class="dashboard-header animate-rise-in">
    <div class="header-main">
      <h1 class="header-title">知识库智能助手 · 运行概览</h1>
      <p class="header-subtitle">系统指标监控：实时观察知识资产分布、问答交互频次及服务运行状态。</p>
    </div>
    <div class="header-actions">
      <el-tag :type="healthTagType" effect="light" class="health-tag">
        {{ healthText }}
      </el-tag>
      <span class="update-time">更新于 {{ lastUpdatedText || '-' }}</span>
      <el-button type="primary" icon="Refresh" @click="$emit('refresh')">刷新数据</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  docCount: number
  qaCount: number
  userCount: number
  readyCount: number
  readyRate: number
  systemStatus: string
  systemHealthy: boolean | null
  topTypeLabel: string
  topTypeShare: number
  qaTrendTotal: number
  qaPeakValue: number
  isAdmin: boolean
  lastUpdatedText: string
}>()

defineEmits<{ refresh: [] }>()

const healthTagType = computed(() =>
  props.systemHealthy === false ? 'danger' : props.systemStatus ? 'success' : 'info'
)
const healthText = computed(() =>
  props.systemHealthy === false ? '系统异常' : props.systemStatus ? '系统健康' : '状态追踪中'
)
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid #e7ecf5;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2a37;
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.health-tag {
  border-radius: 6px;
  font-weight: 500;
}

.update-time {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
