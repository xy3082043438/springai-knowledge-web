/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, markRaw, onMounted, reactive, ref } from 'vue';
import { ChatDotRound, Document, Monitor, User } from '@element-plus/icons-vue';
import { listDocuments } from '@/api/document';
import { getSystemStatus } from '@/api/config';
import { searchQaLogs } from '@/api/log';
import { listUsers } from '@/api/user';
import { useUserStore } from '@/store/user';
import { isAdminRole } from '@/utils/access';
const DAY_MS = 24 * 60 * 60 * 1000;
const distributionPalette = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#8b5cf6'];
const metricIconMap = {
    docs: markRaw(Document),
    qa: markRaw(ChatDotRound),
    users: markRaw(User),
    system: markRaw(Monitor),
};
const stats = reactive({
    docCount: 0,
    qaCount: 0,
    userCount: 0,
    systemStatus: '',
    systemHealthy: null,
});
const loading = ref(false);
const lastUpdatedAt = ref('');
const documents = ref([]);
const users = ref([]);
const recentQaLogs = ref([]);
const userStore = useUserStore();
const showAdminMetrics = computed(() => isAdminRole(userStore.userInfo?.role));
const startOfDay = (date) => {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
};
const endOfDay = (date) => {
    const next = new Date(date);
    next.setHours(23, 59, 59, 0);
    return next;
};
const pad = (value) => String(value).padStart(2, '0');
const formatDateTimeParam = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const formatDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatShortDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value;
    return `${date.getMonth() + 1}/${date.getDate()}`;
};
const formatDateTimeLabel = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return '刚刚';
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};
const statusMeta = {
    READY: { label: '已索引', color: '#22c55e' },
    UPLOADED: { label: '待处理', color: '#f59e0b' },
    FAILED: { label: '失败', color: '#ef4444' },
};
const getFileExtension = (fileName) => {
    if (!fileName)
        return '';
    const index = fileName.lastIndexOf('.');
    return index >= 0 ? fileName.slice(index + 1).toLowerCase() : '';
};
const getDocumentType = (doc) => {
    const extension = getFileExtension(doc.fileName);
    if (extension === 'markdown')
        return 'MD';
    if (extension === 'htm')
        return 'HTML';
    if (extension)
        return extension.toUpperCase();
    if (doc.contentType?.includes('markdown'))
        return 'MD';
    if (doc.contentType?.includes('html'))
        return 'HTML';
    if (doc.contentType?.includes('csv'))
        return 'CSV';
    if (doc.contentType?.includes('text/plain'))
        return 'TXT';
    return 'TEXT';
};
const buildDistribution = (labels) => {
    if (labels.length === 0)
        return [];
    const counter = new Map();
    labels.forEach((label) => {
        counter.set(label, (counter.get(label) || 0) + 1);
    });
    return [...counter.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, value], index) => ({
        label,
        value,
        percent: Math.round((value / labels.length) * 100),
        color: distributionPalette[index % distributionPalette.length],
    }));
};
const documentStatusItems = computed(() => {
    const total = documents.value.length;
    return Object.entries(statusMeta).map(([key, meta]) => {
        const value = documents.value.filter((doc) => doc.status === key).length;
        return {
            key,
            label: meta.label,
            color: meta.color,
            value,
            percent: total > 0 ? Math.round((value / total) * 100) : 0,
        };
    });
});
const readyCount = computed(() => documentStatusItems.value.find((item) => item.key === 'READY')?.value || 0);
const failedCount = computed(() => documentStatusItems.value.find((item) => item.key === 'FAILED')?.value || 0);
const readyRate = computed(() => (stats.docCount > 0 ? Math.round((readyCount.value / stats.docCount) * 100) : 0));
const documentStatusStyle = computed(() => {
    if (stats.docCount === 0) {
        return { background: 'conic-gradient(#e5edf8 0deg 360deg)' };
    }
    let angle = 0;
    const segments = documentStatusItems.value.map((item) => {
        const nextAngle = angle + (item.value / stats.docCount) * 360;
        const segment = `${item.color} ${angle}deg ${nextAngle}deg`;
        angle = nextAngle;
        return segment;
    });
    return { background: `conic-gradient(${segments.join(', ')})` };
});
const documentTypeItems = computed(() => buildDistribution(documents.value.map((doc) => getDocumentType(doc))));
const roleDistributionItems = computed(() => buildDistribution(users.value.map((user) => user.role || '未分配')));
const qaTrendItems = computed(() => {
    const today = startOfDay(new Date());
    const seed = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today.getTime() - (6 - index) * DAY_MS);
        return {
            key: formatDateKey(date),
            label: formatShortDate(date.toISOString()),
            value: 0,
        };
    });
    const valueMap = new Map(seed.map((item) => [item.key, 0]));
    recentQaLogs.value.forEach((log) => {
        const key = formatDateKey(new Date(log.createdAt));
        if (valueMap.has(key)) {
            valueMap.set(key, (valueMap.get(key) || 0) + 1);
        }
    });
    const maxValue = Math.max(...valueMap.values(), 0);
    return seed.map((item) => {
        const value = valueMap.get(item.key) || 0;
        return {
            ...item,
            value,
            height: maxValue > 0 ? Math.max(12, Math.round((value / maxValue) * 100)) : 0,
        };
    });
});
const qaTrendTotal = computed(() => qaTrendItems.value.reduce((sum, item) => sum + item.value, 0));
const qaPeakValue = computed(() => Math.max(...qaTrendItems.value.map((item) => item.value), 0));
const topDocumentTypeLabel = computed(() => documentTypeItems.value[0]?.label || '未导入');
const topDocumentTypeShare = computed(() => documentTypeItems.value[0]?.percent || 0);
const heroSignalLabel = computed(() => (showAdminMetrics.value ? '7天问答' : '系统状态'));
const heroSignalValue = computed(() => {
    if (showAdminMetrics.value)
        return qaTrendTotal.value;
    return stats.systemHealthy === false ? '异常' : (stats.systemStatus ? '正常' : '未知');
});
const heroSignalNote = computed(() => {
    if (showAdminMetrics.value)
        return `峰值 ${qaPeakValue.value} 次`;
    return stats.systemStatus || '等待状态返回';
});
const heroInsight = computed(() => {
    if (!showAdminMetrics.value) {
        if (stats.docCount === 0)
            return '当前还没有你可访问的知识文档，建议先补充知识内容。';
        return `你当前可访问 ${stats.docCount} 篇文档，其中 ${readyCount.value} 篇已完成索引。`;
    }
    if (qaTrendTotal.value === 0) {
        return `当前共管理 ${stats.docCount} 篇文档、${stats.userCount} 个系统用户，等待更多问答沉淀。`;
    }
    return `近 7 天共发生 ${qaTrendTotal.value} 次问答，系统当前已完成 ${readyRate.value}% 文档索引。`;
});
const lastUpdatedText = computed(() => (lastUpdatedAt.value ? formatDateTimeLabel(lastUpdatedAt.value) : '尚未加载'));
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
    ];
    return showAdminMetrics.value ? cards : [cards[0], cards[3]];
});
const loadDashboard = async () => {
    loading.value = true;
    try {
        if (userStore.token && !userStore.userInfo) {
            await userStore.ensureUserInfo();
        }
    }
    catch {
        loading.value = false;
        return;
    }
    try {
        const commonResults = await Promise.allSettled([
            listDocuments(),
            getSystemStatus(),
        ]);
        const [docRes, statusRes] = commonResults;
        if (docRes.status === 'fulfilled') {
            documents.value = docRes.value.data;
            stats.docCount = docRes.value.data.length;
        }
        if (statusRes.status === 'fulfilled') {
            stats.systemStatus = statusRes.value.data.message || statusRes.value.data.status;
            stats.systemHealthy = statusRes.value.data.healthy;
        }
        if (showAdminMetrics.value) {
            const now = new Date();
            const trendFrom = formatDateTimeParam(startOfDay(new Date(now.getTime() - 6 * DAY_MS)));
            const trendTo = formatDateTimeParam(endOfDay(now));
            const adminResults = await Promise.allSettled([
                listUsers(),
                searchQaLogs({ page: 0, size: 1 }),
                searchQaLogs({ page: 0, size: 500, from: trendFrom, to: trendTo }),
            ]);
            const [userRes, qaTotalRes, qaTrendRes] = adminResults;
            if (userRes.status === 'fulfilled') {
                users.value = userRes.value.data;
                stats.userCount = userRes.value.data.length;
            }
            if (qaTotalRes.status === 'fulfilled') {
                stats.qaCount = qaTotalRes.value.data.total;
            }
            if (qaTrendRes.status === 'fulfilled') {
                recentQaLogs.value = qaTrendRes.value.data.items;
            }
        }
        else {
            users.value = [];
            recentQaLogs.value = [];
            stats.qaCount = 0;
            stats.userCount = 0;
        }
    }
    finally {
        lastUpdatedAt.value = new Date().toISOString();
        loading.value = false;
    }
};
onMounted(() => {
    loadDashboard();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dashboard-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card-amber']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['soft-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['status-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid-admin']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-strip']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-container" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hero-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-copy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-eyebrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-strip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-chip" },
});
(__VLS_ctx.stats.docCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-chip" },
});
(__VLS_ctx.topDocumentTypeLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-chip" },
});
(__VLS_ctx.showAdminMetrics ? `${__VLS_ctx.stats.qaCount} 次累计问答` : `${__VLS_ctx.readyRate}% 已索引`);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-tags" },
});
const __VLS_0 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    type: (__VLS_ctx.stats.systemHealthy === false ? 'danger' : (__VLS_ctx.stats.systemStatus ? 'success' : 'info')),
    effect: "light",
}));
const __VLS_2 = __VLS_1({
    type: (__VLS_ctx.stats.systemHealthy === false ? 'danger' : (__VLS_ctx.stats.systemStatus ? 'success' : 'info')),
    effect: "light",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
(__VLS_ctx.stats.systemHealthy === false ? '系统异常' : (__VLS_ctx.stats.systemStatus ? '系统健康' : '状态未知'));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-status" },
});
(__VLS_ctx.stats.systemStatus || '状态加载中...');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-side-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-side-time" },
});
(__VLS_ctx.lastUpdatedText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "signal-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "signal-card signal-card-success" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "signal-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.readyRate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.readyCount);
(__VLS_ctx.stats.docCount || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "signal-card signal-card-cyan" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "signal-label" },
});
(__VLS_ctx.heroSignalLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.heroSignalValue);
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.heroSignalNote);
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "signal-card signal-card-amber" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "signal-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.topDocumentTypeLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.topDocumentTypeShare);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side-note" },
});
(__VLS_ctx.heroInsight);
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "hero-refresh" },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "hero-refresh" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.loadDashboard)
};
__VLS_7.slots.default;
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "metric-grid" },
});
for (const [card] of __VLS_getVForSourceType((__VLS_ctx.metricCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        key: (card.label),
        ...{ class: "metric-card" },
        ...{ style: ({ '--metric-accent': card.color, '--metric-soft': card.softColor }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-icon" },
    });
    const __VLS_12 = ((card.icon));
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-label" },
    });
    (card.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-value" },
    });
    (card.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-note" },
    });
    (card.note);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "panel-grid" },
    ...{ class: ({ 'panel-grid-admin': __VLS_ctx.showAdminMetrics }) },
});
if (__VLS_ctx.showAdminMetrics) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "panel panel-wide panel-trend" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-kicker" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-badges" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "soft-pill" },
    });
    (__VLS_ctx.qaTrendTotal);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "soft-pill" },
    });
    (__VLS_ctx.qaPeakValue);
    if (__VLS_ctx.qaTrendTotal > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "trend-chart" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.qaTrendItems))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (item.key),
                ...{ class: "trend-column" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trend-count" },
            });
            (item.value);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trend-track" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trend-bar" },
                ...{ style: ({ height: `${item.height}%` }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trend-label" },
            });
            (item.label);
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty-state" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "panel panel-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "panel-caption" },
});
(__VLS_ctx.readyRate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-donut" },
    ...{ style: (__VLS_ctx.documentStatusStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-donut-inner" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.readyRate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.stats.docCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-legend" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.documentStatusItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.key),
        ...{ class: "legend-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "legend-dot" },
        ...{ style: ({ background: item.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "legend-copy" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "legend-label" },
    });
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "legend-percent" },
    });
    (item.percent);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "legend-value" },
    });
    (item.value);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "panel panel-types" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-subtitle" },
});
if (__VLS_ctx.documentTypeItems.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "distribution-list" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.documentTypeItems))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.label),
            ...{ class: "distribution-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "distribution-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "distribution-name" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "distribution-rank" },
        });
        (index + 1);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.value);
        (item.percent);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "distribution-track" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "distribution-bar" },
            ...{ style: ({ width: `${Math.max(item.percent, 8)}%`, background: item.color }) },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
}
if (__VLS_ctx.showAdminMetrics) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "panel panel-roles" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-kicker" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-subtitle" },
    });
    if (__VLS_ctx.roleDistributionItems.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "distribution-list" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.roleDistributionItems))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (item.label),
                ...{ class: "distribution-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "distribution-meta" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "distribution-name" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "distribution-rank" },
            });
            (index + 1);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.label);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.value);
            (item.percent);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "distribution-track" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "distribution-bar" },
                ...{ style: ({ width: `${Math.max(item.percent, 8)}%`, background: item.color }) },
            });
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty-state" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['dashboard-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-strip']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-status']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-head']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-label']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-time']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card-success']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-label']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card-cyan']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-label']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card-amber']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-label']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-note']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-refresh']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-note']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['soft-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['soft-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-column']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-count']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-label']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-status']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['status-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-legend']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-item']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-label']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-percent']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-value']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-types']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-list']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-item']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-name']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-rank']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-track']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-roles']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-list']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-item']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-name']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-rank']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-track']} */ ;
/** @type {__VLS_StyleScopedClasses['distribution-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            stats: stats,
            loading: loading,
            showAdminMetrics: showAdminMetrics,
            documentStatusItems: documentStatusItems,
            readyCount: readyCount,
            readyRate: readyRate,
            documentStatusStyle: documentStatusStyle,
            documentTypeItems: documentTypeItems,
            roleDistributionItems: roleDistributionItems,
            qaTrendItems: qaTrendItems,
            qaTrendTotal: qaTrendTotal,
            qaPeakValue: qaPeakValue,
            topDocumentTypeLabel: topDocumentTypeLabel,
            topDocumentTypeShare: topDocumentTypeShare,
            heroSignalLabel: heroSignalLabel,
            heroSignalValue: heroSignalValue,
            heroSignalNote: heroSignalNote,
            heroInsight: heroInsight,
            lastUpdatedText: lastUpdatedText,
            metricCards: metricCards,
            loadDashboard: loadDashboard,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map