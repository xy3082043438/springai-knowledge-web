<template>
  <article class="panel animate-rise-in" :class="panelClass">
    <div class="panel-header">
      <div>
        <div class="panel-kicker">{{ kicker }}</div>
        <div class="panel-title">{{ title }}</div>
        <div class="panel-subtitle">{{ subtitle }}</div>
      </div>
    </div>

    <div v-if="items.length > 0" class="distribution-list">
      <div v-for="(item, index) in items" :key="item.label" class="distribution-item">
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
    <div v-else class="empty-state">{{ emptyText }}</div>
  </article>
</template>

<script setup lang="ts">
export interface DistributionItem {
  label: string
  value: number
  percent: number
  color: string
}

defineProps<{
  kicker: string
  title: string
  subtitle: string
  panelClass: string
  emptyText: string
  items: DistributionItem[]
}>()
</script>

<style scoped>
.panel {
  position: relative;
  overflow: hidden;
  padding: 14px 16px 14px;
  border-radius: 20px;
  border: 1px solid #e6edf7;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
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

.distribution-list {
  margin-top: 14px;
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
  height: 8px;
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
  margin-top: 14px;
  min-height: 120px;
  border-radius: 16px;
  border: 1px dashed #dbe4f3;
  background: #f8fbff;
  color: #7c8798;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}


@media (max-width: 640px) {
  .panel { padding: 18px; }
}
</style>
