<template>
  <article class="panel panel-status animate-rise-in">
    <div class="panel-header">
      <div>
        <div class="panel-kicker">索引健康</div>
        <div class="panel-title">文档状态分布</div>
        <div class="panel-subtitle">已索引、已上传与失败文档的当前占比</div>
      </div>
      <span class="panel-caption">索引完成率 {{ readyRate }}%</span>
    </div>

    <div class="status-layout">
      <div class="status-donut" :style="donutStyle">
        <div class="status-donut-inner">
          <strong>{{ readyRate }}%</strong>
          <span>已完成索引</span>
          <small>{{ docCount }} 篇总文档</small>
        </div>
      </div>

      <div class="status-legend">
        <div v-for="item in items" :key="item.key" class="legend-item">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface StatusItem {
  key: string
  label: string
  color: string
  value: number
  percent: number
}

const props = defineProps<{
  items: StatusItem[]
  readyRate: number
  docCount: number
}>()

const donutStyle = computed(() => {
  if (props.docCount === 0) {
    return { background: 'conic-gradient(#e5edf8 0deg 360deg)' }
  }
  let angle = 0
  const segments = props.items.map((item) => {
    const nextAngle = angle + (item.value / props.docCount) * 360
    const segment = `${item.color} ${angle}deg ${nextAngle}deg`
    angle = nextAngle
    return segment
  })
  return { background: `conic-gradient(${segments.join(', ')})` }
})
</script>

<style scoped>
.panel {
  position: relative;
  overflow: hidden;
  padding: 14px 16px 14px;
  border-radius: 20px;
  border: 1px solid #e6edf7;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  animation-delay: 0.25s;
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

.panel-status {
  background: linear-gradient(180deg, #ffffff 0%, #fffaf2 100%);
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

.status-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 144px minmax(0, 1fr);
  align-items: center;
  gap: 28px;
}

.status-donut {
  width: 144px;
  height: 144px;
  border-radius: 50%;
  padding: 12px;
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
  font-size: 24px;
  line-height: 1;
  color: #10233f;
}

.status-donut-inner span {
  margin-top: 8px;
  font-size: 12px;
}

.status-donut-inner small {
  margin-top: 4px;
  font-size: 11px;
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
  padding: 10px 14px;
  border-radius: 12px;
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


@media (max-width: 1100px) {
  .status-layout {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}

@media (max-width: 640px) {
  .panel { padding: 18px; }
  .status-donut { width: 160px; height: 160px; padding: 14px; }
}
</style>
