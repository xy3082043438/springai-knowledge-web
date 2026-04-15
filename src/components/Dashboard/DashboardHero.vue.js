/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
const props = defineProps();
const __VLS_emit = defineEmits();
const healthTagType = computed(() => props.systemHealthy === false ? 'danger' : props.systemStatus ? 'success' : 'info');
const healthText = computed(() => props.systemHealthy === false ? '系统异常' : props.systemStatus ? '系统健康' : '状态未知');
const signalLabel = computed(() => (props.isAdmin ? '7天问答' : '系统状态'));
const signalValue = computed(() => {
    if (props.isAdmin)
        return props.qaTrendTotal;
    return props.systemHealthy === false ? '异常' : props.systemStatus ? '正常' : '未知';
});
const signalNote = computed(() => {
    if (props.isAdmin)
        return `峰值 ${props.qaPeakValue} 次`;
    return props.systemStatus || '等待状态返回';
});
const insight = computed(() => {
    if (!props.isAdmin) {
        if (props.docCount === 0)
            return '当前还没有你可访问的知识文档，建议先补充知识内容。';
        return `你当前可访问 ${props.docCount} 篇文档，其中 ${props.readyCount} 篇已完成索引。`;
    }
    if (props.qaTrendTotal === 0) {
        return `当前共管理 ${props.docCount} 篇文档、${props.userCount} 个系统用户，等待更多问答沉淀。`;
    }
    return `近 7 天共发生 ${props.qaTrendTotal} 次问答，系统当前已完成 ${props.readyRate}% 文档索引。`;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['signal-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-strip']} */ ;
// CSS variable injection 
// CSS variable injection end 
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
(__VLS_ctx.docCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-chip" },
});
(__VLS_ctx.topTypeLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-chip" },
});
(__VLS_ctx.isAdmin ? `${__VLS_ctx.qaCount} 次累计问答` : `${__VLS_ctx.readyRate}% 已索引`);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-tags" },
});
const __VLS_0 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    type: (__VLS_ctx.healthTagType),
    effect: "light",
}));
const __VLS_2 = __VLS_1({
    type: (__VLS_ctx.healthTagType),
    effect: "light",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
(__VLS_ctx.healthText);
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hero-status" },
});
(__VLS_ctx.systemStatus || '状态加载中...');
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
(__VLS_ctx.docCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "signal-card signal-card-cyan" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "signal-label" },
});
(__VLS_ctx.signalLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.signalValue);
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.signalNote);
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "signal-card signal-card-amber" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "signal-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.topTypeLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.topTypeShare);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side-note" },
});
(__VLS_ctx.insight);
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
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('refresh');
    }
};
__VLS_7.slots.default;
var __VLS_7;
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            healthTagType: healthTagType,
            healthText: healthText,
            signalLabel: signalLabel,
            signalValue: signalValue,
            signalNote: signalNote,
            insight: insight,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardHero.vue.js.map