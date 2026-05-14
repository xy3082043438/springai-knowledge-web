/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch } from 'vue';
import { getCaptcha } from '@/api/auth';
import { Refresh, ArrowRight, Check, Close } from '@element-plus/icons-vue';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'success']);
const visible = ref(false);
const loading = ref(false);
const isDragging = ref(false);
const sliderLeft = ref(0);
const startX = ref(0);
const width = 400;
const height = 200;
const resultStatus = ref('');
const captchaData = reactive({
    captchaImg: '',
    sliderImg: '',
    captchaKey: '',
    y: 0
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
    sliderLeft.value = 0;
    resultStatus.value = '';
    isDragging.value = false;
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
const startDrag = (e) => {
    if (resultStatus.value === 'success' || loading.value)
        return;
    isDragging.value = true;
    startX.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', endDrag);
};
const onDrag = (e) => {
    if (!isDragging.value)
        return;
    const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let moveX = currentX - startX.value;
    // Constrain
    const maxMove = width - 45 - 20; // slider width is ~45, track padding
    if (moveX < 0)
        moveX = 0;
    if (moveX > maxMove)
        moveX = maxMove;
    sliderLeft.value = moveX;
};
const endDrag = () => {
    if (!isDragging.value)
        return;
    isDragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', endDrag);
    // Submit verification
    verify();
};
const verify = () => {
    // We send the current offset to parent to let it handle the actual login or verification
    emit('success', {
        captchaKey: captchaData.captchaKey,
        x: Math.round(sliderLeft.value)
    });
};
// Parent can call this to show result
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
/** @type {__VLS_StyleScopedClasses['track-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['track-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['fail']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['fail']} */ ;
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
    'aria-modal': "true",
    closeOnClickModal: (false),
    ...{ class: "captcha-dialog" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "安全验证",
    width: "440px",
    destroyOnClose: true,
    'aria-modal': "true",
    closeOnClickModal: (false),
    ...{ class: "captcha-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-captcha-container" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onSelectstart: () => { } },
    ...{ class: "captcha-image-box" },
    ...{ style: ({ width: __VLS_ctx.width + 'px', height: __VLS_ctx.height + 'px' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.captchaData.captchaImg),
    ...{ class: "bg-img" },
    alt: "background",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.captchaData.sliderImg),
    ...{ class: "slider-img" },
    ...{ style: ({
            left: __VLS_ctx.sliderLeft + 'px',
            top: __VLS_ctx.captchaData.y + 'px'
        }) },
    alt: "slider",
});
if (__VLS_ctx.resultStatus) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-overlay" },
        ...{ class: (__VLS_ctx.resultStatus) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.resultStatus === 'success' ? '验证通过' : '请重试');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-track" },
    ref: "trackRef",
});
/** @type {typeof __VLS_ctx.trackRef} */ ;
if (!__VLS_ctx.isDragging && !__VLS_ctx.resultStatus) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "track-text" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "track-progress" },
    ...{ style: ({ width: (__VLS_ctx.sliderLeft + 20) + 'px' }) },
    ...{ class: (__VLS_ctx.resultStatus) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onMousedown: (__VLS_ctx.startDrag) },
    ...{ onTouchstart: (__VLS_ctx.startDrag) },
    ...{ class: "slider-handle" },
    ...{ style: ({ left: __VLS_ctx.sliderLeft + 'px' }) },
    ...{ class: ({ dragging: __VLS_ctx.isDragging, [__VLS_ctx.resultStatus]: true }) },
});
if (!__VLS_ctx.resultStatus) {
    const __VLS_5 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = {}.ArrowRight;
    /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    var __VLS_8;
}
else if (__VLS_ctx.resultStatus === 'success') {
    const __VLS_13 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = {}.Check;
    /** @type {[typeof __VLS_components.Check, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_16;
}
else {
    const __VLS_21 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.Close;
    /** @type {[typeof __VLS_components.Close, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    var __VLS_24;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "captcha-footer" },
});
const __VLS_29 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    link: true,
    icon: (__VLS_ctx.Refresh),
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    link: true,
    icon: (__VLS_ctx.Refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_32.slots.default;
var __VLS_32;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tip" },
});
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['captcha-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-captcha-container']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-image-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-img']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-img']} */ ;
/** @type {__VLS_StyleScopedClasses['status-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track']} */ ;
/** @type {__VLS_StyleScopedClasses['track-text']} */ ;
/** @type {__VLS_StyleScopedClasses['track-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-handle']} */ ;
/** @type {__VLS_StyleScopedClasses['captcha-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['tip']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Refresh: Refresh,
            ArrowRight: ArrowRight,
            Check: Check,
            Close: Close,
            visible: visible,
            loading: loading,
            isDragging: isDragging,
            sliderLeft: sliderLeft,
            width: width,
            height: height,
            resultStatus: resultStatus,
            captchaData: captchaData,
            loadData: loadData,
            startDrag: startDrag,
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
//# sourceMappingURL=SliderCaptcha.vue.js.map