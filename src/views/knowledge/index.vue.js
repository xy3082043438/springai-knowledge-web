/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { listDocuments, searchDocuments, uploadDocument, updateDocument, deleteDocument, reindexAll, reindexOne, } from '@/api/document';
import { listRoles } from '@/api/role';
import { useUserStore } from '@/store/user';
import { isAdminRole } from '@/utils/access';
const userStore = useUserStore();
const searchQuery = ref('');
const loading = ref(false);
const documents = ref([]);
const roles = ref([]);
const canManageKnowledge = computed(() => isAdminRole(userStore.userInfo?.role));
// Upload
const uploadVisible = ref(false);
const uploading = ref(false);
const uploadRef = ref();
const selectedFile = ref(null);
const uploadForm = ref({ title: '', allowedRoles: [] });
// Edit
const editVisible = ref(false);
const editForm = ref({ id: 0, title: '', allowedRoles: [] });
const loadDocuments = async () => {
    loading.value = true;
    try {
        const { data } = await listDocuments();
        documents.value = data;
    }
    finally {
        loading.value = false;
    }
};
const loadRoles = async () => {
    try {
        const { data } = await listRoles();
        roles.value = data;
    }
    catch { /* ignore */ }
};
onMounted(async () => {
    if (userStore.token && !userStore.userInfo) {
        try {
            await userStore.ensureUserInfo();
        }
        catch {
            return;
        }
    }
    await loadDocuments();
    if (canManageKnowledge.value) {
        loadRoles();
    }
});
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        loadDocuments();
        return;
    }
    loading.value = true;
    try {
        const { data } = await searchDocuments({ query: searchQuery.value });
        documents.value = data;
    }
    finally {
        loading.value = false;
    }
};
const handleFileChange = (file) => {
    selectedFile.value = file.raw || null;
};
const submitUpload = async () => {
    if (!selectedFile.value) {
        ElMessage.warning('请选择文件');
        return;
    }
    if (uploadForm.value.allowedRoles.length === 0) {
        ElMessage.warning('请选择至少一个允许角色');
        return;
    }
    uploading.value = true;
    try {
        await uploadDocument(selectedFile.value, uploadForm.value.allowedRoles, uploadForm.value.title || undefined);
        ElMessage.success('上传成功');
        uploadVisible.value = false;
        uploadForm.value = { title: '', allowedRoles: [] };
        selectedFile.value = null;
        loadDocuments();
    }
    finally {
        uploading.value = false;
    }
};
const handleEdit = (row) => {
    editForm.value = {
        id: row.id,
        title: row.title || '',
        allowedRoles: [...(row.allowedRoles || [])],
    };
    editVisible.value = true;
};
const submitEdit = async () => {
    try {
        await updateDocument(editForm.value.id, {
            title: editForm.value.title,
            allowedRoles: editForm.value.allowedRoles,
        });
        ElMessage.success('保存成功');
        editVisible.value = false;
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除 "${row.title || row.fileName}" 吗？`, '警告', { type: 'warning' })
        .then(async () => {
        await deleteDocument(row.id);
        ElMessage.success('删除成功');
        loadDocuments();
    })
        .catch(() => { });
};
const handleReindex = async (row) => {
    try {
        const { data } = await reindexOne(row.id);
        ElMessage.success(`重索引完成：成功 ${data.success}，失败 ${data.failed}`);
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const handleReindexAll = async () => {
    try {
        const { data } = await reindexAll();
        ElMessage.success(`全部重索引：共 ${data.total}，成功 ${data.success}，失败 ${data.failed}`);
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const formatDate = (dateStr) => {
    if (!dateStr)
        return '-';
    return new Date(dateStr).toLocaleString('zh-CN', { hour12: false });
};
const getStatusType = (status) => {
    switch (status) {
        case 'READY': return 'success';
        case 'UPLOADED': return 'warning';
        case 'FAILED': return 'danger';
        default: return 'info';
    }
};
const getStatusLabel = (status) => {
    switch (status) {
        case 'READY': return '已索引';
        case 'UPLOADED': return '已上传';
        case 'FAILED': return '失败';
        default: return status;
    }
};
const formatSize = (bytes) => {
    if (!bytes)
        return '-';
    if (bytes < 1024)
        return bytes + ' B';
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "knowledge-container" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-actions" },
});
if (!__VLS_ctx.canManageKnowledge) {
    const __VLS_0 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        type: "info",
        effect: "plain",
    }));
    const __VLS_2 = __VLS_1({
        type: "info",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    var __VLS_3;
}
const __VLS_4 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索文档...",
    prefixIcon: "Search",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_6 = __VLS_5({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索文档...",
    prefixIcon: "Search",
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onKeyup: (__VLS_ctx.handleSearch)
};
const __VLS_12 = {
    onClear: (__VLS_ctx.loadDocuments)
};
var __VLS_7;
const __VLS_13 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_16.slots.default;
var __VLS_16;
const __VLS_21 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    icon: "Refresh",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    icon: "Refresh",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (__VLS_ctx.loadDocuments)
};
__VLS_24.slots.default;
var __VLS_24;
if (__VLS_ctx.canManageKnowledge) {
    const __VLS_29 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Upload",
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Upload",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.canManageKnowledge))
                return;
            __VLS_ctx.uploadVisible = true;
        }
    };
    __VLS_32.slots.default;
    var __VLS_32;
}
if (__VLS_ctx.canManageKnowledge) {
    const __VLS_37 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        type: "warning",
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    let __VLS_43;
    const __VLS_44 = {
        onClick: (__VLS_ctx.handleReindexAll)
    };
    __VLS_40.slots.default;
    var __VLS_40;
}
const __VLS_45 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_47 = __VLS_46({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_48.slots.default;
const __VLS_49 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_51 = __VLS_50({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const __VLS_53 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_55 = __VLS_54({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const __VLS_57 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    prop: "fileName",
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}));
const __VLS_59 = __VLS_58({
    prop: "fileName",
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_61 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    prop: "contentType",
    label: "类型",
    width: "120",
}));
const __VLS_63 = __VLS_62({
    prop: "contentType",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_64.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_65 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        size: "small",
    }));
    const __VLS_67 = __VLS_66({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    __VLS_68.slots.default;
    (row.contentType || '-');
    var __VLS_68;
}
var __VLS_64;
const __VLS_69 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "大小",
    width: "100",
}));
const __VLS_71 = __VLS_70({
    label: "大小",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_72.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatSize(row.fileSize));
}
var __VLS_72;
const __VLS_73 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_75 = __VLS_74({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_76.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_77 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        type: (__VLS_ctx.getStatusType(row.status)),
    }));
    const __VLS_79 = __VLS_78({
        type: (__VLS_ctx.getStatusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    (__VLS_ctx.getStatusLabel(row.status));
    var __VLS_80;
}
var __VLS_76;
const __VLS_81 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "允许角色",
    width: "160",
}));
const __VLS_83 = __VLS_82({
    label: "允许角色",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_84.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [r] of __VLS_getVForSourceType((row.allowedRoles))) {
        const __VLS_85 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
            key: (r),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_87 = __VLS_86({
            key: (r),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        __VLS_88.slots.default;
        (r);
        var __VLS_88;
    }
}
var __VLS_84;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_91 = __VLS_90({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_92.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_92;
if (__VLS_ctx.canManageKnowledge) {
    const __VLS_93 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        label: "操作",
        width: "240",
        fixed: "right",
    }));
    const __VLS_95 = __VLS_94({
        label: "操作",
        width: "240",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_96.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_97 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_99 = __VLS_98({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        let __VLS_101;
        let __VLS_102;
        let __VLS_103;
        const __VLS_104 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleEdit(row);
            }
        };
        __VLS_100.slots.default;
        var __VLS_100;
        const __VLS_105 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_107 = __VLS_106({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        let __VLS_109;
        let __VLS_110;
        let __VLS_111;
        const __VLS_112 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleReindex(row);
            }
        };
        __VLS_108.slots.default;
        var __VLS_108;
        const __VLS_113 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }));
        const __VLS_115 = __VLS_114({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        let __VLS_117;
        let __VLS_118;
        let __VLS_119;
        const __VLS_120 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleDelete(row);
            }
        };
        __VLS_116.slots.default;
        var __VLS_116;
    }
    var __VLS_96;
}
var __VLS_48;
const __VLS_121 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文档",
    width: "500px",
    alignCenter: true,
}));
const __VLS_123 = __VLS_122({
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文档",
    width: "500px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_127 = __VLS_126({
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    label: "文档标题",
}));
const __VLS_131 = __VLS_130({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "可选，留空使用文件名",
}));
const __VLS_135 = __VLS_134({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "可选，留空使用文件名",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
var __VLS_132;
const __VLS_137 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: "允许角色",
}));
const __VLS_139 = __VLS_138({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请选择角色",
    ...{ style: {} },
}));
const __VLS_143 = __VLS_142({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请选择角色",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_145 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_147 = __VLS_146({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
}
var __VLS_144;
var __VLS_140;
const __VLS_149 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    label: "选择文件",
}));
const __VLS_151 = __VLS_150({
    label: "选择文件",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    ref: "uploadRef",
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onExceed: (() => __VLS_ctx.ElMessage.warning('只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}));
const __VLS_155 = __VLS_154({
    ref: "uploadRef",
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onExceed: (() => __VLS_ctx.ElMessage.warning('只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
/** @type {typeof __VLS_ctx.uploadRef} */ ;
var __VLS_157 = {};
__VLS_156.slots.default;
const __VLS_159 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    ...{ class: "el-icon--upload" },
}));
const __VLS_161 = __VLS_160({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, typeof __VLS_components.uploadFilled, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({}));
const __VLS_165 = __VLS_164({}, ...__VLS_functionalComponentArgsRest(__VLS_164));
var __VLS_162;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_156.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_156;
var __VLS_152;
var __VLS_128;
{
    const { footer: __VLS_thisSlot } = __VLS_124.slots;
    const __VLS_167 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        ...{ 'onClick': {} },
    }));
    const __VLS_169 = __VLS_168({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    let __VLS_171;
    let __VLS_172;
    let __VLS_173;
    const __VLS_174 = {
        onClick: (...[$event]) => {
            __VLS_ctx.uploadVisible = false;
        }
    };
    __VLS_170.slots.default;
    var __VLS_170;
    const __VLS_175 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }));
    const __VLS_177 = __VLS_176({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    let __VLS_179;
    let __VLS_180;
    let __VLS_181;
    const __VLS_182 = {
        onClick: (__VLS_ctx.submitUpload)
    };
    __VLS_178.slots.default;
    var __VLS_178;
}
var __VLS_124;
const __VLS_183 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}));
const __VLS_185 = __VLS_184({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
__VLS_186.slots.default;
const __VLS_187 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_189 = __VLS_188({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
__VLS_190.slots.default;
const __VLS_191 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    label: "文档标题",
}));
const __VLS_193 = __VLS_192({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
__VLS_194.slots.default;
const __VLS_195 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    modelValue: (__VLS_ctx.editForm.title),
}));
const __VLS_197 = __VLS_196({
    modelValue: (__VLS_ctx.editForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
var __VLS_194;
const __VLS_199 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
    label: "允许角色",
}));
const __VLS_201 = __VLS_200({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
__VLS_202.slots.default;
const __VLS_203 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}));
const __VLS_205 = __VLS_204({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
__VLS_206.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_207 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_209 = __VLS_208({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
}
var __VLS_206;
var __VLS_202;
var __VLS_190;
{
    const { footer: __VLS_thisSlot } = __VLS_186.slots;
    const __VLS_211 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        ...{ 'onClick': {} },
    }));
    const __VLS_213 = __VLS_212({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    let __VLS_215;
    let __VLS_216;
    let __VLS_217;
    const __VLS_218 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editVisible = false;
        }
    };
    __VLS_214.slots.default;
    var __VLS_214;
    const __VLS_219 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_221 = __VLS_220({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_220));
    let __VLS_223;
    let __VLS_224;
    let __VLS_225;
    const __VLS_226 = {
        onClick: (__VLS_ctx.submitEdit)
    };
    __VLS_222.slots.default;
    var __VLS_222;
}
var __VLS_186;
/** @type {__VLS_StyleScopedClasses['knowledge-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
// @ts-ignore
var __VLS_158 = __VLS_157;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ElMessage: ElMessage,
            UploadFilled: UploadFilled,
            searchQuery: searchQuery,
            loading: loading,
            documents: documents,
            roles: roles,
            canManageKnowledge: canManageKnowledge,
            uploadVisible: uploadVisible,
            uploading: uploading,
            uploadRef: uploadRef,
            uploadForm: uploadForm,
            editVisible: editVisible,
            editForm: editForm,
            loadDocuments: loadDocuments,
            handleSearch: handleSearch,
            handleFileChange: handleFileChange,
            submitUpload: submitUpload,
            handleEdit: handleEdit,
            submitEdit: submitEdit,
            handleDelete: handleDelete,
            handleReindex: handleReindex,
            handleReindexAll: handleReindexAll,
            formatDate: formatDate,
            getStatusType: getStatusType,
            getStatusLabel: getStatusLabel,
            formatSize: formatSize,
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