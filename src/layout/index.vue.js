/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Odometer, ChatDotRound, Document, User, List, Setting, Expand, Fold, ArrowDown, } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isCollapse = ref(false);
const activeMenu = computed(() => route.path);
const displayName = computed(() => userStore.userInfo?.username || '用户');
const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};
const handleLogout = () => {
    userStore.logout();
};
onMounted(async () => {
    if (userStore.token && !userStore.userInfo) {
        try {
            await userStore.fetchUserInfo();
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
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
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
const __VLS_13 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    index: "/dashboard",
}));
const __VLS_15 = __VLS_14({
    index: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.Odometer;
/** @type {[typeof __VLS_components.Odometer, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
var __VLS_20;
{
    const { title: __VLS_thisSlot } = __VLS_16.slots;
}
var __VLS_16;
const __VLS_25 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    index: "/qa",
}));
const __VLS_27 = __VLS_26({
    index: "/qa",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ChatDotRound;
/** @type {[typeof __VLS_components.ChatDotRound, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_32;
{
    const { title: __VLS_thisSlot } = __VLS_28.slots;
}
var __VLS_28;
const __VLS_37 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    index: "/knowledge",
}));
const __VLS_39 = __VLS_38({
    index: "/knowledge",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
var __VLS_44;
{
    const { title: __VLS_thisSlot } = __VLS_40.slots;
}
var __VLS_40;
const __VLS_49 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    index: "/users",
}));
const __VLS_51 = __VLS_50({
    index: "/users",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
{
    const { title: __VLS_thisSlot } = __VLS_52.slots;
}
var __VLS_52;
const __VLS_61 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    index: "/logs",
}));
const __VLS_63 = __VLS_62({
    index: "/logs",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({}));
const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
const __VLS_69 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
var __VLS_68;
{
    const { title: __VLS_thisSlot } = __VLS_64.slots;
}
var __VLS_64;
const __VLS_73 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    index: "/system",
}));
const __VLS_75 = __VLS_74({
    index: "/system",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({}));
const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
var __VLS_80;
{
    const { title: __VLS_thisSlot } = __VLS_76.slots;
}
var __VLS_76;
var __VLS_12;
var __VLS_8;
const __VLS_85 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    ...{ class: "app-header" },
}));
const __VLS_91 = __VLS_90({
    ...{ class: "app-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-content" },
});
const __VLS_93 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}));
const __VLS_95 = __VLS_94({
    ...{ 'onClick': {} },
    ...{ class: "fold-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_97;
let __VLS_98;
let __VLS_99;
const __VLS_100 = {
    onClick: (__VLS_ctx.toggleCollapse)
};
__VLS_96.slots.default;
if (__VLS_ctx.isCollapse) {
    const __VLS_101 = {}.Expand;
    /** @type {[typeof __VLS_components.Expand, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({}));
    const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
}
else {
    const __VLS_105 = {}.Fold;
    /** @type {[typeof __VLS_components.Fold, ]} */ ;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({}));
    const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
}
var __VLS_96;
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
const __VLS_109 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "el-dropdown-link" },
});
(__VLS_ctx.displayName);
const __VLS_113 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    ...{ class: "el-icon--right" },
}));
const __VLS_115 = __VLS_114({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
const __VLS_117 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, typeof __VLS_components.arrowDown, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({}));
const __VLS_119 = __VLS_118({}, ...__VLS_functionalComponentArgsRest(__VLS_118));
var __VLS_116;
{
    const { dropdown: __VLS_thisSlot } = __VLS_112.slots;
    const __VLS_121 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({}));
    const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    const __VLS_125 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
        ...{ 'onClick': {} },
    }));
    const __VLS_127 = __VLS_126({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    let __VLS_129;
    let __VLS_130;
    let __VLS_131;
    const __VLS_132 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push('/profile');
        }
    };
    __VLS_128.slots.default;
    var __VLS_128;
    const __VLS_133 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
        ...{ 'onClick': {} },
        divided: true,
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onClick': {} },
        divided: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_137;
    let __VLS_138;
    let __VLS_139;
    const __VLS_140 = {
        onClick: (__VLS_ctx.handleLogout)
    };
    __VLS_136.slots.default;
    var __VLS_136;
    var __VLS_124;
}
var __VLS_112;
var __VLS_92;
const __VLS_141 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    ...{ class: "app-main" },
}));
const __VLS_143 = __VLS_142({
    ...{ class: "app-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
const __VLS_145 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({}));
const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
{
    const { default: __VLS_thisSlot } = __VLS_148.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_149 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_151 = __VLS_150({
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    __VLS_152.slots.default;
    const __VLS_153 = ((Component));
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({}));
    const __VLS_155 = __VLS_154({}, ...__VLS_functionalComponentArgsRest(__VLS_154));
    var __VLS_152;
    __VLS_148.slots['' /* empty slot name completion */];
}
var __VLS_148;
var __VLS_144;
var __VLS_88;
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
            Odometer: Odometer,
            ChatDotRound: ChatDotRound,
            Document: Document,
            User: User,
            List: List,
            Setting: Setting,
            Expand: Expand,
            Fold: Fold,
            ArrowDown: ArrowDown,
            router: router,
            isCollapse: isCollapse,
            activeMenu: activeMenu,
            displayName: displayName,
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