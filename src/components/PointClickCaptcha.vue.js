/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch } from 'vue';
import { getCaptcha } from '@/api/auth';
import { Refresh } from '@element-plus/icons-vue';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'success']);
const visible = ref(false);
const loading = ref(false);
const resultStatus = ref('');
const userClicks = ref([]);
const captchaData = reactive({
    captchaImg: '',
    checkWords: [],
    captchaKey: ''
});
watch(() => props.modelValue, (val) => {
    visible.value = val;
    if (val) {
        loadData();
    }
});
watch(visible, (val) => {
    emit('update:modelValue', val);
    if (!val) {
        resetState();
    }
});
const resetState = () => {
    userClicks.value = [];
    resultStatus.value = '';
};
const clearClicks = () => {
    userClicks.value = [];
};
const loadData = async () => {
    loading.value = true;
    resetState();
    try {
        const { data } = await getCaptcha();
        Object.assign(captchaData, data);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        loading.value = false;
    }
};
const handleImageClick = (e) => {
    if (resultStatus.value === 'success' || loading.value)
        return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    userClicks.value.push({ x, y });
    // If reached required clicks, auto-submit
    if (userClicks.value.length === captchaData.checkWords.length) {
        verify();
    }
};
const verify = () => {
    // Format clicks as "x1,y1;x2,y2;x3,y3"
    const captchaCode = userClicks.value
        .map(c => `${c.x},${c.y}`)
        .join(';');
    emit('success', {
        captchaKey: captchaData.captchaKey,
        code: captchaCode
    });
};
const setStatus = (status) => {
    resultStatus.value = status;
    if (status === 'fail') {
        setTimeout(() => {
            loadData();
        }, 1000);
    }
    else {
        setTimeout(() => {
            visible.value = false;
        }, 800);
    }
};
const __VLS_exposed = { setStatus, loadData };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['status-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['status-overlay']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "安全验证",
    width: "440px",
    destroyOnClose: true,
    closeOnClickModal: (false),
    ...{ class: "captcha-dialog" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "安全验证",
    width: "440px",
    destroyOnClose: true,
    closeOnClickModal: (false),
    ...{ class: "captcha-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "point-captcha-container" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "instruction" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "word-list" },
});
for (const [word, index] of __VLS_getVForSourceType((__VLS_ctx.captchaData.checkWords))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        key: (index),
        ...{ class: "target-word" },
    });
    (word);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.handleImageClick) },
    ...{ onSelectstart: () => { } },
    ...{ class: "captcha-image-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.captchaData.captchaImg),
    ...{ class: "bg-img" },
    alt: "background",
});
for (const [click, index] of __VLS_getVForSourceType((__VLS_ctx.userClicks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "click-marker" },
        ...{ style: ({ left: click.x + 'px', top: click.y + 'px' }) },
    });
    (index + 1);
}
if (__VLS_ctx.resultStatus) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-overlay" },
        ...{ class: (__VLS_ctx.resultStatus) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.resultStatus === 'success' ? '验证通过' : '验证失败，请重试');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "captcha-footer" },
});
const __VLS_5 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    link: true,
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    link: true,
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_8.slots.default;
var __VLS_8;
const __VLS_13 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    link: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (__VLS_ctx.clearClicks)
};
__VLS_16.slots.default;
var __VLS_16;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['captcha-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['point-captcha-container']} */ ;
/** @type {__VLS_StyleScopedClasses['instruction']} */ ;
/** @type {__VLS_StyleScopedClasses['word-list']} */ ;
/** @type {__VLS_StyleScopedClasses['target-word']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-image-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-img']} */ ;
/** @type {__VLS_StyleScopedClasses['click-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['status-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Refresh: Refresh,
            visible: visible,
            loading: loading,
            resultStatus: resultStatus,
            userClicks: userClicks,
            captchaData: captchaData,
            clearClicks: clearClicks,
            loadData: loadData,
            handleImageClick: handleImageClick,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PointClickCaptcha.vue.js.map