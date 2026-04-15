<template>
  <div class="dashboard-container" v-loading="loading">
    <DashboardHero
      :doc-count="stats.docCount"
      :qa-count="stats.qaCount"
      :user-count="stats.userCount"
      :ready-count="readyCount"
      :ready-rate="readyRate"
      :system-status="stats.systemStatus"
      :system-healthy="stats.systemHealthy"
      :top-type-label="topDocumentTypeLabel"
      :top-type-share="topDocumentTypeShare"
      :qa-trend-total="qaTrendTotal"
      :qa-peak-value="qaPeakValue"
      :is-admin="showAdminMetrics"
      :last-updated-text="lastUpdatedText"
      @refresh="loadDashboard"
    />

    <MetricCards :cards="metricCards" />

    <section class="panel-grid" :class="{ 'panel-grid-admin': showAdminMetrics }">
      <StatusPanel
        :items="documentStatusItems"
        :ready-rate="readyRate"
        :doc-count="stats.docCount"
      />

      <DistributionPanel
        v-if="showAdminMetrics"
        kicker="角色结构"
        title="用户角色分布"
        subtitle="按角色查看当前系统用户结构"
        panel-class="panel-roles"
        empty-text="暂无用户角色数据"
        :items="roleDistributionItems"
      />
    </section>

    <EChartsPanel v-if="showAdminMetrics && dashboardData" :dashboard-data="dashboardData" />
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onMounted, reactive, ref } from 'vue'
import { ChatDotRound, Document, Monitor, User } from '@element-plus/icons-vue'
import { listDocuments } from '@/api/business/document'
import { getSystemStatus } from '@/api/system/config'
import { getDashboard } from '@/api/dashboard'
import { searchQaLogs } from '@/api/system/log'
import { listUsers } from '@/api/system/user'
import { useUserStore } from '@/store/user'
import { isAdminRole } from '@/utils/access'
import type { DocumentSummaryResponse, QaLogResponse, UserResponse, DashboardResponse } from '@/types/api'
import type { MetricCard } from '@/components/Dashboard/MetricCards.vue'
import type { TrendItem } from '@/components/Dashboard/TrendPanel.vue'
import type { DistributionItem } from '@/components/Dashboard/DistributionPanel.vue'
import type { StatusItem } from '@/components/Dashboard/StatusPanel.vue'

import DashboardHero from '@/components/Dashboard/DashboardHero.vue'
import MetricCards from '@/components/Dashboard/MetricCards.vue'
import StatusPanel from '@/components/Dashboard/StatusPanel.vue'
import DistributionPanel from '@/components/Dashboard/DistributionPanel.vue'
import EChartsPanel from '@/components/Dashboard/EChartsPanel.vue'

/* ── Constants ── */
const DAY_MS = 24 * 60 * 60 * 1000
const distributionPalette = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#8b5cf6']
const metricIconMap = {
  docs: markRaw(Document),
  qa: markRaw(ChatDotRound),
  users: markRaw(User),
  system: markRaw(Monitor),
}

/* ── State ── */
const stats = reactive({
  docCount: 0,
  qaCount: 0,
  userCount: 0,
  systemStatus: '',
  systemHealthy: null as boolean | null,
})

const loading = ref(false)
const lastUpdatedAt = ref('')
const dashboardData = ref<DashboardResponse | null>(null)
const documents = ref<DocumentSummaryResponse[]>([])
const users = ref<UserResponse[]>([])
const recentQaLogs = ref<QaLogResponse[]>([])

const userStore = useUserStore()
const showAdminMetrics = computed(() => isAdminRole(userStore.userInfo?.role))

/* ── Helpers ── */
const startOfDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

const endOfDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(23, 59, 59, 0)
  return next
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatDateTimeParam = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const formatShortDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const formatDateTimeLabel = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '刚刚'
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const statusMeta: Record<string, { label: string; color: string }> = {
  READY: { label: '已索引', color: '#22c55e' },
  UPLOADED: { label: '待处理', color: '#f59e0b' },
  FAILED: { label: '失败', color: '#ef4444' },
}

const getFileExtension = (fileName?: string) => {
  if (!fileName) return ''
  const index = fileName.lastIndexOf('.')
  return index >= 0 ? fileName.slice(index + 1).toLowerCase() : ''
}

const getDocumentType = (doc: DocumentSummaryResponse) => {
  const extension = getFileExtension(doc.fileName)
  if (extension === 'markdown') return 'MD'
  if (extension === 'htm') return 'HTML'
  if (extension) return extension.toUpperCase()
  if (doc.contentType?.includes('markdown')) return 'MD'
  if (doc.contentType?.includes('html')) return 'HTML'
  if (doc.contentType?.includes('csv')) return 'CSV'
  if (doc.contentType?.includes('text/plain')) return 'TXT'
  return 'TEXT'
}

const buildDistribution = (labels: string[]): DistributionItem[] => {
  if (labels.length === 0) return []
  const counter = new Map<string, number>()
  labels.forEach((label) => {
    counter.set(label, (counter.get(label) || 0) + 1)
  })
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value], index) => ({
      label,
      value,
      percent: Math.round((value / labels.length) * 100),
      color: distributionPalette[index % distributionPalette.length],
    }))
}

/* ── Computed ── */
const documentStatusItems = computed<StatusItem[]>(() => {
  const total = documents.value.length
  return Object.entries(statusMeta).map(([key, meta]) => {
    const value = documents.value.filter((doc) => doc.status === key).length
    return {
      key,
      label: meta.label,
      color: meta.color,
      value,
      percent: total > 0 ? Math.round((value / total) * 100) : 0,
    }
  })
})

const readyCount = computed(() => documentStatusItems.value.find((item) => item.key === 'READY')?.value || 0)
const failedCount = computed(() => documentStatusItems.value.find((item) => item.key === 'FAILED')?.value || 0)
const readyRate = computed(() => (stats.docCount > 0 ? Math.round((readyCount.value / stats.docCount) * 100) : 0))

const documentTypeItems = computed(() => buildDistribution(documents.value.map((doc) => getDocumentType(doc))))
const roleDistributionItems = computed(() => buildDistribution(users.value.map((user) => user.role || '未分配')))

const qaTrendItems = computed<TrendItem[]>(() => {
  const today = startOfDay(new Date())
  const seed = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - (6 - index) * DAY_MS)
    return {
      key: formatDateKey(date),
      label: formatShortDate(date.toISOString()),
      value: 0,
    }
  })

  const valueMap = new Map(seed.map((item) => [item.key, 0]))
  recentQaLogs.value.forEach((log) => {
    const key = formatDateKey(new Date(log.createdAt))
    if (valueMap.has(key)) {
      valueMap.set(key, (valueMap.get(key) || 0) + 1)
    }
  })

  const maxValue = Math.max(...valueMap.values(), 0)
  return seed.map((item) => {
    const value = valueMap.get(item.key) || 0
    return {
      ...item,
      value,
      height: maxValue > 0 ? Math.max(12, Math.round((value / maxValue) * 100)) : 0,
    }
  })
})

const qaTrendTotal = computed(() => qaTrendItems.value.reduce((sum, item) => sum + item.value, 0))
const qaPeakValue = computed(() => Math.max(...qaTrendItems.value.map((item) => item.value), 0))
const topDocumentTypeLabel = computed(() => documentTypeItems.value[0]?.label || '未导入')
const topDocumentTypeShare = computed(() => documentTypeItems.value[0]?.percent || 0)

const lastUpdatedText = computed(() => (lastUpdatedAt.value ? formatDateTimeLabel(lastUpdatedAt.value) : '尚未加载'))

const metricCards = computed<MetricCard[]>(() => {
  const cards: MetricCard[] = [
    {
      label: '文档总数',
      value: stats.docCount,
      note: `${readyCount.value} 已索引 / ${failedCount.value} 异常`,
      color: '#2563eb',
      softColor: 'rgba(37, 99, 235, 0.12)',
      icon: metricIconMap.docs,
    },
    {
      label: '问答总数',
      value: stats.qaCount,
      note: `最近 7 天 ${qaTrendTotal.value} 次`,
      color: '#0f766e',
      softColor: 'rgba(15, 118, 110, 0.12)',
      icon: metricIconMap.qa,
    },
    {
      label: '系统用户',
      value: stats.userCount,
      note: `${roleDistributionItems.value.length} 类角色`,
      color: '#f97316',
      softColor: 'rgba(249, 115, 22, 0.14)',
      icon: metricIconMap.users,
    },
    {
      label: '系统状态',
      value: stats.systemHealthy === false ? '异常' : (stats.systemStatus ? '正常' : '未知'),
      note: stats.systemStatus || '等待状态返回',
      color: stats.systemHealthy === false ? '#ef4444' : '#22c55e',
      softColor: stats.systemHealthy === false ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
      icon: metricIconMap.system,
    },
  ]
  return showAdminMetrics.value ? cards : [cards[0], cards[3]]
})

/* ── Data loading ── */
const loadDashboard = async () => {
  loading.value = true

  try {
    if (userStore.token && !userStore.userInfo) {
      await userStore.ensureUserInfo()
    }
  } catch {
    loading.value = false
    return
  }

  try {
    /* Common requests for all users */
    const commonResults = await Promise.allSettled([
      listDocuments(),
      getSystemStatus(),
    ])

    const [docRes, statusRes] = commonResults

    if (docRes.status === 'fulfilled') {
      documents.value = docRes.value.data
      stats.docCount = docRes.value.data.length
    }

    if (statusRes.status === 'fulfilled') {
      stats.systemStatus = statusRes.value.data.message || statusRes.value.data.status
      stats.systemHealthy = statusRes.value.data.healthy
    }

    /* Admin-only requests */
    if (showAdminMetrics.value) {
      const now = new Date()
      const trendFrom = formatDateTimeParam(startOfDay(new Date(now.getTime() - 6 * DAY_MS)))
      const trendTo = formatDateTimeParam(endOfDay(now))

      const adminResults = await Promise.allSettled([
        listUsers(),
        searchQaLogs({ page: 0, size: 1 }),
        searchQaLogs({ page: 0, size: 500, from: trendFrom, to: trendTo }),
        getDashboard(),
      ])

      const [userRes, qaTotalRes, qaTrendRes, dashboardRes] = adminResults

      if (userRes.status === 'fulfilled') {
        users.value = userRes.value.data
        stats.userCount = userRes.value.data.length
      }

      if (qaTotalRes.status === 'fulfilled') {
        stats.qaCount = qaTotalRes.value.data.total
      }

      if (qaTrendRes.status === 'fulfilled') {
        recentQaLogs.value = qaTrendRes.value.data.items
      }

      if (dashboardRes.status === 'fulfilled') {
        dashboardData.value = dashboardRes.value.data

        // Use dashboard overview to fill any missing stats
        const overview = dashboardRes.value.data.overview
        if (overview) {
          if (stats.userCount === 0) stats.userCount = overview.totalUsers
          if (stats.qaCount === 0) stats.qaCount = overview.totalQaCount
        }
      }
    } else {
      users.value = []
      recentQaLogs.value = []
      stats.qaCount = 0
      stats.userCount = 0
    }
  } finally {
    lastUpdatedAt.value = new Date().toISOString()
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.dashboard-container {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 6px;
}

.dashboard-container::before {
  content: '';
  position: absolute;
  inset: 10px 0 auto;
  height: 320px;
  background:
    radial-gradient(circle at 0% 0%, rgba(64, 158, 255, 0.1), transparent 42%),
    radial-gradient(circle at 85% 10%, rgba(21, 166, 161, 0.1), transparent 34%);
  pointer-events: none;
  z-index: -1;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel-grid-admin .panel-wide {
  grid-column: 1 / -1;
}

@media (max-width: 960px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
  .panel-grid-admin .panel-wide {
    grid-column: auto;
  }
}
</style>

