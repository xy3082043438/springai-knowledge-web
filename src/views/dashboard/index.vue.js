/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, markRaw, onMounted, reactive, ref } from 'vue';
import { ChatDotRound, Document, Monitor, User } from '@element-plus/icons-vue';
import { listDocuments } from '@/api/business/document';
import { getSystemStatus } from '@/api/system/config';
import { getDashboard } from '@/api/dashboard';
import { searchQaLogs } from '@/api/system/log';
import { listUsers } from '@/api/system/user';
import { useUserStore } from '@/store/user';
import { isAdminRole } from '@/utils/access';
import DashboardHero from '@/components/Dashboard/DashboardHero.vue';
import MetricCards from '@/components/Dashboard/MetricCards.vue';
import StatusPanel from '@/components/Dashboard/StatusPanel.vue';
import DistributionPanel from '@/components/Dashboard/DistributionPanel.vue';
import EChartsPanel from '@/components/Dashboard/EChartsPanel.vue';
/* ── Constants ── */
const DAY_MS = 24 * 60 * 60 * 1000;
const distributionPalette = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#8b5cf6'];
const metricIconMap = {
    docs: markRaw(Document),
    qa: markRaw(ChatDotRound),
    users: markRaw(User),
    system: markRaw(Monitor),
};
/* ── State ── */
const stats = reactive({
    docCount: 0,
    qaCount: 0,
    userCount: 0,
    systemStatus: '',
    systemHealthy: null,
});
const loading = ref(false);
const lastUpdatedAt = ref('');
const dashboardData = ref(null);
const documents = ref([]);
const users = ref([]);
const recentQaLogs = ref([]);
const userStore = useUserStore();
const showAdminMetrics = computed(() => isAdminRole(userStore.userInfo?.role));
/* ── Helpers ── */
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
const formatDateTimeParam = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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
/* ── Computed ── */
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
/* ── Data loading ── */
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
        /* Common requests for all users */
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
        /* Admin-only requests */
        if (showAdminMetrics.value) {
            const now = new Date();
            const trendFrom = formatDateTimeParam(startOfDay(new Date(now.getTime() - 6 * DAY_MS)));
            const trendTo = formatDateTimeParam(endOfDay(now));
            const adminResults = await Promise.allSettled([
                listUsers(),
                searchQaLogs({ page: 0, size: 1 }),
                searchQaLogs({ page: 0, size: 500, from: trendFrom, to: trendTo }),
                getDashboard(),
            ]);
            const [userRes, qaTotalRes, qaTrendRes, dashboardRes] = adminResults;
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
            if (dashboardRes.status === 'fulfilled') {
                dashboardData.value = dashboardRes.value.data;
                // Use dashboard overview to fill any missing stats
                const overview = dashboardRes.value.data.overview;
                if (overview) {
                    if (stats.userCount === 0)
                        stats.userCount = overview.totalUsers;
                    if (stats.qaCount === 0)
                        stats.qaCount = overview.totalQaCount;
                }
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
/** @type {__VLS_StyleScopedClasses['panel-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid-admin']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-wide']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-container" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {[typeof DashboardHero, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DashboardHero, new DashboardHero({
    ...{ 'onRefresh': {} },
    docCount: (__VLS_ctx.stats.docCount),
    qaCount: (__VLS_ctx.stats.qaCount),
    userCount: (__VLS_ctx.stats.userCount),
    readyCount: (__VLS_ctx.readyCount),
    readyRate: (__VLS_ctx.readyRate),
    systemStatus: (__VLS_ctx.stats.systemStatus),
    systemHealthy: (__VLS_ctx.stats.systemHealthy),
    topTypeLabel: (__VLS_ctx.topDocumentTypeLabel),
    topTypeShare: (__VLS_ctx.topDocumentTypeShare),
    qaTrendTotal: (__VLS_ctx.qaTrendTotal),
    qaPeakValue: (__VLS_ctx.qaPeakValue),
    isAdmin: (__VLS_ctx.showAdminMetrics),
    lastUpdatedText: (__VLS_ctx.lastUpdatedText),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onRefresh': {} },
    docCount: (__VLS_ctx.stats.docCount),
    qaCount: (__VLS_ctx.stats.qaCount),
    userCount: (__VLS_ctx.stats.userCount),
    readyCount: (__VLS_ctx.readyCount),
    readyRate: (__VLS_ctx.readyRate),
    systemStatus: (__VLS_ctx.stats.systemStatus),
    systemHealthy: (__VLS_ctx.stats.systemHealthy),
    topTypeLabel: (__VLS_ctx.topDocumentTypeLabel),
    topTypeShare: (__VLS_ctx.topDocumentTypeShare),
    qaTrendTotal: (__VLS_ctx.qaTrendTotal),
    qaPeakValue: (__VLS_ctx.qaPeakValue),
    isAdmin: (__VLS_ctx.showAdminMetrics),
    lastUpdatedText: (__VLS_ctx.lastUpdatedText),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onRefresh: (__VLS_ctx.loadDashboard)
};
var __VLS_2;
/** @type {[typeof MetricCards, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(MetricCards, new MetricCards({
    cards: (__VLS_ctx.metricCards),
}));
const __VLS_8 = __VLS_7({
    cards: (__VLS_ctx.metricCards),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "panel-grid" },
    ...{ class: ({ 'panel-grid-admin': __VLS_ctx.showAdminMetrics }) },
});
/** @type {[typeof StatusPanel, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(StatusPanel, new StatusPanel({
    items: (__VLS_ctx.documentStatusItems),
    readyRate: (__VLS_ctx.readyRate),
    docCount: (__VLS_ctx.stats.docCount),
}));
const __VLS_11 = __VLS_10({
    items: (__VLS_ctx.documentStatusItems),
    readyRate: (__VLS_ctx.readyRate),
    docCount: (__VLS_ctx.stats.docCount),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
if (__VLS_ctx.showAdminMetrics) {
    /** @type {[typeof DistributionPanel, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(DistributionPanel, new DistributionPanel({
        kicker: "角色结构",
        title: "用户角色分布",
        subtitle: "按角色查看当前系统用户结构",
        panelClass: "panel-roles",
        emptyText: "暂无用户角色数据",
        items: (__VLS_ctx.roleDistributionItems),
    }));
    const __VLS_14 = __VLS_13({
        kicker: "角色结构",
        title: "用户角色分布",
        subtitle: "按角色查看当前系统用户结构",
        panelClass: "panel-roles",
        emptyText: "暂无用户角色数据",
        items: (__VLS_ctx.roleDistributionItems),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
if (__VLS_ctx.showAdminMetrics && __VLS_ctx.dashboardData) {
    /** @type {[typeof EChartsPanel, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(EChartsPanel, new EChartsPanel({
        dashboardData: (__VLS_ctx.dashboardData),
    }));
    const __VLS_17 = __VLS_16({
        dashboardData: (__VLS_ctx.dashboardData),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
}
/** @type {__VLS_StyleScopedClasses['dashboard-container']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DashboardHero: DashboardHero,
            MetricCards: MetricCards,
            StatusPanel: StatusPanel,
            DistributionPanel: DistributionPanel,
            EChartsPanel: EChartsPanel,
            stats: stats,
            loading: loading,
            dashboardData: dashboardData,
            showAdminMetrics: showAdminMetrics,
            documentStatusItems: documentStatusItems,
            readyCount: readyCount,
            readyRate: readyRate,
            roleDistributionItems: roleDistributionItems,
            qaTrendTotal: qaTrendTotal,
            qaPeakValue: qaPeakValue,
            topDocumentTypeLabel: topDocumentTypeLabel,
            topDocumentTypeShare: topDocumentTypeShare,
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