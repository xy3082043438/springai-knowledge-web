/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Odometer, ChatDotRound, Document, User, Lock, List, Setting, Expand, Fold, ArrowDown, SwitchButton, } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
import { hasAnyPermission } from '@/utils/access';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isCollapse = ref(false);
const menuItems = [
    { path: '/dashboard', title: '仪表盘', icon: Odometer, permissions: ['DASHBOARD_READ'] },
    { path: '/qa', title: '智能问答', icon: ChatDotRound, permissions: ['QA_READ'] },
    { path: '/knowledge', title: '知识库管理', icon: Document, permissions: ['DOC_READ'] },
];
const systemMenuItems = [
    { path: '/users', title: '用户管理', icon: User, permissions: ['USER_READ'] },
    { path: '/roles', title: '角色管理', icon: Lock, permissions: ['ROLE_READ'] },
    { path: '/system', title: '系统配置', icon: Setting, permissions: ['CONFIG_READ'] },
    { path: '/logs', title: '日志与反馈', icon: List, permissions: ['LOG_READ', 'FEEDBACK_READ'] },
];
const activeMenu = computed(() => route.path);
const displayName = computed(() => userStore.userInfo?.username || '用户');
const topLevelMenu = computed(() => menuItems.filter((item) => hasAnyPermission(userStore.userInfo?.permissions, item.permissions)));
const systemMenu = computed(() => systemMenuItems.filter((item) => hasAnyPermission(userStore.userInfo?.permissions, item.permissions)));
const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};
const handleLogout = async () => {
    await userStore.logout();
    router.push('/login');
};
onMounted(async () => {
    if (userStore.token && !userStore.userInfo) {
        try {
            await userStore.ensureUserInfo();
        }
        catch {
            // interceptor handles 401
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['right-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "layout-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "layout-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "app-aside" },
    width: (__VLS_ctx.isCollapse ? '68px' : '236px'),
}));
const __VLS_7 = __VLS_6({
    ...{ class: "app-aside" },
    width: (__VLS_ctx.isCollapse ? '68px' : '236px'),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    defaultActive: (__VLS_ctx.activeMenu),
    ...{ class: "el-menu-vertical" },
    collapse: (__VLS_ctx.isCollapse),
    router: true,
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409EFF",
}));
const __VLS_11 = __VLS_10({
    defaultActive: (__VLS_ctx.activeMenu),
    ...{ class: "el-menu-vertical" },
    collapse: (__VLS_ctx.isCollapse),
    router: true,
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409EFF",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo" },
    ...{ class: ({ 'logo-collapsed': __VLS_ctx.isCollapse }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "/logo.svg",
    ...{ class: "logo-badge" },
    alt: "logo",
});
const __VLS_13 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    name: "logo-fade",
    persisted: true,
}));
const __VLS_15 = __VLS_14({
    name: "logo-fade",
    persisted: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-text" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isCollapse) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-subtitle" },
});
var __VLS_16;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.topLevelMenu))) {
    const __VLS_17 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        key: (item.path),
        index: (item.path),
    }));
    const __VLS_19 = __VLS_18({
        key: (item.path),
        index: (item.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = ((item.icon));
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    var __VLS_24;
    {
        const { title: __VLS_thisSlot } = __VLS_20.slots;
        (item.title);
    }
    var __VLS_20;
}
if (__VLS_ctx.systemMenu.length > 0) {
    const __VLS_29 = {}.ElSubMenu;
    /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        index: "/system-group",
    }));
    const __VLS_31 = __VLS_30({
        index: "/system-group",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    {
        const { title: __VLS_thisSlot } = __VLS_32.slots;
        const __VLS_33 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
        const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
        __VLS_36.slots.default;
        const __VLS_37 = {}.Setting;
        /** @type {[typeof __VLS_components.Setting, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
        var __VLS_36;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.systemMenu))) {
        const __VLS_41 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            key: (item.path),
            index: (item.path),
        }));
        const __VLS_43 = __VLS_42({
            key: (item.path),
            index: (item.path),
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_44.slots.default;
        const __VLS_45 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
        const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
        __VLS_48.slots.default;
        const __VLS_49 = ((item.icon));
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
        const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
        var __VLS_48;
        {
            const { title: __VLS_thisSlot } = __VLS_44.slots;
            (item.title);
        }
        var __VLS_44;
    }
    var __VLS_32;
}
var __VLS_12;
var __VLS_8;
const __VLS_53 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ class: "app-header" },
}));
const __VLS_59 = __VLS_58({
    ...{ class: "app-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-content" },
});
const __VLS_61 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClick: (__VLS_ctx.toggleCollapse)
};
__VLS_64.slots.default;
if (__VLS_ctx.isCollapse) {
    const __VLS_69 = {}.Expand;
    /** @type {[typeof __VLS_components.Expand, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
}
else {
    const __VLS_73 = {}.Fold;
    /** @type {[typeof __VLS_components.Fold, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
    const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
}
var __VLS_64;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title-sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right-menu" },
});
const __VLS_77 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    trigger: "click",
}));
const __VLS_79 = __VLS_78({
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "el-dropdown-link" },
});
const __VLS_81 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    size: (28),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
    ...{ class: "header-avatar" },
}));
const __VLS_83 = __VLS_82({
    size: (28),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
    ...{ class: "header-avatar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
(__VLS_ctx.userStore.userInfo?.username?.charAt(0).toUpperCase());
var __VLS_84;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "user-name" },
});
(__VLS_ctx.displayName);
const __VLS_85 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    ...{ class: "el-icon--right" },
}));
const __VLS_87 = __VLS_86({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, typeof __VLS_components.arrowDown, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
var __VLS_88;
{
    const { dropdown: __VLS_thisSlot } = __VLS_80.slots;
    const __VLS_93 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({}));
    const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    const __VLS_97 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
        ...{ 'onClick': {} },
    }));
    const __VLS_99 = __VLS_98({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    let __VLS_101;
    let __VLS_102;
    let __VLS_103;
    const __VLS_104 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push('/profile');
        }
    };
    __VLS_100.slots.default;
    const __VLS_105 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({}));
    const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
    __VLS_108.slots.default;
    const __VLS_109 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
    const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
    var __VLS_108;
    var __VLS_100;
    const __VLS_113 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        ...{ 'onClick': {} },
        divided: true,
    }));
    const __VLS_115 = __VLS_114({
        ...{ 'onClick': {} },
        divided: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_117;
    let __VLS_118;
    let __VLS_119;
    const __VLS_120 = {
        onClick: (__VLS_ctx.handleLogout)
    };
    __VLS_116.slots.default;
    const __VLS_121 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({}));
    const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    const __VLS_125 = {}.SwitchButton;
    /** @type {[typeof __VLS_components.SwitchButton, ]} */ ;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({}));
    const __VLS_127 = __VLS_126({}, ...__VLS_functionalComponentArgsRest(__VLS_126));
    var __VLS_124;
    var __VLS_116;
    var __VLS_96;
}
var __VLS_80;
var __VLS_60;
const __VLS_129 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    ...{ class: "app-main" },
}));
const __VLS_131 = __VLS_130({
    ...{ class: "app-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
{
    const { default: __VLS_thisSlot } = __VLS_136.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_137 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_139 = __VLS_138({
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    __VLS_140.slots.default;
    const __VLS_141 = ((Component));
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({}));
    const __VLS_143 = __VLS_142({}, ...__VLS_functionalComponentArgsRest(__VLS_142));
    var __VLS_140;
    __VLS_136.slots['' /* empty slot name completion */];
}
var __VLS_136;
var __VLS_132;
var __VLS_56;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['layout-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-aside']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-title']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['fold-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['title-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['right-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dropdown-link']} */ ;
/** @type {__VLS_StyleScopedClasses['header-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            User: User,
            Setting: Setting,
            Expand: Expand,
            Fold: Fold,
            ArrowDown: ArrowDown,
            SwitchButton: SwitchButton,
            router: router,
            userStore: userStore,
            isCollapse: isCollapse,
            activeMenu: activeMenu,
            displayName: displayName,
            topLevelMenu: topLevelMenu,
            systemMenu: systemMenu,
            toggleCollapse: toggleCollapse,
            handleLogout: handleLogout,
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