/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { Calendar, Clock, User, Plus, Edit, InfoFilled, Lock, Finished } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
import { formatDateTime } from '@/utils/date';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { updateMe, updatePassword } from '@/api/system/user';
const userStore = useUserStore();
const router = useRouter();
const userInfo = computed(() => userStore.userInfo);
const avatarChar = computed(() => userInfo.value?.username?.charAt(0).toUpperCase() || 'U');
const uploadHeaders = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` };
});
// ----- 头像逻辑 -----
const showAvatarDialog = ref(false);
const avatarSaving = ref(false);
const tempAvatar = ref('');
const handleAvatarSuccess = (res) => {
    if (res.url) {
        tempAvatar.value = res.url;
    }
    else {
        ElMessage.error('上传失败，未获取到图片地址');
    }
};
const handleAvatarError = () => {
    ElMessage.error('头像上传失败');
};
const beforeAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
        ElMessage.error('只能上传图片格式!');
    }
    if (!isLt5M) {
        ElMessage.error('头像图片大小不能超过 5MB!');
    }
    return isImage && isLt5M;
};
const closeAvatarDialog = () => {
    showAvatarDialog.value = false;
    tempAvatar.value = '';
};
const submitAvatar = async () => {
    if (!tempAvatar.value) {
        ElMessage.warning('请先上传图片');
        return;
    }
    avatarSaving.value = true;
    try {
        await updateMe({ avatar: tempAvatar.value });
        await userStore.fetchUserInfo();
        ElMessage.success('头像已更新');
        closeAvatarDialog();
    }
    catch (error) {
        console.error(error);
    }
    finally {
        avatarSaving.value = false;
    }
};
// ----- 密码逻辑 -----
const showPasswordDialog = ref(false);
const pwdSaving = ref(false);
const pwdFormRef = ref();
const pwdForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const validateConfirmPassword = (rule, value, callback) => {
    if (value !== pwdForm.value.newPassword) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
const pwdRules = ref({
    oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 64, message: '密码长度在6到64位之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
});
const submitPassword = async () => {
    if (!pwdFormRef.value)
        return;
    await pwdFormRef.value.validate(async (valid) => {
        if (valid) {
            pwdSaving.value = true;
            try {
                await updatePassword({
                    oldPassword: pwdForm.value.oldPassword,
                    newPassword: pwdForm.value.newPassword
                });
                ElMessage.success('密码修改成功，请重新登录');
                showPasswordDialog.value = false;
                // 强制登出并去登录页
                userStore.clearSession();
                router.push('/login');
            }
            catch (error) {
                console.error(error);
            }
            finally {
                pwdSaving.value = false;
            }
        }
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "hover",
    ...{ class: "unified-profile-card" },
    bodyStyle: ({ padding: '0px' }),
}));
const __VLS_2 = __VLS_1({
    shadow: "hover",
    ...{ class: "unified-profile-card" },
    bodyStyle: ({ padding: '0px' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-header-bg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    color: "#ffffff20",
    ...{ class: "action-btn" },
    size: "small",
    plain: true,
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    color: "#ffffff20",
    ...{ class: "action-btn" },
    size: "small",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showPasswordDialog = true;
    }
};
__VLS_7.slots.default;
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-hero" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showAvatarDialog = true;
        } },
    ...{ class: "avatar-wrapper" },
});
if (__VLS_ctx.userInfo?.avatar) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.userInfo.avatar),
        ...{ class: "avatar-img" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar" },
    });
    (__VLS_ctx.avatarChar);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-mask" },
});
const __VLS_12 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.Edit;
/** @type {[typeof __VLS_components.Edit, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "username" },
});
(__VLS_ctx.userInfo?.username);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "role-tag" },
});
const __VLS_20 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    type: (__VLS_ctx.userInfo?.role === 'ADMIN' ? 'danger' : 'primary'),
    effect: "dark",
    round: true,
}));
const __VLS_22 = __VLS_21({
    type: (__VLS_ctx.userInfo?.role === 'ADMIN' ? 'danger' : 'primary'),
    effect: "dark",
    round: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
(__VLS_ctx.userInfo?.role);
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-icon-box" },
});
const __VLS_24 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.Lock;
/** @type {[typeof __VLS_components.Lock, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.userInfo?.permissions?.length || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-icon-box success" },
});
const __VLS_32 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.Finished;
/** @type {[typeof __VLS_components.Finished, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_35;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "glass-section-wrap" },
});
const __VLS_40 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_47;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "detail-section glass-card" },
});
const __VLS_52 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    column: (1),
    border: true,
    size: "large",
    ...{ class: "profile-desc" },
}));
const __VLS_54 = __VLS_53({
    column: (1),
    border: true,
    size: "large",
    ...{ class: "profile-desc" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    labelClassName: "desc-label-cell",
}));
const __VLS_58 = __VLS_57({
    labelClassName: "desc-label-cell",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "desc-label" },
    });
    const __VLS_60 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_63;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "desc-value" },
});
(__VLS_ctx.userInfo?.username);
var __VLS_59;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    labelClassName: "desc-label-cell",
}));
const __VLS_70 = __VLS_69({
    labelClassName: "desc-label-cell",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "desc-label" },
    });
    const __VLS_72 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.Calendar;
    /** @type {[typeof __VLS_components.Calendar, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
    const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
    var __VLS_75;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "desc-value" },
});
(__VLS_ctx.formatDateTime(__VLS_ctx.userInfo?.createdAt));
var __VLS_71;
const __VLS_80 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    labelClassName: "desc-label-cell",
}));
const __VLS_82 = __VLS_81({
    labelClassName: "desc-label-cell",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_83.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "desc-label" },
    });
    const __VLS_84 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.Clock;
    /** @type {[typeof __VLS_components.Clock, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
    const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
    var __VLS_87;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "desc-value" },
});
(__VLS_ctx.formatDateTime(__VLS_ctx.userInfo?.updatedAt));
var __VLS_83;
var __VLS_55;
var __VLS_3;
const __VLS_92 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.showAvatarDialog),
    title: "修改头像",
    width: "400px",
    center: true,
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.showAvatarDialog),
    title: "修改头像",
    width: "400px",
    center: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-uploader-container" },
});
const __VLS_96 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "avatar-uploader" },
    action: "/api/upload",
    headers: (__VLS_ctx.uploadHeaders),
    showFileList: (false),
    onSuccess: (__VLS_ctx.handleAvatarSuccess),
    beforeUpload: (__VLS_ctx.beforeAvatarUpload),
    onError: (__VLS_ctx.handleAvatarError),
    accept: "image/*",
}));
const __VLS_98 = __VLS_97({
    ...{ class: "avatar-uploader" },
    action: "/api/upload",
    headers: (__VLS_ctx.uploadHeaders),
    showFileList: (false),
    onSuccess: (__VLS_ctx.handleAvatarSuccess),
    beforeUpload: (__VLS_ctx.beforeAvatarUpload),
    onError: (__VLS_ctx.handleAvatarError),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
if (__VLS_ctx.tempAvatar) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.tempAvatar),
        ...{ class: "uploaded-avatar" },
    });
}
else {
    const __VLS_100 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "avatar-uploader-icon" },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "avatar-uploader-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
    const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
    var __VLS_103;
}
var __VLS_99;
{
    const { footer: __VLS_thisSlot } = __VLS_95.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (__VLS_ctx.closeAvatarDialog)
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.avatarSaving),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.avatarSaving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (__VLS_ctx.submitAvatar)
    };
    __VLS_119.slots.default;
    var __VLS_119;
}
var __VLS_95;
const __VLS_124 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.showPasswordDialog),
    title: "修改登录密码",
    width: "450px",
}));
const __VLS_126 = __VLS_125({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.showPasswordDialog),
    title: "修改登录密码",
    width: "450px",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_128;
let __VLS_129;
let __VLS_130;
const __VLS_131 = {
    onClosed: (...[$event]) => {
        __VLS_ctx.pwdFormRef?.resetFields();
    }
};
__VLS_127.slots.default;
const __VLS_132 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ref: "pwdFormRef",
    model: (__VLS_ctx.pwdForm),
    rules: (__VLS_ctx.pwdRules),
    labelWidth: "100px",
}));
const __VLS_134 = __VLS_133({
    ref: "pwdFormRef",
    model: (__VLS_ctx.pwdForm),
    rules: (__VLS_ctx.pwdRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
/** @type {typeof __VLS_ctx.pwdFormRef} */ ;
var __VLS_136 = {};
__VLS_135.slots.default;
const __VLS_138 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "当前密码",
    prop: "oldPassword",
}));
const __VLS_140 = __VLS_139({
    label: "当前密码",
    prop: "oldPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
const __VLS_142 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.pwdForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.pwdForm.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
var __VLS_141;
const __VLS_146 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_148 = __VLS_147({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
const __VLS_150 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    modelValue: (__VLS_ctx.pwdForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码（至少6位）",
}));
const __VLS_152 = __VLS_151({
    modelValue: (__VLS_ctx.pwdForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码（至少6位）",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
var __VLS_149;
const __VLS_154 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    label: "密码确认",
    prop: "confirmPassword",
}));
const __VLS_156 = __VLS_155({
    label: "密码确认",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
__VLS_157.slots.default;
const __VLS_158 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    modelValue: (__VLS_ctx.pwdForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_160 = __VLS_159({
    modelValue: (__VLS_ctx.pwdForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
var __VLS_157;
var __VLS_135;
{
    const { footer: __VLS_thisSlot } = __VLS_127.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_162 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        ...{ 'onClick': {} },
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_166;
    let __VLS_167;
    let __VLS_168;
    const __VLS_169 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showPasswordDialog = false;
        }
    };
    __VLS_165.slots.default;
    var __VLS_165;
    const __VLS_170 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.pwdSaving),
    }));
    const __VLS_172 = __VLS_171({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.pwdSaving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    let __VLS_174;
    let __VLS_175;
    let __VLS_176;
    const __VLS_177 = {
        onClick: (__VLS_ctx.submitPassword)
    };
    __VLS_173.slots.default;
    var __VLS_173;
}
var __VLS_127;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-main']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-section-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-value']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-value']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-value']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-uploader-container']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['uploaded-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-uploader-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_137 = __VLS_136;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Calendar: Calendar,
            Clock: Clock,
            User: User,
            Plus: Plus,
            Edit: Edit,
            InfoFilled: InfoFilled,
            Lock: Lock,
            Finished: Finished,
            formatDateTime: formatDateTime,
            userInfo: userInfo,
            avatarChar: avatarChar,
            uploadHeaders: uploadHeaders,
            showAvatarDialog: showAvatarDialog,
            avatarSaving: avatarSaving,
            tempAvatar: tempAvatar,
            handleAvatarSuccess: handleAvatarSuccess,
            handleAvatarError: handleAvatarError,
            beforeAvatarUpload: beforeAvatarUpload,
            closeAvatarDialog: closeAvatarDialog,
            submitAvatar: submitAvatar,
            showPasswordDialog: showPasswordDialog,
            pwdSaving: pwdSaving,
            pwdFormRef: pwdFormRef,
            pwdForm: pwdForm,
            pwdRules: pwdRules,
            submitPassword: submitPassword,
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