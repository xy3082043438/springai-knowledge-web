<template>
  <article class="panel panel-wide panel-trend">
    <div class="panel-header">
      <div>
        <div class="panel-kicker">活跃趋势</div>
        <div class="panel-title">近 7 天问答趋势</div>
        <div class="panel-subtitle">按自然日聚合问答记录，观察近期活跃度变化</div>
      </div>
      <div class="panel-badges">
        <span class="soft-pill">总计 {{ trendTotal }} 次</span>
        <span class="soft-pill">峰值 {{ peakValue }} 次</span>
      </div>
    </div>

    <div v-if="trendTotal > 0" class="trend-chart">
      <div v-for="item in items" :key="item.key" class="trend-column">
        <div class="trend-count">{{ item.value }}</div>
        <div class="trend-track">
          <div class="trend-bar" :style="{ height: `${item.height}%` }"></div>
        </div>
        <div class="trend-label">{{ item.label }}</div>
      </div>
    </div>
    <div v-else class="empty-state">最近 7 天暂无问答记录</div>
  </article>
</template>

<script setup lang="ts">
export interface TrendItem {
  key: string
  label: string
  value: number
  height: number
}

defineProps<{
  items: TrendItem[]
  trendTotal: number
  peakValue: number
}>()
</script>

<style scoped>
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

.panel-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.soft-pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.1);
  color: #47627e;
  font-size: 12px;
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
  background: linear-gradient(180deg, #eef4ff, #f8fbff);
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

.trend-bar {
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #7ab8ff 0%, #409eff 45%, #1f6feb 100%);
  box-shadow: 0 14px 24px rgba(64, 158, 255, 0.22);
  transition: height 0.25s ease;
}

.trend-label {
  font-size: 12px;
  color: #64748b;
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

@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .trend-chart { gap: 8px; }
  .trend-track { height: 140px; padding: 8px; }
}
</style>
