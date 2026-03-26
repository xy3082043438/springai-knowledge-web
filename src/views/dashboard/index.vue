<template>
  <div class="dashboard-container" v-loading="loading">
    <section class="hero-card">
      <div class="hero-copy">
        <div class="hero-eyebrow">智能运营看板</div>
        <div class="hero-title">企业知识库智能问答助手</div>
        <div class="hero-subtitle">沉淀知识资产、观察使用趋势、快速识别系统状态与知识覆盖情况</div>
        <div class="hero-strip">
          <span class="hero-chip">{{ stats.docCount }} 篇知识资产</span>
          <span class="hero-chip">{{ topDocumentTypeLabel }} 主力类型</span>
          <span class="hero-chip">{{ showAdminMetrics ? `${stats.qaCount} 次累计问答` : `${readyRate}% 已索引` }}</span>
        </div>
        <div class="hero-tags">
          <el-tag :type="stats.systemHealthy === false ? 'danger' : (stats.systemStatus ? 'success' : 'info')" effect="light">
            {{ stats.systemHealthy === false ? '系统异常' : (stats.systemStatus ? '系统健康' : '状态未知') }}
          </el-tag>
          <span class="hero-status">{{ stats.systemStatus || '状态加载中...' }}</span>
        </div>
      </div>
      <div class="hero-side">
        <div class="hero-side-head">
          <span class="hero-side-label">运行信号</span>
          <span class="hero-side-time">{{ lastUpdatedText }}</span>
        </div>
        <div class="signal-grid">
          <article class="signal-card signal-card-success">
            <span class="signal-label">索引完成率</span>
            <strong>{{ readyRate }}%</strong>
            <small>{{ readyCount }} / {{ stats.docCount || 0 }} 已完成</small>
          </article>
          <article class="signal-card signal-card-cyan">
            <span class="signal-label">{{ heroSignalLabel }}</span>
            <strong>{{ heroSignalValue }}</strong>
            <small>{{ heroSignalNote }}</small>
          </article>
          <article class="signal-card signal-card-amber">
            <span class="signal-label">主力类型</span>
            <strong>{{ topDocumentTypeLabel }}</strong>
            <small>{{ topDocumentTypeShare }}% 文档占比</small>
          </article>
        </div>
        <div class="hero-side-footer">
          <div class="hero-side-note">{{ heroInsight }}</div>
          <el-button type="primary" class="hero-refresh" @click="loadDashboard">刷新数据</el-button>
        </div>
      </div>
    </section>

    <section class="metric-grid">
      <article
        v-for="card in metricCards"
        :key="card.label"
        class="metric-card"
        :style="{ '--metric-accent': card.color, '--metric-soft': card.softColor }"
      >
        <div class="metric-card-top">
          <div class="metric-icon">
            <component :is="card.icon" />
          </div>
          <div class="metric-label">{{ card.label }}</div>
        </div>
        <div class="metric-value">{{ card.value }}</div>
        <div class="metric-note">{{ card.note }}</div>
      </article>
    </section>

    <section class="panel-grid" :class="{ 'panel-grid-admin': showAdminMetrics }">
      <article v-if="showAdminMetrics" class="panel panel-wide panel-trend">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">活跃趋势</div>
            <div class="panel-title">近 7 天问答趋势</div>
            <div class="panel-subtitle">按自然日聚合问答记录，观察近期活跃度变化</div>
          </div>
          <div class="panel-badges">
            <span class="soft-pill">总计 {{ qaTrendTotal }} 次</span>
            <span class="soft-pill">峰值 {{ qaPeakValue }} 次</span>
          </div>
        </div>

        <div v-if="qaTrendTotal > 0" class="trend-chart">
          <div v-for="item in qaTrendItems" :key="item.key" class="trend-column">
            <div class="trend-count">{{ item.value }}</div>
            <div class="trend-track">
              <div class="trend-bar" :style="{ height: `${item.height}%` }"></div>
            </div>
            <div class="trend-label">{{ item.label }}</div>
          </div>
        </div>
        <div v-else class="empty-state">最近 7 天暂无问答记录</div>
      </article>

      <article class="panel panel-status">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">索引健康</div>
            <div class="panel-title">文档状态分布</div>
            <div class="panel-subtitle">已索引、已上传与失败文档的当前占比</div>
          </div>
          <span class="panel-caption">索引完成率 {{ readyRate }}%</span>
        </div>

        <div class="status-layout">
          <div class="status-donut" :style="documentStatusStyle">
            <div class="status-donut-inner">
              <strong>{{ readyRate }}%</strong>
              <span>已完成索引</span>
              <small>{{ stats.docCount }} 篇总文档</small>
            </div>
          </div>

          <div class="status-legend">
            <div v-for="item in documentStatusItems" :key="item.key" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <div class="legend-copy">
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-percent">{{ item.percent }}%</span>
              </div>
              <span class="legend-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel panel-types">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">知识构成</div>
            <div class="panel-title">文档类型分布</div>
            <div class="panel-subtitle">按文件类型汇总知识资产，查看当前知识来源结构</div>
          </div>
        </div>

        <div v-if="documentTypeItems.length > 0" class="distribution-list">
          <div v-for="(item, index) in documentTypeItems" :key="item.label" class="distribution-item">
            <div class="distribution-meta">
              <div class="distribution-name">
                <span class="distribution-rank">{{ index + 1 }}</span>
                <span>{{ item.label }}</span>
              </div>
              <span>{{ item.value }} / {{ item.percent }}%</span>
            </div>
            <div class="distribution-track">
              <div class="distribution-bar" :style="{ width: `${Math.max(item.percent, 8)}%`, background: item.color }"></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">暂无文档类型数据</div>
      </article>

      <article v-if="showAdminMetrics" class="panel panel-roles">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">角色结构</div>
            <div class="panel-title">用户角色分布</div>
            <div class="panel-subtitle">按角色查看当前系统用户结构</div>
          </div>
        </div>

        <div v-if="roleDistributionItems.length > 0" class="distribution-list">
          <div v-for="(item, index) in roleDistributionItems" :key="item.label" class="distribution-item">
            <div class="distribution-meta">
              <div class="distribution-name">
                <span class="distribution-rank">{{ index + 1 }}</span>
                <span>{{ item.label }}</span>
              </div>
              <span>{{ item.value }} / {{ item.percent }}%</span>
            </div>
            <div class="distribution-track">
              <div class="distribution-bar" :style="{ width: `${Math.max(item.percent, 8)}%`, background: item.color }"></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">暂无用户角色数据</div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onMounted, reactive, ref } from 'vue'
import { ChatDotRound, Document, Monitor, User } from '@element-plus/icons-vue'
import { listDocuments } from '@/api/document'
import { getSystemStatus } from '@/api/config'
import { searchQaLogs } from '@/api/log'
import { listUsers } from '@/api/user'
import { useUserStore } from '@/store/user'
import { isAdminRole } from '@/utils/access'
import type { DocumentSummaryResponse, QaLogResponse, UserResponse } from '@/types/api'

interface DistributionItem {
  label: string
  value: number
  percent: number
  color: string
}

interface TrendItem {
  key: string
  label: string
  value: number
  height: number
}

const DAY_MS = 24 * 60 * 60 * 1000
const distributionPalette = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#8b5cf6']
const metricIconMap = {
  docs: markRaw(Document),
  qa: markRaw(ChatDotRound),
  users: markRaw(User),
  system: markRaw(Monitor),
}

const stats = reactive({
  docCount: 0,
  qaCount: 0,
  userCount: 0,
  systemStatus: '',
  systemHealthy: null as boolean | null,
})

const loading = ref(false)
const lastUpdatedAt = ref('')
const documents = ref<DocumentSummaryResponse[]>([])
const users = ref<UserResponse[]>([])
const recentQaLogs = ref<QaLogResponse[]>([])

const userStore = useUserStore()
const showAdminMetrics = computed(() => isAdminRole(userStore.userInfo?.role))

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

const formatDateTimeParam = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const formatDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

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

const documentStatusItems = computed(() => {
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

const documentStatusStyle = computed(() => {
  if (stats.docCount === 0) {
    return { background: 'conic-gradient(#e5edf8 0deg 360deg)' }
  }

  let angle = 0
  const segments = documentStatusItems.value.map((item) => {
    const nextAngle = angle + (item.value / stats.docCount) * 360
    const segment = `${item.color} ${angle}deg ${nextAngle}deg`
    angle = nextAngle
    return segment
  })

  return { background: `conic-gradient(${segments.join(', ')})` }
})

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
const heroSignalLabel = computed(() => (showAdminMetrics.value ? '7天问答' : '系统状态'))
const heroSignalValue = computed(() => {
  if (showAdminMetrics.value) return qaTrendTotal.value
  return stats.systemHealthy === false ? '异常' : (stats.systemStatus ? '正常' : '未知')
})
const heroSignalNote = computed(() => {
  if (showAdminMetrics.value) return `峰值 ${qaPeakValue.value} 次`
  return stats.systemStatus || '等待状态返回'
})

const heroInsight = computed(() => {
  if (!showAdminMetrics.value) {
    if (stats.docCount === 0) return '当前还没有你可访问的知识文档，建议先补充知识内容。'
    return `你当前可访问 ${stats.docCount} 篇文档，其中 ${readyCount.value} 篇已完成索引。`
  }

  if (qaTrendTotal.value === 0) {
    return `当前共管理 ${stats.docCount} 篇文档、${stats.userCount} 个系统用户，等待更多问答沉淀。`
  }

  return `近 7 天共发生 ${qaTrendTotal.value} 次问答，系统当前已完成 ${readyRate.value}% 文档索引。`
})

const lastUpdatedText = computed(() => (lastUpdatedAt.value ? formatDateTimeLabel(lastUpdatedAt.value) : '尚未加载'))

const metricCards = computed(() => {
  const cards = [
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

    if (showAdminMetrics.value) {
      const now = new Date()
      const trendFrom = formatDateTimeParam(startOfDay(new Date(now.getTime() - 6 * DAY_MS)))
      const trendTo = formatDateTimeParam(endOfDay(now))

      const adminResults = await Promise.allSettled([
        listUsers(),
        searchQaLogs({ page: 0, size: 1 }),
        searchQaLogs({ page: 0, size: 500, from: trendFrom, to: trendTo }),
      ])

      const [userRes, qaTotalRes, qaTrendRes] = adminResults

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

.hero-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(360px, 0.95fr);
  gap: 20px;
  padding: 24px 26px;
  border-radius: 24px;
  border: 1px solid #e7ecf5;
  background:
    radial-gradient(circle at 12% 18%, rgba(64, 158, 255, 0.14), transparent 30%),
    radial-gradient(circle at 88% 14%, rgba(21, 166, 161, 0.12), transparent 24%),
    linear-gradient(135deg, #ffffff 0%, #f4f8ff 56%, #eef8f6 100%);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  animation: riseIn 0.5s ease both;
}

.hero-card::before,
.hero-card::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  filter: blur(0);
  opacity: 0.55;
}

.hero-card::before {
  right: -60px;
  top: -54px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.14), transparent 68%);
}

.hero-card::after {
  left: -80px;
  bottom: -80px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(21, 166, 161, 0.1), transparent 72%);
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1f6feb;
}

.hero-title {
  margin-top: 10px;
  font-size: 34px;
  font-weight: 700;
  color: #1f2a37;
}

.hero-subtitle {
  margin-top: 10px;
  max-width: 720px;
  line-height: 1.7;
  color: #5f6b7a;
}

.hero-strip {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.12);
  color: #47627e;
  font-size: 12px;
}

.hero-tags {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.hero-status {
  font-size: 13px;
  color: #627084;
}

.hero-side {
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(226, 233, 239, 0.94);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.hero-side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hero-side-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1f6feb;
}

.hero-side-time {
  font-size: 12px;
  color: #738196;
}

.signal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.signal-card {
  min-height: 112px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid #e7ecf5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.signal-card-success {
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.12), rgba(255, 255, 255, 0.92));
}

.signal-card-cyan {
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.12), rgba(255, 255, 255, 0.92));
}

.signal-card-amber {
  background: linear-gradient(180deg, rgba(249, 115, 22, 0.12), rgba(255, 255, 255, 0.92));
}

.signal-label {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  word-break: keep-all;
}

.signal-card strong {
  font-size: 28px;
  font-weight: 700;
  color: #22324b;
  line-height: 1.1;
  word-break: keep-all;
}

.signal-card small {
  color: #738196;
  line-height: 1.5;
  word-break: keep-all;
}

.signal-card-amber {
  grid-column: 1 / -1;
  min-height: 92px;
}

.hero-side-footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.hero-side-note {
  line-height: 1.7;
  color: #5f6b7a;
}

.hero-refresh {
  align-self: flex-end;
  min-width: 104px;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 10px 18px rgba(64, 158, 255, 0.22);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.metric-card {
  position: relative;
  overflow: hidden;
  padding: 18px 18px 16px;
  border-radius: 22px;
  border: 1px solid #e6edf7;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.96)),
    linear-gradient(135deg, var(--metric-soft), rgba(255, 255, 255, 0));
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
  animation: riseIn 0.5s ease both;
}

.metric-card::before {
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--metric-accent), rgba(255, 255, 255, 0));
}

.metric-card::after {
  content: '';
  position: absolute;
  top: -34px;
  right: -24px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--metric-soft), rgba(255, 255, 255, 0));
}

.metric-card-top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: var(--metric-soft);
  color: var(--metric-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.metric-label {
  font-size: 14px;
  color: #5b6475;
}

.metric-value {
  position: relative;
  margin-top: 18px;
  font-size: 36px;
  font-weight: 700;
  color: #10233f;
  letter-spacing: -0.03em;
}

.metric-note {
  position: relative;
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel-grid-admin .panel-wide {
  grid-column: 1 / -1;
}

.panel {
  position: relative;
  overflow: hidden;
  padding: 20px 20px 18px;
  border-radius: 22px;
  border: 1px solid #e6edf7;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  animation: riseIn 0.55s ease both;
}

.panel::before {
  content: '';
  position: absolute;
  inset: auto -40px -50px auto;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.08), transparent 70%);
  pointer-events: none;
}

.panel-trend {
  background:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.12), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%);
  border-color: #e4ebf6;
}

.panel-status {
  background: linear-gradient(180deg, #ffffff 0%, #fffaf2 100%);
}

.panel-types {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.panel-roles {
  background: linear-gradient(180deg, #ffffff 0%, #f6fffb 100%);
}

.panel-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.panel-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1f6feb;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #10233f;
}

.panel-subtitle {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.panel-caption {
  font-size: 12px;
  color: #1f6feb;
  white-space: nowrap;
}

.panel-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.soft-pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #315bba;
  font-size: 12px;
}

.panel-trend .soft-pill {
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.1);
  color: #47627e;
}

.trend-chart {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
  min-height: 240px;
}

.trend-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
}

.trend-count {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.trend-track {
  position: relative;
  width: 100%;
  height: 170px;
  border-radius: 18px;
  background: linear-gradient(180deg, #eef4ff 0%, #f8fbff 100%);
  display: flex;
  align-items: flex-end;
  padding: 10px;
  overflow: hidden;
}

.trend-track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to top,
    rgba(255, 255, 255, 0.06) 0 1px,
    transparent 1px 30px
  );
  pointer-events: none;
}

.panel-trend .trend-track {
  background: linear-gradient(180deg, #eef4ff, #f8fbff);
}

.trend-bar {
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #60a5fa 0%, #2563eb 100%);
  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.2);
  transition: height 0.25s ease;
}

.panel-trend .trend-bar {
  background: linear-gradient(180deg, #7ab8ff 0%, #409eff 45%, #1f6feb 100%);
  box-shadow: 0 14px 24px rgba(64, 158, 255, 0.22);
}

.trend-label {
  font-size: 12px;
  color: #64748b;
}

.status-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 164px minmax(0, 1fr);
  align-items: start;
  gap: 34px;
}

.status-donut {
  width: 164px;
  height: 164px;
  border-radius: 50%;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85);
}

.status-donut-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #475569;
}

.status-donut-inner strong {
  font-size: 30px;
  line-height: 1;
  color: #10233f;
}

.status-donut-inner span {
  margin-top: 8px;
  font-size: 13px;
}

.status-donut-inner small {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.status-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 6px;
}

.legend-item {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(231, 236, 245, 0.9);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.88);
}

.legend-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.legend-label,
.legend-percent,
.legend-value {
  font-size: 13px;
  color: #475569;
}

.legend-value {
  font-weight: 700;
  color: #10233f;
}

.distribution-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: #475569;
}

.distribution-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.distribution-rank {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #eaf1ff;
  color: #315bba;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.distribution-track {
  height: 10px;
  border-radius: 999px;
  background: #edf2fb;
  overflow: hidden;
}

.distribution-bar {
  height: 100%;
  border-radius: inherit;
  transition: width 0.25s ease;
}

.empty-state {
  margin-top: 18px;
  min-height: 180px;
  border-radius: 18px;
  border: 1px dashed #dbe4f3;
  background: #f8fbff;
  color: #7c8798;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.metric-card:nth-child(1),
.panel:nth-child(1) {
  animation-delay: 0.04s;
}

.metric-card:nth-child(2),
.panel:nth-child(2) {
  animation-delay: 0.08s;
}

.metric-card:nth-child(3),
.panel:nth-child(3) {
  animation-delay: 0.12s;
}

.metric-card:nth-child(4),
.panel:nth-child(4) {
  animation-delay: 0.16s;
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1100px) {
  .status-layout {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .signal-grid {
    grid-template-columns: 1fr;
  }

  .hero-side-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 960px) {
  .hero-card,
  .panel-grid {
    grid-template-columns: 1fr;
  }

  .panel-grid-admin .panel-wide {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .hero-card,
  .metric-card,
  .panel {
    padding: 18px;
  }

  .hero-title {
    font-size: 22px;
  }

  .hero-strip {
    gap: 8px;
  }

  .trend-chart {
    gap: 8px;
  }

  .trend-track {
    height: 140px;
    padding: 8px;
  }

  .status-donut {
    width: 160px;
    height: 160px;
    padding: 14px;
  }
}
</style>
