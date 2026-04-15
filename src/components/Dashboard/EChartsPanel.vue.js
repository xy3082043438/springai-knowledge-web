/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
const props = defineProps();
const trendRef = ref();
const pieRef = ref();
const wordRef = ref();
let trendChart = null;
let pieChart = null;
let wordChart = null;
const THEME_PALETTE = ['#2563eb', '#0ea5e9', '#14b8a6', '#8b5cf6', '#f59e0b', '#f97316', '#ec4899', '#6366f1'];
const hasTrendData = computed(() => (props.dashboardData?.dailyQaTrend?.length ?? 0) > 0 || true); // Force mock data for demo
const hasPieData = computed(() => (props.dashboardData?.documentTypeDistribution?.length ?? 0) > 0 || true); // Force mock data for demo
const hasWordData = computed(() => (props.dashboardData?.hotQuestionKeywords?.length ?? 0) > 0 || true); // Force mock data for demo
const trendTotal = computed(() => props.dashboardData?.dailyQaTrend?.reduce((sum, d) => sum + d.count, 0) || 1205 // Mock total
);
const trendDays = computed(() => props.dashboardData?.trendDays || 7); // Mock days
const keywordCount = computed(() => props.dashboardData?.hotQuestionKeywords?.length || 23); // Mock words
const resizeCharts = () => {
    trendChart?.resize();
    pieChart?.resize();
    wordChart?.resize();
};
const renderTrendChart = () => {
    if (!trendRef.value)
        return;
    if (!trendChart)
        trendChart = echarts.init(trendRef.value);
    const data = props.dashboardData?.dailyQaTrend?.length ? props.dashboardData.dailyQaTrend : [
        { date: '04-09', count: 45 }, { date: '04-10', count: 56 },
        { date: '04-11', count: 32 }, { date: '04-12', count: 120 },
        { date: '04-13', count: 85 }, { date: '04-14', count: 215 },
        { date: '04-15', count: 156 }
    ];
    const max = Math.max(...data.map(d => d.count), 0);
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
            axisLabel: { color: '#64748b', fontSize: 11, formatter: (v) => v.slice(5) },
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
    });
};
const renderPieChart = () => {
    if (!pieRef.value)
        return;
    if (!pieChart)
        pieChart = echarts.init(pieRef.value);
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
    }));
    const total = data.reduce((s, d) => s + d.value, 0);
    pieChart.setOption({
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderColor: '#e6edf7',
            borderWidth: 1,
            textStyle: { color: '#334155', fontSize: 13 },
            formatter: (p) => `<b>${p.name}</b><br/>数量: ${p.value}  占比: ${p.percent}%`,
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
    });
};
const renderWordCloud = () => {
    if (!wordRef.value)
        return;
    if (!wordChart)
        wordChart = echarts.init(wordRef.value);
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
    }));
    wordChart.setOption({
        tooltip: {
            show: true,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderColor: '#e6edf7',
            borderWidth: 1,
            textStyle: { color: '#334155', fontSize: 13 },
            formatter: (p) => `<b>${p.name}</b><br/>出现: ${p.value} 次`,
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
                        const colors = ['#2563eb', '#0ea5e9', '#7c3aed', '#14b8a6', '#1f6feb', '#6366f1', '#0891b2', '#4f46e5'];
                        return colors[Math.floor(Math.random() * colors.length)];
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
    });
};
const renderAll = async () => {
    await nextTick();
    renderTrendChart();
    renderPieChart();
    renderWordCloud();
};
watch(() => props.dashboardData, renderAll, { deep: true, immediate: true });
onMounted(() => {
    window.addEventListener('resize', resizeCharts);
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeCharts);
    trendChart?.dispose();
    pieChart?.dispose();
    wordChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-pie']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-cloud']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-canvas']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "echarts-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "echarts-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "chart-panel chart-panel-trend" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-subtitle" },
});
if (__VLS_ctx.trendTotal > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-badges" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chart-pill" },
    });
    (__VLS_ctx.trendDays);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chart-pill" },
    });
    (__VLS_ctx.trendTotal);
}
if (__VLS_ctx.hasTrendData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-canvas" },
        ref: "trendRef",
    });
    /** @type {typeof __VLS_ctx.trendRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-hint" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "chart-panel chart-panel-pie" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-subtitle" },
});
if (__VLS_ctx.hasPieData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-canvas" },
        ref: "pieRef",
    });
    /** @type {typeof __VLS_ctx.pieRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-hint" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "chart-panel chart-panel-cloud" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-subtitle" },
});
if (__VLS_ctx.keywordCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-badges" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chart-pill" },
    });
    (__VLS_ctx.keywordCount);
}
if (__VLS_ctx.hasWordData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-canvas" },
        ref: "wordRef",
    });
    /** @type {typeof __VLS_ctx.wordRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-empty-hint" },
    });
}
/** @type {__VLS_StyleScopedClasses['echarts-section']} */ ;
/** @type {__VLS_StyleScopedClasses['echarts-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-pie']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-cloud']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-empty-hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            trendRef: trendRef,
            pieRef: pieRef,
            wordRef: wordRef,
            hasTrendData: hasTrendData,
            hasPieData: hasPieData,
            hasWordData: hasWordData,
            trendTotal: trendTotal,
            trendDays: trendDays,
            keywordCount: keywordCount,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=EChartsPanel.vue.js.map