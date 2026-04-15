/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Odometer, ChatDotRound, Document, User, Lock, List, Setting, Expand, Fold, ArrowDown, } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
import { ADMIN_ROLE, hasAnyRole } from '@/utils/access';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isCollapse = ref(false);
const menuItems = [
    { path: '/dashboard', title: '仪表盘', icon: Odometer },
    { path: '/qa', title: '智能问答', icon: ChatDotRound },
    { path: '/knowledge', title: '知识库管理', icon: Document },
];
const systemMenuItems = [
    { path: '/users', title: '用户管理', icon: User, roles: [ADMIN_ROLE] },
    { path: '/roles', title: '角色管理', icon: Lock, roles: [ADMIN_ROLE] },
    { path: '/system', title: '系统配置', icon: Setting, roles: [ADMIN_ROLE] },
    { path: '/logs', title: '日志与反馈', icon: List, roles: [ADMIN_ROLE] },
];
const activeMenu = computed(() => route.path);
const displayName = computed(() => userStore.userInfo?.username || '用户');
const topLevelMenu = computed(() => menuItems.filter((item) => hasAnyRole(userStore.userInfo?.role, item.roles)));
const systemMenu = computed(() => systemMenuItems.filter((item) => hasAnyRole(userStore.userInfo?.role, item.roles)));
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
if (!__VLS_ctx.isCollapse) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "logo-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "logo-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "logo-subtitle" },
    });
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.topLevelMenu))) {
    const __VLS_13 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        key: (item.path),
        index: (item.path),
    }));
    const __VLS_15 = __VLS_14({
        key: (item.path),
        index: (item.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = ((item.icon));
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    var __VLS_20;
    {
        const { title: __VLS_thisSlot } = __VLS_16.slots;
        (item.title);
    }
    var __VLS_16;
}
if (__VLS_ctx.systemMenu.length > 0) {
    const __VLS_25 = {}.ElSubMenu;
    /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        index: "/system-group",
    }));
    const __VLS_27 = __VLS_26({
        index: "/system-group",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    {
        const { title: __VLS_thisSlot } = __VLS_28.slots;
        const __VLS_29 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
        const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
        __VLS_32.slots.default;
        const __VLS_33 = {}.Setting;
        /** @type {[typeof __VLS_components.Setting, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
        const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
        var __VLS_32;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.systemMenu))) {
        const __VLS_37 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            key: (item.path),
            index: (item.path),
        }));
        const __VLS_39 = __VLS_38({
            key: (item.path),
            index: (item.path),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        __VLS_40.slots.default;
        const __VLS_41 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
        const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_44.slots.default;
        const __VLS_45 = ((item.icon));
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
        const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
        var __VLS_44;
        {
            const { title: __VLS_thisSlot } = __VLS_40.slots;
            (item.title);
        }
        var __VLS_40;
    }
    var __VLS_28;
}
var __VLS_12;
var __VLS_8;
const __VLS_49 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ class: "app-header" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "app-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-content" },
});
const __VLS_57 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_61;
let __VLS_62;
let __VLS_63;
const __VLS_64 = {
    onClick: (__VLS_ctx.toggleCollapse)
};
__VLS_60.slots.default;
if (__VLS_ctx.isCollapse) {
    const __VLS_65 = {}.Expand;
    /** @type {[typeof __VLS_components.Expand, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({}));
    const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
}
else {
    const __VLS_69 = {}.Fold;
    /** @type {[typeof __VLS_components.Fold, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
}
var __VLS_60;
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
const __VLS_73 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "el-dropdown-link" },
});
(__VLS_ctx.displayName);
const __VLS_77 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ class: "el-icon--right" },
}));
const __VLS_79 = __VLS_78({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, typeof __VLS_components.arrowDown, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
var __VLS_80;
{
    const { dropdown: __VLS_thisSlot } = __VLS_76.slots;
    const __VLS_85 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
    const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    const __VLS_89 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        ...{ 'onClick': {} },
    }));
    const __VLS_91 = __VLS_90({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    let __VLS_93;
    let __VLS_94;
    let __VLS_95;
    const __VLS_96 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push('/profile');
        }
    };
    __VLS_92.slots.default;
    var __VLS_92;
    const __VLS_97 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
        ...{ 'onClick': {} },
        divided: true,
    }));
    const __VLS_99 = __VLS_98({
        ...{ 'onClick': {} },
        divided: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    let __VLS_101;
    let __VLS_102;
    let __VLS_103;
    const __VLS_104 = {
        onClick: (__VLS_ctx.handleLogout)
    };
    __VLS_100.slots.default;
    var __VLS_100;
    var __VLS_88;
}
var __VLS_76;
var __VLS_56;
const __VLS_105 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    ...{ class: "app-main" },
}));
const __VLS_107 = __VLS_106({
    ...{ class: "app-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
const __VLS_109 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
{
    const { default: __VLS_thisSlot } = __VLS_112.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_113 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_115 = __VLS_114({
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    const __VLS_117 = ((Component));
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({}));
    const __VLS_119 = __VLS_118({}, ...__VLS_functionalComponentArgsRest(__VLS_118));
    var __VLS_116;
    __VLS_112.slots['' /* empty slot name completion */];
}
var __VLS_112;
var __VLS_108;
var __VLS_52;
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
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Setting: Setting,
            Expand: Expand,
            Fold: Fold,
            ArrowDown: ArrowDown,
            router: router,
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