<template>
  <section class="metric-grid">
    <article
      v-for="card in cards"
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
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface MetricCard {
  label: string
  value: string | number
  note: string
  color: string
  softColor: string
  icon: Component
}

defineProps<{ cards: MetricCard[] }>()
</script>

<style scoped>
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

.metric-card:nth-child(1) { animation-delay: 0.04s; }
.metric-card:nth-child(2) { animation-delay: 0.08s; }
.metric-card:nth-child(3) { animation-delay: 0.12s; }
.metric-card:nth-child(4) { animation-delay: 0.16s; }

@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
