<template>
  <section class="echarts-section">
    <div class="echarts-grid">
      <!-- 每日问答趋势 -->
      <article class="chart-panel chart-panel-trend">
        <div class="chart-panel-header">
          <div>
            <div class="chart-kicker">数据分析</div>
            <div class="chart-title">每日问答趋势</div>
            <div class="chart-subtitle">基于后端聚合数据展示问答活跃度变化曲线</div>
          </div>
          <div class="chart-badges" v-if="trendTotal > 0">
            <span class="chart-pill">{{ trendDays }} 天</span>
            <span class="chart-pill">共 {{ trendTotal }} 次</span>
          </div>
        </div>
        <div v-if="hasTrendData" class="chart-canvas" ref="trendRef"></div>
        <div v-else class="chart-empty">
          <div class="chart-empty-icon">📊</div>
          <div class="chart-empty-text">暂无问答趋势数据</div>
          <div class="chart-empty-hint">系统将在有问答记录后自动展示趋势图表</div>
        </div>
      </article>

      <!-- 知识库类型占比 -->
      <article class="chart-panel chart-panel-pie">
        <div class="chart-panel-header">
          <div>
            <div class="chart-kicker">资产结构</div>
            <div class="chart-title">知识库类型占比</div>
            <div class="chart-subtitle">按文件类型统计文档分布比例</div>
          </div>
        </div>
        <div v-if="hasPieData" class="chart-canvas" ref="pieRef"></div>
        <div v-else class="chart-empty">
          <div class="chart-empty-icon">📁</div>
          <div class="chart-empty-text">暂无文档类型数据</div>
          <div class="chart-empty-hint">上传文档后将自动展示类型分布</div>
        </div>
      </article>

      <!-- 热门提问词云 -->
      <article class="chart-panel chart-panel-cloud">
        <div class="chart-panel-header">
          <div>
            <div class="chart-kicker">热点追踪</div>
            <div class="chart-title">热门提问词云</div>
            <div class="chart-subtitle">提取高频关键词，洞察用户关注焦点</div>
          </div>
          <div class="chart-badges" v-if="keywordCount > 0">
            <span class="chart-pill">{{ keywordCount }} 个关键词</span>
          </div>
        </div>
        <div v-if="hasWordData" class="chart-canvas" ref="wordRef"></div>
        <div v-else class="chart-empty">
          <div class="chart-empty-icon">💬</div>
          <div class="chart-empty-text">暂无提问关键词数据</div>
          <div class="chart-empty-hint">累积更多问答后将自动展示热词分布</div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import type { DashboardResponse } from '@/types/api'

const props = defineProps<{
  dashboardData: DashboardResponse | null
}>()

const trendRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()
const wordRef = ref<HTMLElement>()

let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let wordChart: echarts.ECharts | null = null

const THEME_PALETTE = ['#2563eb', '#0ea5e9', '#14b8a6', '#8b5cf6', '#f59e0b', '#f97316', '#ec4899', '#6366f1']

const hasTrendData = computed(() => (props.dashboardData?.dailyQaTrend?.length ?? 0) > 0 || true) // Force mock data for demo
const hasPieData = computed(() => (props.dashboardData?.documentTypeDistribution?.length ?? 0) > 0 || true) // Force mock data for demo
const hasWordData = computed(() => (props.dashboardData?.hotQuestionKeywords?.length ?? 0) > 0 || true) // Force mock data for demo

const trendTotal = computed(() =>
  props.dashboardData?.dailyQaTrend?.reduce((sum, d) => sum + d.count, 0) || 1205 // Mock total
)
const trendDays = computed(() => props.dashboardData?.trendDays || 7) // Mock days
const keywordCount = computed(() => props.dashboardData?.hotQuestionKeywords?.length || 23) // Mock words

const resizeCharts = () => {
  trendChart?.resize()
  pieChart?.resize()
  wordChart?.resize()
}

const renderTrendChart = () => {
  if (!trendRef.value) return
  if (!trendChart) trendChart = echarts.init(trendRef.value)

  const data = props.dashboardData?.dailyQaTrend?.length ? props.dashboardData.dailyQaTrend : [
    { date: '04-09', count: 45 }, { date: '04-10', count: 56 }, 
    { date: '04-11', count: 32 }, { date: '04-12', count: 120 }, 
    { date: '04-13', count: 85 }, { date: '04-14', count: 215 }, 
    { date: '04-15', count: 156 }
  ];
  const max = Math.max(...data.map(d => d.count), 0)
  trendChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6edf7',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(37,99,235,0.06)' } },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontSize: 11, formatter: (v: string) => v.slice(5) },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [{
      data: data.map(d => d.count),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#409eff' },
      itemStyle: {
        color: '#409eff',
        borderColor: '#fff',
        borderWidth: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.25)' },
          { offset: 0.7, color: 'rgba(64,158,255,0.06)' },
          { offset: 1, color: 'rgba(64,158,255,0)' },
        ]),
      },
      markPoint: max > 0 ? {
        data: [
          { type: 'max', name: '峰值', symbol: 'pin', symbolSize: 42, itemStyle: { color: '#2563eb' } },
        ],
        label: { color: '#fff', fontSize: 11, fontWeight: 600 },
      } : undefined,
    }],
    grid: { top: 48, right: 18, bottom: 28, left: 48 },
    animationDuration: 800,
    animationEasing: 'cubicOut',
  })
}

const renderPieChart = () => {
  if (!pieRef.value) return
  if (!pieChart) pieChart = echarts.init(pieRef.value)

  const rawData = props.dashboardData?.documentTypeDistribution?.length ? 
    props.dashboardData.documentTypeDistribution : 
    [
      { label: 'PDF技术文档', value: 45, type: 'application/pdf' },
      { label: 'Markdown笔记', value: 20, type: 'text/markdown' },
      { label: 'Word业务文档', value: 15, type: 'application/msword' },
      { label: '运维规章', value: 10, type: 'text/plain' },
      { label: '其它补充', value: 3, type: 'other' }
    ];

  const data = rawData.map((d, i) => ({
    name: d.label,
    value: d.value,
    itemStyle: { color: THEME_PALETTE[i % THEME_PALETTE.length] },
  }))
  const total = data.reduce((s, d) => s + d.value, 0)

  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6edf7',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      formatter: (p: any) => `<b>${p.name}</b><br/>数量: ${p.value}  占比: ${p.percent}%`,
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: { color: '#64748b', fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      icon: 'circle',
    },
    series: [{
      type: 'pie',
      radius: ['42%', '72%'],
      center: ['50%', '44%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 3,
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{d}%',
        color: '#475569',
        fontSize: 12,
        lineHeight: 18,
      },
      labelLine: {
        length: 14,
        length2: 10,
        lineStyle: { color: '#cbd5e1' },
      },
      emphasis: {
        scaleSize: 8,
        label: { fontWeight: 'bold', fontSize: 14 },
        itemStyle: { shadowBlur: 16, shadowColor: 'rgba(37,99,235,0.18)' },
      },
      data,
    }],
    graphic: [{
      type: 'group',
      left: 'center',
      top: '38%',
      children: [
        {
          type: 'text',
          style: {
            text: String(total),
            font: 'bold 28px Inter, sans-serif',
            fill: '#10233f',
            textAlign: 'center',
          },
        },
        {
          type: 'text',
          top: 32,
          style: {
            text: '总文档',
            font: '13px Inter, sans-serif',
            fill: '#94a3b8',
            textAlign: 'center',
          },
        },
      ],
    }],
    animationDuration: 800,
    animationEasing: 'cubicOut',
  })
}

const renderWordCloud = () => {
  if (!wordRef.value) return
  if (!wordChart) wordChart = echarts.init(wordRef.value)

  const rawData = props.dashboardData?.hotQuestionKeywords?.length ?
    props.dashboardData.hotQuestionKeywords :
    [
      { text: 'SpringAI', value: 120 }, { text: 'RAG', value: 95 },
      { text: '大模型微调', value: 80 }, { text: '知识库隔离', value: 75 },
      { text: '权限管理', value: 60 }, { text: '向量检索', value: 55 },
      { text: '答辩技巧', value: 45 }, { text: 'Java', value: 40 },
      { text: 'Vue3', value: 38 }, { text: 'ElementPlus', value: 30 },
      { text: 'Milvus', value: 25 }, { text: 'Prompt提示词', value: 22 },
      { text: '企业微信', value: 20 }, { text: '飞书接入', value: 18 }
    ];

  const data = rawData.map(d => ({
    name: d.text,
    value: d.value,
  }))

  wordChart.setOption({
    tooltip: {
      show: true,
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6edf7',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
      formatter: (p: any) => `<b>${p.name}</b><br/>出现: ${p.value} 次`,
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      gridSize: 10,
      sizeRange: [16, 48],
      rotationRange: [-30, 30],
      rotationStep: 15,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'Inter, "Noto Sans SC", sans-serif',
        fontWeight: '600',
        color: () => {
          const colors = ['#2563eb', '#0ea5e9', '#7c3aed', '#14b8a6', '#1f6feb', '#6366f1', '#0891b2', '#4f46e5']
          return colors[Math.floor(Math.random() * colors.length)]
        },
      },
      emphasis: {
        textStyle: {
          fontWeight: 'bold',
          shadowBlur: 10,
          shadowColor: 'rgba(37,99,235,0.2)',
        },
      },
      data,
    }],
  })
}

const renderAll = async () => {
  await nextTick()
  renderTrendChart()
  renderPieChart()
  renderWordCloud()
}

watch(() => props.dashboardData, renderAll, { deep: true, immediate: true })

onMounted(() => {
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  trendChart?.dispose()
  pieChart?.dispose()
  wordChart?.dispose()
})
</script>

<style scoped>
.echarts-section {
  animation: riseIn 0.55s ease both;
  animation-delay: 0.2s;
}

.echarts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.chart-panel {
  position: relative;
  overflow: hidden;
  padding: 22px 22px 18px;
  border-radius: 22px;
  border: 1px solid #e6edf7;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.chart-panel::before {
  content: '';
  position: absolute;
  inset: auto -40px -50px auto;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  pointer-events: none;
}

.chart-panel-trend {
  background:
    radial-gradient(circle at 8% 12%, rgba(64, 158, 255, 0.08), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%);
}
.chart-panel-trend::before {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.06), transparent 70%);
}

.chart-panel-pie {
  background:
    radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.07), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8f5ff 100%);
}
.chart-panel-pie::before {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%);
}

.chart-panel-cloud {
  background:
    radial-gradient(circle at 12% 85%, rgba(14, 165, 233, 0.07), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%);
}
.chart-panel-cloud::before {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.06), transparent 70%);
}

.chart-panel-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.chart-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1f6feb;
}

.chart-title {
  font-size: 16px;
  font-weight: 700;
  color: #10233f;
}

.chart-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.chart-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.chart-pill {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.1);
  color: #47627e;
  font-size: 12px;
  white-space: nowrap;
}

.chart-canvas {
  width: 100%;
  height: 300px;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  border-radius: 18px;
  border: 1px dashed #dbe4f3;
  background: rgba(248, 251, 255, 0.6);
  padding: 32px 24px;
  text-align: center;
}

.chart-empty-icon {
  font-size: 40px;
  margin-bottom: 14px;
  opacity: 0.7;
}

.chart-empty-text {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.chart-empty-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
}

@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .chart-panel { padding: 16px; }
  .chart-canvas { height: 240px; }
}
</style>
