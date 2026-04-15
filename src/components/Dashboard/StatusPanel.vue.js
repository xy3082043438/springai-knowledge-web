/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
const props = defineProps();
const donutStyle = computed(() => {
    if (props.docCount === 0) {
        return { background: 'conic-gradient(#e5edf8 0deg 360deg)' };
    }
    let angle = 0;
    const segments = props.items.map((item) => {
        const nextAngle = angle + (item.value / props.docCount) * 360;
        const segment = `${item.color} ${angle}deg ${nextAngle}deg`;
        angle = nextAngle;
        return segment;
    });
    return { background: `conic-gradient(${segments.join(', ')})` };
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-value']} */ ;
/** @type {__VLS_StyleScopedClasses['status-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['status-donut']} */ ;
// CSS variable injection 
// CSS variable injection end 
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
    ...{ style: (__VLS_ctx.donutStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-donut-inner" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.readyRate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
(__VLS_ctx.docCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-legend" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            donutStyle: donutStyle,
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
//# sourceMappingURL=StatusPanel.vue.js.map