/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listConfigs, upsertConfig, refreshConfig } from '@/api/system/config';
const loading = ref(false);
const configs = ref([]);
const editingKey = ref(null);
const editValue = ref('');
const editDescription = ref('');
const HIDDEN_KEYS = new Set([
    'chunk.size',
    'chunk.overlap',
    'chunk.embeddingSafeSize',
    'hybrid.vectorTopK',
    'hybrid.keywordTopK',
    'hybrid.vectorSimilarityThreshold',
    'hybrid.vectorWeight',
    'hybrid.keywordWeight',
    'rag.maxOutputTokens',
    'rag.temperature',
    'rag.topP',
    'keyword.tsConfig',
    'system.boundary',
]);
const loadConfigs = async () => {
    loading.value = true;
    try {
        const { data } = await listConfigs();
        configs.value = data.filter(c => !HIDDEN_KEYS.has(c.key));
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadConfigs);
const startEdit = (row) => {
    editingKey.value = row.key;
    editValue.value = row.value;
    editDescription.value = row.description || '';
};
const cancelEdit = () => {
    editingKey.value = null;
    editValue.value = '';
};
const saveConfig = async (key) => {
    if (!editValue.value.trim()) {
        ElMessage.warning('配置值不能为空');
        return;
    }
    try {
        await upsertConfig(key, {
            value: editValue.value,
            description: editDescription.value || undefined,
        });
        ElMessage.success('保存成功');
        editingKey.value = null;
        loadConfigs();
    }
    catch { /* interceptor */ }
};
const handleRefresh = async () => {
    try {
        await refreshConfig();
        ElMessage.success('全局配置已刷新');
        loadConfigs();
    }
    catch { /* interceptor */ }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "system-config-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-subtitle" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Refresh",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Refresh",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleRefresh)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.configs),
    ...{ style: {} },
    border: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.configs),
    ...{ style: {} },
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_11.slots.default;
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    prop: "key",
    label: "配置键",
    width: "250",
}));
const __VLS_14 = __VLS_13({
    prop: "key",
    label: "配置键",
    width: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "value",
    label: "配置值",
    minWidth: "300",
}));
const __VLS_18 = __VLS_17({
    prop: "value",
    label: "配置值",
    minWidth: "300",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.editingKey === row.key) {
        const __VLS_20 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            modelValue: (__VLS_ctx.editValue),
            type: "textarea",
            rows: (2),
        }));
        const __VLS_22 = __VLS_21({
            modelValue: (__VLS_ctx.editValue),
            type: "textarea",
            rows: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ style: {} },
        });
        (row.value);
    }
}
var __VLS_19;
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "description",
    label: "描述",
    width: "250",
    showOverflowTooltip: true,
}));
const __VLS_26 = __VLS_25({
    prop: "description",
    label: "描述",
    width: "250",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "updatedAt",
    label: "更新时间",
    width: "180",
}));
const __VLS_30 = __VLS_29({
    prop: "updatedAt",
    label: "更新时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_34 = __VLS_33({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.editingKey === row.key) {
        const __VLS_36 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
            size: "small",
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_40;
        let __VLS_41;
        let __VLS_42;
        const __VLS_43 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.editingKey === row.key))
                    return;
                __VLS_ctx.saveConfig(row.key);
            }
        };
        __VLS_39.slots.default;
        var __VLS_39;
        const __VLS_44 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            link: true,
            size: "small",
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (__VLS_ctx.cancelEdit)
        };
        __VLS_47.slots.default;
        var __VLS_47;
    }
    else {
        const __VLS_52 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.editingKey === row.key))
                    return;
                __VLS_ctx.startEdit(row);
            }
        };
        __VLS_55.slots.default;
        var __VLS_55;
    }
}
var __VLS_35;
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['system-config-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            configs: configs,
            editingKey: editingKey,
            editValue: editValue,
            startEdit: startEdit,
            cancelEdit: cancelEdit,
            saveConfig: saveConfig,
            handleRefresh: handleRefresh,
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