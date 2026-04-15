<template>
  <section class="hero-card">
    <div class="hero-copy">
      <div class="hero-eyebrow">智能运营看板</div>
      <div class="hero-title">企业知识库智能问答助手</div>
      <div class="hero-subtitle">沉淀知识资产、观察使用趋势、快速识别系统状态与知识覆盖情况</div>
      <div class="hero-strip">
        <span class="hero-chip">{{ docCount }} 篇知识资产</span>
        <span class="hero-chip">{{ topTypeLabel }} 主力类型</span>
        <span class="hero-chip">{{ isAdmin ? `${qaCount} 次累计问答` : `${readyRate}% 已索引` }}</span>
      </div>
      <div class="hero-tags">
        <el-tag :type="healthTagType" effect="light">{{ healthText }}</el-tag>
        <span class="hero-status">{{ systemStatus || '状态加载中...' }}</span>
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
          <small>{{ readyCount }} / {{ docCount }} 已完成</small>
        </article>
        <article class="signal-card signal-card-cyan">
          <span class="signal-label">{{ signalLabel }}</span>
          <strong>{{ signalValue }}</strong>
          <small>{{ signalNote }}</small>
        </article>
        <article class="signal-card signal-card-amber">
          <span class="signal-label">主力类型</span>
          <strong>{{ topTypeLabel }}</strong>
          <small>{{ topTypeShare }}% 文档占比</small>
        </article>
      </div>
      <div class="hero-side-footer">
        <div class="hero-side-note">{{ insight }}</div>
        <el-button type="primary" class="hero-refresh" @click="$emit('refresh')">刷新数据</el-button>
      </div>
    </div>
  </section>
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
  props.systemHealthy === false ? '系统异常' : props.systemStatus ? '系统健康' : '状态未知'
)
const signalLabel = computed(() => (props.isAdmin ? '7天问答' : '系统状态'))
const signalValue = computed(() => {
  if (props.isAdmin) return props.qaTrendTotal
  return props.systemHealthy === false ? '异常' : props.systemStatus ? '正常' : '未知'
})
const signalNote = computed(() => {
  if (props.isAdmin) return `峰值 ${props.qaPeakValue} 次`
  return props.systemStatus || '等待状态返回'
})
const insight = computed(() => {
  if (!props.isAdmin) {
    if (props.docCount === 0) return '当前还没有你可访问的知识文档，建议先补充知识内容。'
    return `你当前可访问 ${props.docCount} 篇文档，其中 ${props.readyCount} 篇已完成索引。`
  }
  if (props.qaTrendTotal === 0) {
    return `当前共管理 ${props.docCount} 篇文档、${props.userCount} 个系统用户，等待更多问答沉淀。`
  }
  return `近 7 天共发生 ${props.qaTrendTotal} 次问答，系统当前已完成 ${props.readyRate}% 文档索引。`
})
</script>

<style scoped>
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
  grid-column: 1 / -1;
  min-height: 92px;
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

@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1100px) {
  .signal-grid { grid-template-columns: 1fr; }
  .hero-side-footer { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 960px) {
  .hero-card { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .hero-card { padding: 18px; }
  .hero-title { font-size: 22px; }
  .hero-strip { gap: 8px; }
}
</style>
