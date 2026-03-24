/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { listDocuments, searchDocuments, uploadDocument, updateDocument, deleteDocument, reindexAll, reindexOne, } from '@/api/document';
import { listRoles } from '@/api/role';
const searchQuery = ref('');
const loading = ref(false);
const documents = ref([]);
const roles = ref([]);
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
onMounted(() => {
    loadDocuments();
    loadRoles();
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
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索文档...",
    prefixIcon: "Search",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索文档...",
    prefixIcon: "Search",
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onKeyup: (__VLS_ctx.handleSearch)
};
const __VLS_8 = {
    onClear: (__VLS_ctx.loadDocuments)
};
var __VLS_3;
const __VLS_9 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onClick': {} },
}));
const __VLS_11 = __VLS_10({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_12.slots.default;
var __VLS_12;
const __VLS_17 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Upload",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Upload",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.uploadVisible = true;
    }
};
__VLS_20.slots.default;
var __VLS_20;
const __VLS_25 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    ...{ 'onClick': {} },
    icon: "Refresh",
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClick': {} },
    icon: "Refresh",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_29;
let __VLS_30;
let __VLS_31;
const __VLS_32 = {
    onClick: (__VLS_ctx.loadDocuments)
};
__VLS_28.slots.default;
var __VLS_28;
const __VLS_33 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onClick: (__VLS_ctx.handleReindexAll)
};
__VLS_36.slots.default;
var __VLS_36;
const __VLS_41 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_43 = __VLS_42({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_44.slots.default;
const __VLS_45 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_47 = __VLS_46({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const __VLS_49 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_51 = __VLS_50({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const __VLS_53 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    prop: "fileName",
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}));
const __VLS_55 = __VLS_54({
    prop: "fileName",
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const __VLS_57 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    prop: "contentType",
    label: "类型",
    width: "120",
}));
const __VLS_59 = __VLS_58({
    prop: "contentType",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_60.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_61 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        size: "small",
    }));
    const __VLS_63 = __VLS_62({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    __VLS_64.slots.default;
    (row.contentType || '-');
    var __VLS_64;
}
var __VLS_60;
const __VLS_65 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "大小",
    width: "100",
}));
const __VLS_67 = __VLS_66({
    label: "大小",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_68.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatSize(row.fileSize));
}
var __VLS_68;
const __VLS_69 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_71 = __VLS_70({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_72.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_73 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        type: (__VLS_ctx.getStatusType(row.status)),
    }));
    const __VLS_75 = __VLS_74({
        type: (__VLS_ctx.getStatusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_76.slots.default;
    (__VLS_ctx.getStatusLabel(row.status));
    var __VLS_76;
}
var __VLS_72;
const __VLS_77 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "允许角色",
    width: "160",
}));
const __VLS_79 = __VLS_78({
    label: "允许角色",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_80.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [r] of __VLS_getVForSourceType((row.allowedRoles))) {
        const __VLS_81 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
            key: (r),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_83 = __VLS_82({
            key: (r),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        __VLS_84.slots.default;
        (r);
        var __VLS_84;
    }
}
var __VLS_80;
const __VLS_85 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_87 = __VLS_86({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_88.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_88;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "操作",
    width: "240",
    fixed: "right",
}));
const __VLS_91 = __VLS_90({
    label: "操作",
    width: "240",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_92.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_93 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_97;
    let __VLS_98;
    let __VLS_99;
    const __VLS_100 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_96.slots.default;
    var __VLS_96;
    const __VLS_101 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    let __VLS_107;
    const __VLS_108 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleReindex(row);
        }
    };
    __VLS_104.slots.default;
    var __VLS_104;
    const __VLS_109 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    let __VLS_115;
    const __VLS_116 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_112.slots.default;
    var __VLS_112;
}
var __VLS_92;
var __VLS_44;
const __VLS_117 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文档",
    width: "500px",
    alignCenter: true,
}));
const __VLS_119 = __VLS_118({
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文档",
    width: "500px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
const __VLS_121 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_123 = __VLS_122({
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: "文档标题",
}));
const __VLS_127 = __VLS_126({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "可选，留空使用文件名",
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "可选，留空使用文件名",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
var __VLS_128;
const __VLS_133 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    label: "允许角色",
}));
const __VLS_135 = __VLS_134({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请选择角色",
    ...{ style: {} },
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请选择角色",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_141 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_143 = __VLS_142({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
}
var __VLS_140;
var __VLS_136;
const __VLS_145 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    label: "选择文件",
}));
const __VLS_147 = __VLS_146({
    label: "选择文件",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    ref: "uploadRef",
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onExceed: (() => __VLS_ctx.ElMessage.warning('只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}));
const __VLS_151 = __VLS_150({
    ref: "uploadRef",
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onExceed: (() => __VLS_ctx.ElMessage.warning('只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
/** @type {typeof __VLS_ctx.uploadRef} */ ;
var __VLS_153 = {};
__VLS_152.slots.default;
const __VLS_155 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    ...{ class: "el-icon--upload" },
}));
const __VLS_157 = __VLS_156({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
const __VLS_159 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, typeof __VLS_components.uploadFilled, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({}));
const __VLS_161 = __VLS_160({}, ...__VLS_functionalComponentArgsRest(__VLS_160));
var __VLS_158;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_152.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_152;
var __VLS_148;
var __VLS_124;
{
    const { footer: __VLS_thisSlot } = __VLS_120.slots;
    const __VLS_163 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
        ...{ 'onClick': {} },
    }));
    const __VLS_165 = __VLS_164({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    let __VLS_167;
    let __VLS_168;
    let __VLS_169;
    const __VLS_170 = {
        onClick: (...[$event]) => {
            __VLS_ctx.uploadVisible = false;
        }
    };
    __VLS_166.slots.default;
    var __VLS_166;
    const __VLS_171 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }));
    const __VLS_173 = __VLS_172({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    let __VLS_175;
    let __VLS_176;
    let __VLS_177;
    const __VLS_178 = {
        onClick: (__VLS_ctx.submitUpload)
    };
    __VLS_174.slots.default;
    var __VLS_174;
}
var __VLS_120;
const __VLS_179 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}));
const __VLS_181 = __VLS_180({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
__VLS_182.slots.default;
const __VLS_183 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_185 = __VLS_184({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
__VLS_186.slots.default;
const __VLS_187 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    label: "文档标题",
}));
const __VLS_189 = __VLS_188({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
__VLS_190.slots.default;
const __VLS_191 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    modelValue: (__VLS_ctx.editForm.title),
}));
const __VLS_193 = __VLS_192({
    modelValue: (__VLS_ctx.editForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
var __VLS_190;
const __VLS_195 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    label: "允许角色",
}));
const __VLS_197 = __VLS_196({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
__VLS_198.slots.default;
const __VLS_199 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}));
const __VLS_201 = __VLS_200({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
__VLS_202.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_203 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_205 = __VLS_204({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
}
var __VLS_202;
var __VLS_198;
var __VLS_186;
{
    const { footer: __VLS_thisSlot } = __VLS_182.slots;
    const __VLS_207 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        ...{ 'onClick': {} },
    }));
    const __VLS_209 = __VLS_208({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    let __VLS_211;
    let __VLS_212;
    let __VLS_213;
    const __VLS_214 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editVisible = false;
        }
    };
    __VLS_210.slots.default;
    var __VLS_210;
    const __VLS_215 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_217 = __VLS_216({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    let __VLS_219;
    let __VLS_220;
    let __VLS_221;
    const __VLS_222 = {
        onClick: (__VLS_ctx.submitEdit)
    };
    __VLS_218.slots.default;
    var __VLS_218;
}
var __VLS_182;
/** @type {__VLS_StyleScopedClasses['knowledge-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
// @ts-ignore
var __VLS_154 = __VLS_153;
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