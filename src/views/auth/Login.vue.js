/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const loading = ref(false);
const loginForm = reactive({
    username: '',
    password: ''
});
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 64, message: '用户名长度 3-64', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 100, message: '密码长度 6-100', trigger: 'blur' },
    ]
});
const handleLogin = async () => {
    if (!loginFormRef.value)
        return;
    await loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                await userStore.login({
                    username: loginForm.username,
                    password: loginForm.password,
                });
                ElMessage.success('登录成功');
                router.push('/dashboard');
            }
            catch (e) {
                // Error is handled by axios interceptor
            }
            finally {
                loading.value = false;
            }
        }
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "login-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "login-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "/logo.svg",
    ...{ class: "brand-logo" },
    alt: "logo",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "login-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "login-subtitle" },
});
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.rules),
    ref: "loginFormRef",
    labelPosition: "top",
}));
const __VLS_6 = __VLS_5({
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.rules),
    ref: "loginFormRef",
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {typeof __VLS_ctx.loginFormRef} */ ;
var __VLS_8 = {};
__VLS_7.slots.default;
const __VLS_10 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    label: "用户名",
    prop: "username",
}));
const __VLS_12 = __VLS_11({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.loginForm.username),
    prefixIcon: "User",
    placeholder: "请输入用户名",
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.loginForm.username),
    prefixIcon: "User",
    placeholder: "请输入用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_13;
const __VLS_18 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    label: "密码",
    prop: "password",
}));
const __VLS_20 = __VLS_19({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
const __VLS_22 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.loginForm.password),
    prefixIcon: "Lock",
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}));
const __VLS_24 = __VLS_23({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.loginForm.password),
    prefixIcon: "Lock",
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onKeyup: (__VLS_ctx.handleLogin)
};
var __VLS_25;
var __VLS_21;
const __VLS_30 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-btn" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_36 = __VLS_35({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-btn" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_38;
let __VLS_39;
let __VLS_40;
const __VLS_41 = {
    onClick: (__VLS_ctx.handleLogin)
};
__VLS_37.slots.default;
var __VLS_37;
var __VLS_33;
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['login-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loginFormRef: loginFormRef,
            loading: loading,
            loginForm: loginForm,
            rules: rules,
            handleLogin: handleLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Login.vue.js.map