/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { searchOperationLogs, exportOperationLogs, searchQaLogs, exportQaLogs } from '@/api/system/log';
import { searchFeedback, exportFeedback } from '@/api/business/feedback';
import { formatDateTime } from '@/utils/date';
const activeTab = ref('operation');
const currentDateRange = ref(null);
const handleQuery = () => {
    if (activeTab.value === 'operation')
        loadOperationLogs();
    else if (activeTab.value === 'qa')
        loadQaLogs();
    else if (activeTab.value === 'feedback')
        loadFeedbacks();
};
// ---- Operation Logs ----
const opLoading = ref(false);
const operationLogs = ref([]);
const opTotal = ref(0);
const opFilter = reactive({ size: 15, currentPage: 1 });
const loadOperationLogs = async () => {
    opLoading.value = true;
    try {
        const params = { page: opFilter.currentPage - 1, size: opFilter.size };
        if (currentDateRange.value?.length === 2) {
            params.from = currentDateRange.value[0];
            params.to = currentDateRange.value[1];
        }
        const { data } = await searchOperationLogs(params);
        operationLogs.value = data.items;
        opTotal.value = data.total;
    }
    finally {
        opLoading.value = false;
    }
};
const exportLoading = ref(false);
const handleExportLogs = async () => {
    exportLoading.value = true;
    try {
        const params = {};
        if (currentDateRange.value?.length === 2) {
            params.from = currentDateRange.value[0];
            params.to = currentDateRange.value[1];
        }
        let res;
        let filename = '';
        if (activeTab.value === 'operation') {
            res = await exportOperationLogs(params);
            filename = '操作日志.xlsx';
        }
        else if (activeTab.value === 'qa') {
            res = await exportQaLogs(params);
            filename = '问答日志.xlsx';
        }
        else if (activeTab.value === 'feedback') {
            res = await exportFeedback(params);
            filename = '用户反馈.xlsx';
        }
        if (res && res.data) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            ElMessage.success(`${activeTab.value === 'operation' ? '操作日志' : activeTab.value === 'qa' ? '问答日志' : '用户反馈'} 导出成功！`);
        }
        else {
            ElMessage.warning('未能获取到导出数据，请重试');
        }
    }
    catch (error) {
        console.error('Export failed', error);
        ElMessage.error('导出失败，可能由于数据量过大或服务器暂不可用。');
    }
    finally {
        exportLoading.value = false;
    }
};
// ---- QA Logs ----
const qaLoading = ref(false);
const qaLogs = ref([]);
const qaTotal = ref(0);
const qaFilter = reactive({ size: 15, currentPage: 1 });
const loadQaLogs = async () => {
    qaLoading.value = true;
    try {
        const params = { page: qaFilter.currentPage - 1, size: qaFilter.size };
        if (currentDateRange.value?.length === 2) {
            params.from = currentDateRange.value[0];
            params.to = currentDateRange.value[1];
        }
        const { data } = await searchQaLogs(params);
        qaLogs.value = data.items;
        qaTotal.value = data.total;
    }
    finally {
        qaLoading.value = false;
    }
};
// ---- Feedbacks ----
const fbLoading = ref(false);
const feedbacks = ref([]);
const fbTotal = ref(0);
const fbFilter = reactive({ size: 15, currentPage: 1 });
const loadFeedbacks = async () => {
    fbLoading.value = true;
    try {
        const params = { page: fbFilter.currentPage - 1, size: fbFilter.size };
        if (currentDateRange.value?.length === 2) {
            params.from = currentDateRange.value[0];
            params.to = currentDateRange.value[1];
        }
        const { data } = await searchFeedback(params);
        feedbacks.value = data.items;
        fbTotal.value = data.total;
    }
    finally {
        fbLoading.value = false;
    }
};
const handleTabChange = (tab) => {
    if (tab === 'operation' && operationLogs.value.length === 0)
        loadOperationLogs();
    else if (tab === 'qa' && qaLogs.value.length === 0)
        loadQaLogs();
    else if (tab === 'feedback' && feedbacks.value.length === 0)
        loadFeedbacks();
};
onMounted(() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    const format = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    currentDateRange.value = [format(start), format(end)];
    loadOperationLogs();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logs-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-filter" },
});
const __VLS_0 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.currentDateRange),
    type: "datetimerange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DDTHH:mm:ss",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.currentDateRange),
    type: "datetimerange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DDTHH:mm:ss",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ style: {} },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_7.slots.default;
var __VLS_7;
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    type: "success",
    ...{ style: {} },
    loading: (__VLS_ctx.exportLoading),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    type: "success",
    ...{ style: {} },
    loading: (__VLS_ctx.exportLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (__VLS_ctx.handleExportLogs)
};
__VLS_15.slots.default;
var __VLS_15;
const __VLS_20 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onTabChange: (__VLS_ctx.handleTabChange)
};
__VLS_23.slots.default;
const __VLS_28 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "操作日志",
    name: "operation",
}));
const __VLS_30 = __VLS_29({
    label: "操作日志",
    name: "operation",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.operationLogs),
    ...{ style: {} },
    border: true,
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.operationLogs),
    ...{ style: {} },
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.opLoading) }, null, null);
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "username",
    label: "用户",
    width: "120",
}));
const __VLS_38 = __VLS_37({
    prop: "username",
    label: "用户",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "action",
    label: "操作",
    width: "150",
}));
const __VLS_42 = __VLS_41({
    prop: "action",
    label: "操作",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "resource",
    label: "资源",
    width: "120",
}));
const __VLS_46 = __VLS_45({
    prop: "resource",
    label: "资源",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "resourceId",
    label: "资源ID",
    width: "100",
}));
const __VLS_50 = __VLS_49({
    prop: "resourceId",
    label: "资源ID",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "detail",
    label: "详情",
    showOverflowTooltip: true,
}));
const __VLS_54 = __VLS_53({
    prop: "detail",
    label: "详情",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "ip",
    label: "IP",
    width: "140",
}));
const __VLS_58 = __VLS_57({
    prop: "ip",
    label: "IP",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "success",
    label: "结果",
    width: "80",
}));
const __VLS_62 = __VLS_61({
    prop: "success",
    label: "结果",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        type: (row.success ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_66 = __VLS_65({
        type: (row.success ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.success ? '成功' : '失败');
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "createdAt",
    label: "时间",
    width: "180",
}));
const __VLS_70 = __VLS_69({
    prop: "createdAt",
    label: "时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDateTime(row.createdAt));
}
var __VLS_71;
var __VLS_35;
const __VLS_72 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.opTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.opFilter.size),
    currentPage: (__VLS_ctx.opFilter.currentPage),
    ...{ style: {} },
}));
const __VLS_74 = __VLS_73({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.opTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.opFilter.size),
    currentPage: (__VLS_ctx.opFilter.currentPage),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onSizeChange: ((val) => { __VLS_ctx.opFilter.size = val; __VLS_ctx.loadOperationLogs(); })
};
const __VLS_80 = {
    onCurrentChange: (__VLS_ctx.loadOperationLogs)
};
var __VLS_75;
var __VLS_31;
const __VLS_81 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "问答日志",
    name: "qa",
}));
const __VLS_83 = __VLS_82({
    label: "问答日志",
    name: "qa",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
const __VLS_85 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    data: (__VLS_ctx.qaLogs),
    ...{ style: {} },
    border: true,
}));
const __VLS_87 = __VLS_86({
    data: (__VLS_ctx.qaLogs),
    ...{ style: {} },
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.qaLoading) }, null, null);
__VLS_88.slots.default;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    prop: "username",
    label: "用户",
    width: "120",
}));
const __VLS_91 = __VLS_90({
    prop: "username",
    label: "用户",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const __VLS_93 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    prop: "question",
    label: "问题",
    showOverflowTooltip: true,
}));
const __VLS_95 = __VLS_94({
    prop: "question",
    label: "问题",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    prop: "answer",
    label: "回答",
    showOverflowTooltip: true,
}));
const __VLS_99 = __VLS_98({
    prop: "answer",
    label: "回答",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const __VLS_101 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    prop: "roleName",
    label: "角色",
    width: "100",
}));
const __VLS_103 = __VLS_102({
    prop: "roleName",
    label: "角色",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const __VLS_105 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    prop: "topK",
    label: "TopK",
    width: "70",
}));
const __VLS_107 = __VLS_106({
    prop: "topK",
    label: "TopK",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const __VLS_109 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    prop: "createdAt",
    label: "时间",
    width: "180",
}));
const __VLS_111 = __VLS_110({
    prop: "createdAt",
    label: "时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_112.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDateTime(row.createdAt));
}
var __VLS_112;
var __VLS_88;
const __VLS_113 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.qaTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.qaFilter.size),
    currentPage: (__VLS_ctx.qaFilter.currentPage),
    ...{ style: {} },
}));
const __VLS_115 = __VLS_114({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.qaTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.qaFilter.size),
    currentPage: (__VLS_ctx.qaFilter.currentPage),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_117;
let __VLS_118;
let __VLS_119;
const __VLS_120 = {
    onSizeChange: ((val) => { __VLS_ctx.qaFilter.size = val; __VLS_ctx.loadQaLogs(); })
};
const __VLS_121 = {
    onCurrentChange: (__VLS_ctx.loadQaLogs)
};
var __VLS_116;
var __VLS_84;
const __VLS_122 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    label: "用户反馈",
    name: "feedback",
}));
const __VLS_124 = __VLS_123({
    label: "用户反馈",
    name: "feedback",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    data: (__VLS_ctx.feedbacks),
    ...{ style: {} },
    border: true,
}));
const __VLS_128 = __VLS_127({
    data: (__VLS_ctx.feedbacks),
    ...{ style: {} },
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.fbLoading) }, null, null);
__VLS_129.slots.default;
const __VLS_130 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    prop: "username",
    label: "用户",
    width: "120",
}));
const __VLS_132 = __VLS_131({
    prop: "username",
    label: "用户",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const __VLS_134 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    prop: "qaLogId",
    label: "关联问答ID",
    width: "120",
}));
const __VLS_136 = __VLS_135({
    prop: "qaLogId",
    label: "关联问答ID",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const __VLS_138 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    prop: "helpful",
    label: "是否有用",
    width: "100",
}));
const __VLS_140 = __VLS_139({
    prop: "helpful",
    label: "是否有用",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_141.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_142 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
        type: (row.helpful ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_144 = __VLS_143({
        type: (row.helpful ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    __VLS_145.slots.default;
    (row.helpful ? '👍 有用' : '👎 无用');
    var __VLS_145;
}
var __VLS_141;
const __VLS_146 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    prop: "comment",
    label: "评论",
    showOverflowTooltip: true,
}));
const __VLS_148 = __VLS_147({
    prop: "comment",
    label: "评论",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
const __VLS_150 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    prop: "createdAt",
    label: "时间",
    width: "180",
}));
const __VLS_152 = __VLS_151({
    prop: "createdAt",
    label: "时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_153.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDateTime(row.createdAt));
}
var __VLS_153;
var __VLS_129;
const __VLS_154 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.fbTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.fbFilter.size),
    currentPage: (__VLS_ctx.fbFilter.currentPage),
    ...{ style: {} },
}));
const __VLS_156 = __VLS_155({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    ...{ class: "pagination" },
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    total: (__VLS_ctx.fbTotal),
    pageSizes: ([10, 15, 20, 50, 100]),
    pageSize: (__VLS_ctx.fbFilter.size),
    currentPage: (__VLS_ctx.fbFilter.currentPage),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_158;
let __VLS_159;
let __VLS_160;
const __VLS_161 = {
    onSizeChange: ((val) => { __VLS_ctx.fbFilter.size = val; __VLS_ctx.loadFeedbacks(); })
};
const __VLS_162 = {
    onCurrentChange: (__VLS_ctx.loadFeedbacks)
};
var __VLS_157;
var __VLS_125;
var __VLS_23;
/** @type {__VLS_StyleScopedClasses['logs-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formatDateTime: formatDateTime,
            activeTab: activeTab,
            currentDateRange: currentDateRange,
            handleQuery: handleQuery,
            opLoading: opLoading,
            operationLogs: operationLogs,
            opTotal: opTotal,
            opFilter: opFilter,
            loadOperationLogs: loadOperationLogs,
            exportLoading: exportLoading,
            handleExportLogs: handleExportLogs,
            qaLoading: qaLoading,
            qaLogs: qaLogs,
            qaTotal: qaTotal,
            qaFilter: qaFilter,
            loadQaLogs: loadQaLogs,
            fbLoading: fbLoading,
            feedbacks: feedbacks,
            fbTotal: fbTotal,
            fbFilter: fbFilter,
            loadFeedbacks: loadFeedbacks,
            handleTabChange: handleTabChange,
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