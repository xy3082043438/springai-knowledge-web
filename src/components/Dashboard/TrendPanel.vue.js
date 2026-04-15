/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const __VLS_props = defineProps();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-track']} */ ;
// CSS variable injection 
// CSS variable injection end 
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
(__VLS_ctx.trendTotal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "soft-pill" },
});
(__VLS_ctx.peakValue);
if (__VLS_ctx.trendTotal > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "trend-chart" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
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
//# sourceMappingURL=TrendPanel.vue.js.map