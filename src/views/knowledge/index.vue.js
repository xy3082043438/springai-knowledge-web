/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { listDocuments, searchDocuments, createDocument, uploadDocument, updateDocument, deleteDocument, reindexAll, reindexOne, } from '@/api/business/document';
import { listRoles } from '@/api/system/role';
import { useUserStore } from '@/store/user';
import { isAdminRole } from '@/utils/access';
const supportedFileExtensions = ['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'md', 'markdown', 'html', 'htm', 'csv'];
const supportedFileAccept = supportedFileExtensions.map((ext) => `.${ext}`).join(',');
const supportedFileLabel = 'PDF、DOCX、PPTX、XLSX、TXT、MD、HTML、CSV';
const userStore = useUserStore();
const searchQuery = ref('');
const loading = ref(false);
const documents = ref([]);
const roles = ref([]);
const canManageKnowledge = computed(() => isAdminRole(userStore.userInfo?.role));
// Create Text
const createVisible = ref(false);
const creating = ref(false);
const createForm = ref({ title: '', content: '', allowedRoles: [] });
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
const resetCreateDialog = () => {
    createForm.value = { title: '', content: '', allowedRoles: [] };
};
const submitCreate = async () => {
    const title = createForm.value.title.trim();
    const content = createForm.value.content;
    if (!title) {
        ElMessage.warning('文档标题为必填项，请补充完善');
        return;
    }
    if (!content.trim()) {
        ElMessage.warning('文档内容不能为空，请填写要录入的文本');
        return;
    }
    if (createForm.value.allowedRoles.length === 0) {
        ElMessage.warning('请至少选择一个允许访问该文档的角色');
        return;
    }
    creating.value = true;
    try {
        await createDocument({
            title,
            content,
            allowedRoles: createForm.value.allowedRoles,
        });
        ElMessage.success('文档创建成功，系统已开始处理');
        createVisible.value = false;
        resetCreateDialog();
        loadDocuments();
    }
    finally {
        creating.value = false;
    }
};
const getFileExtension = (fileName) => {
    if (!fileName)
        return '';
    const index = fileName.lastIndexOf('.');
    return index >= 0 ? fileName.slice(index + 1).toLowerCase() : '';
};
const isSupportedFile = (file) => supportedFileExtensions.includes(getFileExtension(file.name));
const resetUploadDialog = () => {
    uploadForm.value = { title: '', allowedRoles: [] };
    selectedFile.value = null;
    uploadRef.value?.clearFiles();
};
const handleFileChange = (file) => {
    const rawFile = file.raw || null;
    if (!rawFile) {
        selectedFile.value = null;
        return;
    }
    if (!isSupportedFile(rawFile)) {
        selectedFile.value = null;
        ElMessage.error(`格式不支持，请上传 ${supportedFileLabel} 类型的文件。`);
        uploadRef.value?.clearFiles();
        return;
    }
    selectedFile.value = rawFile;
};
const handleFileRemove = () => {
    selectedFile.value = null;
};
const submitUpload = async () => {
    if (!selectedFile.value) {
        ElMessage.warning('您还未选择文件，请上传后再提交。');
        return;
    }
    if (!isSupportedFile(selectedFile.value)) {
        ElMessage.warning(`格式不支持，请上传 ${supportedFileLabel} 类型的文件。`);
        return;
    }
    if (uploadForm.value.allowedRoles.length === 0) {
        ElMessage.warning('请至少选择一个允许访问该文档的角色。');
        return;
    }
    uploading.value = true;
    try {
        await uploadDocument(selectedFile.value, uploadForm.value.allowedRoles, uploadForm.value.title || undefined);
        ElMessage.success('文件上传成功，系统正在解析处理中。');
        uploadVisible.value = false;
        resetUploadDialog();
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
        ElMessage.success('提交成功！您的修改已保存。');
        editVisible.value = false;
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const handleDelete = (row) => {
    ElMessageBox.confirm(`您确定要彻底删除文档 "${row.title || row.fileName}" 吗？此操作无法撤销，所有相关记忆和切片也将被清除。`, '请确认删除', { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' })
        .then(async () => {
        await deleteDocument(row.id);
        ElMessage.success('删除操作已成功完成。');
        loadDocuments();
    })
        .catch(() => { });
};
const handleReindex = async (row) => {
    try {
        const { data } = await reindexOne(row.id);
        ElMessage.success(`切片重新构建完成：成功 ${data.success} 条，失败 ${data.failed} 条。`);
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const handleReindexAll = async () => {
    try {
        const { data } = await reindexAll();
        ElMessage.success(`全局构建任务已完成：共扫描 ${data.total} 篇文档，成功 ${data.success} 篇，失败 ${data.failed} 篇。`);
        loadDocuments();
    }
    catch { /* interceptor */ }
};
const formatDate = (dateStr) => {
    if (!dateStr)
        return '-';
    return new Date(dateStr).toLocaleString('zh-CN', { hour12: false });
};
const getFileNameLabel = (row) => row.fileName || '文本录入';
const getContentTypeLabel = (row) => {
    if (row.contentType)
        return row.contentType;
    if (!row.fileName)
        return 'TEXT';
    const extension = getFileExtension(row.fileName);
    return extension ? extension.toUpperCase() : '-';
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
    if (bytes == null)
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
    placeholder: "输入关键词快速搜索文档...",
    prefixIcon: "Search",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_6 = __VLS_5({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "输入关键词快速搜索文档...",
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
        type: "success",
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.canManageKnowledge))
                return;
            __VLS_ctx.createVisible = true;
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
        type: "primary",
        icon: "Upload",
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Upload",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    let __VLS_43;
    const __VLS_44 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.canManageKnowledge))
                return;
            __VLS_ctx.uploadVisible = true;
        }
    };
    __VLS_40.slots.default;
    var __VLS_40;
}
if (__VLS_ctx.canManageKnowledge) {
    const __VLS_45 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        type: "warning",
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_49;
    let __VLS_50;
    let __VLS_51;
    const __VLS_52 = {
        onClick: (__VLS_ctx.handleReindexAll)
    };
    __VLS_48.slots.default;
    var __VLS_48;
}
const __VLS_53 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_55 = __VLS_54({
    data: (__VLS_ctx.documents),
    ...{ style: {} },
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_56.slots.default;
const __VLS_57 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_59 = __VLS_58({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_61 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_63 = __VLS_62({
    prop: "title",
    label: "文档标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const __VLS_65 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}));
const __VLS_67 = __VLS_66({
    label: "文件名",
    width: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_68.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.getFileNameLabel(row));
}
var __VLS_68;
const __VLS_69 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    prop: "contentType",
    label: "类型",
    width: "120",
}));
const __VLS_71 = __VLS_70({
    prop: "contentType",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_72.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_73 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        size: "small",
    }));
    const __VLS_75 = __VLS_74({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_76.slots.default;
    (__VLS_ctx.getContentTypeLabel(row));
    var __VLS_76;
}
var __VLS_72;
const __VLS_77 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "大小",
    width: "100",
}));
const __VLS_79 = __VLS_78({
    label: "大小",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_80.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatSize(row.fileSize));
}
var __VLS_80;
const __VLS_81 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_83 = __VLS_82({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_84.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_85 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        type: (__VLS_ctx.getStatusType(row.status)),
    }));
    const __VLS_87 = __VLS_86({
        type: (__VLS_ctx.getStatusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    (__VLS_ctx.getStatusLabel(row.status));
    var __VLS_88;
}
var __VLS_84;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "允许角色",
    width: "160",
}));
const __VLS_91 = __VLS_90({
    label: "允许角色",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_92.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [r] of __VLS_getVForSourceType((row.allowedRoles))) {
        const __VLS_93 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            key: (r),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_95 = __VLS_94({
            key: (r),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        __VLS_96.slots.default;
        (r);
        var __VLS_96;
    }
}
var __VLS_92;
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_99 = __VLS_98({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_100.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_100;
if (__VLS_ctx.canManageKnowledge) {
    const __VLS_101 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        label: "操作",
        width: "240",
        fixed: "right",
    }));
    const __VLS_103 = __VLS_102({
        label: "操作",
        width: "240",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    __VLS_104.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_104.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_105 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_107 = __VLS_106({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        let __VLS_109;
        let __VLS_110;
        let __VLS_111;
        const __VLS_112 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleEdit(row);
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
            type: "warning",
            size: "small",
        }));
        const __VLS_115 = __VLS_114({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        let __VLS_117;
        let __VLS_118;
        let __VLS_119;
        const __VLS_120 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleReindex(row);
            }
        };
        __VLS_116.slots.default;
        var __VLS_116;
        const __VLS_121 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }));
        const __VLS_123 = __VLS_122({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        let __VLS_125;
        let __VLS_126;
        let __VLS_127;
        const __VLS_128 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageKnowledge))
                    return;
                __VLS_ctx.handleDelete(row);
            }
        };
        __VLS_124.slots.default;
        var __VLS_124;
    }
    var __VLS_104;
}
var __VLS_56;
const __VLS_129 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "文本录入",
    width: "620px",
    alignCenter: true,
}));
const __VLS_131 = __VLS_130({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "文本录入",
    width: "620px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
let __VLS_133;
let __VLS_134;
let __VLS_135;
const __VLS_136 = {
    onClosed: (__VLS_ctx.resetCreateDialog)
};
__VLS_132.slots.default;
const __VLS_137 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_139 = __VLS_138({
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    label: "文档标题",
    required: true,
}));
const __VLS_143 = __VLS_142({
    label: "文档标题",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
const __VLS_145 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.createForm.title),
    maxlength: "120",
    showWordLimit: true,
    placeholder: "请输入文档的主题或标题",
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.createForm.title),
    maxlength: "120",
    showWordLimit: true,
    placeholder: "请输入文档的主题或标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
var __VLS_144;
const __VLS_149 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    label: "允许角色",
}));
const __VLS_151 = __VLS_150({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    modelValue: (__VLS_ctx.createForm.allowedRoles),
    multiple: true,
    placeholder: "请点击选择可见角色...",
    ...{ style: {} },
}));
const __VLS_155 = __VLS_154({
    modelValue: (__VLS_ctx.createForm.allowedRoles),
    multiple: true,
    placeholder: "请点击选择可见角色...",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_157 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_159 = __VLS_158({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
}
var __VLS_156;
var __VLS_152;
const __VLS_161 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "文档内容",
    required: true,
}));
const __VLS_163 = __VLS_162({
    label: "文档内容",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
const __VLS_165 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.createForm.content),
    type: "textarea",
    rows: (12),
    maxlength: "20000",
    showWordLimit: true,
    placeholder: "在此输入文本，它将被解析并作为知识库的参考来源...",
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.createForm.content),
    type: "textarea",
    rows: (12),
    maxlength: "20000",
    showWordLimit: true,
    placeholder: "在此输入文本，它将被解析并作为知识库的参考来源...",
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
var __VLS_164;
var __VLS_140;
{
    const { footer: __VLS_thisSlot } = __VLS_132.slots;
    const __VLS_169 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        ...{ 'onClick': {} },
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_172.slots.default;
    var __VLS_172;
    const __VLS_177 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.creating),
    }));
    const __VLS_179 = __VLS_178({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.creating),
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    let __VLS_181;
    let __VLS_182;
    let __VLS_183;
    const __VLS_184 = {
        onClick: (__VLS_ctx.submitCreate)
    };
    __VLS_180.slots.default;
    var __VLS_180;
}
var __VLS_132;
const __VLS_185 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文件",
    width: "500px",
    alignCenter: true,
}));
const __VLS_187 = __VLS_186({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.uploadVisible),
    title: "上传文件",
    width: "500px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
let __VLS_189;
let __VLS_190;
let __VLS_191;
const __VLS_192 = {
    onClosed: (__VLS_ctx.resetUploadDialog)
};
__VLS_188.slots.default;
const __VLS_193 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_195 = __VLS_194({
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
const __VLS_197 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "文档标题",
}));
const __VLS_199 = __VLS_198({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
const __VLS_201 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "文档标题（可选，留空默认使用上传的文件名）",
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.uploadForm.title),
    placeholder: "文档标题（可选，留空默认使用上传的文件名）",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
var __VLS_200;
const __VLS_205 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    label: "允许角色",
}));
const __VLS_207 = __VLS_206({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
const __VLS_209 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请点击选择可见角色...",
    ...{ style: {} },
}));
const __VLS_211 = __VLS_210({
    modelValue: (__VLS_ctx.uploadForm.allowedRoles),
    multiple: true,
    placeholder: "请点击选择可见角色...",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
__VLS_212.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_213 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_215 = __VLS_214({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
}
var __VLS_212;
var __VLS_208;
const __VLS_217 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    label: "选择文件",
}));
const __VLS_219 = __VLS_218({
    label: "选择文件",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
__VLS_220.slots.default;
const __VLS_221 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    ref: "uploadRef",
    accept: (__VLS_ctx.supportedFileAccept),
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onRemove: (__VLS_ctx.handleFileRemove),
    onExceed: (() => __VLS_ctx.ElMessage.warning('抱歉，每次只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}));
const __VLS_223 = __VLS_222({
    ref: "uploadRef",
    accept: (__VLS_ctx.supportedFileAccept),
    autoUpload: (false),
    limit: (1),
    onChange: (__VLS_ctx.handleFileChange),
    onRemove: (__VLS_ctx.handleFileRemove),
    onExceed: (() => __VLS_ctx.ElMessage.warning('抱歉，每次只能上传一个文件')),
    drag: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
/** @type {typeof __VLS_ctx.uploadRef} */ ;
var __VLS_225 = {};
__VLS_224.slots.default;
const __VLS_227 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
    ...{ class: "el-icon--upload" },
}));
const __VLS_229 = __VLS_228({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
__VLS_230.slots.default;
const __VLS_231 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, typeof __VLS_components.uploadFilled, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({}));
const __VLS_233 = __VLS_232({}, ...__VLS_functionalComponentArgsRest(__VLS_232));
var __VLS_230;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_224.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
    (__VLS_ctx.supportedFileLabel);
}
var __VLS_224;
var __VLS_220;
var __VLS_196;
{
    const { footer: __VLS_thisSlot } = __VLS_188.slots;
    const __VLS_235 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
        ...{ 'onClick': {} },
    }));
    const __VLS_237 = __VLS_236({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    let __VLS_239;
    let __VLS_240;
    let __VLS_241;
    const __VLS_242 = {
        onClick: (...[$event]) => {
            __VLS_ctx.uploadVisible = false;
        }
    };
    __VLS_238.slots.default;
    var __VLS_238;
    const __VLS_243 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }));
    const __VLS_245 = __VLS_244({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    let __VLS_247;
    let __VLS_248;
    let __VLS_249;
    const __VLS_250 = {
        onClick: (__VLS_ctx.submitUpload)
    };
    __VLS_246.slots.default;
    var __VLS_246;
}
var __VLS_188;
const __VLS_251 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}));
const __VLS_253 = __VLS_252({
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑文档",
    width: "460px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
__VLS_254.slots.default;
const __VLS_255 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}));
const __VLS_257 = __VLS_256({
    model: (__VLS_ctx.editForm),
    labelWidth: "80px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
__VLS_258.slots.default;
const __VLS_259 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    label: "文档标题",
}));
const __VLS_261 = __VLS_260({
    label: "文档标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
__VLS_262.slots.default;
const __VLS_263 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
    modelValue: (__VLS_ctx.editForm.title),
}));
const __VLS_265 = __VLS_264({
    modelValue: (__VLS_ctx.editForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
var __VLS_262;
const __VLS_267 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
    label: "允许角色",
}));
const __VLS_269 = __VLS_268({
    label: "允许角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
__VLS_270.slots.default;
const __VLS_271 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}));
const __VLS_273 = __VLS_272({
    modelValue: (__VLS_ctx.editForm.allowedRoles),
    multiple: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
__VLS_274.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_275 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_277 = __VLS_276({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_276));
}
var __VLS_274;
var __VLS_270;
var __VLS_258;
{
    const { footer: __VLS_thisSlot } = __VLS_254.slots;
    const __VLS_279 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
        ...{ 'onClick': {} },
    }));
    const __VLS_281 = __VLS_280({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_280));
    let __VLS_283;
    let __VLS_284;
    let __VLS_285;
    const __VLS_286 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editVisible = false;
        }
    };
    __VLS_282.slots.default;
    var __VLS_282;
    const __VLS_287 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_289 = __VLS_288({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_288));
    let __VLS_291;
    let __VLS_292;
    let __VLS_293;
    const __VLS_294 = {
        onClick: (__VLS_ctx.submitEdit)
    };
    __VLS_290.slots.default;
    var __VLS_290;
}
var __VLS_254;
/** @type {__VLS_StyleScopedClasses['knowledge-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
// @ts-ignore
var __VLS_226 = __VLS_225;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ElMessage: ElMessage,
            UploadFilled: UploadFilled,
            supportedFileAccept: supportedFileAccept,
            supportedFileLabel: supportedFileLabel,
            searchQuery: searchQuery,
            loading: loading,
            documents: documents,
            roles: roles,
            canManageKnowledge: canManageKnowledge,
            createVisible: createVisible,
            creating: creating,
            createForm: createForm,
            uploadVisible: uploadVisible,
            uploading: uploading,
            uploadRef: uploadRef,
            uploadForm: uploadForm,
            editVisible: editVisible,
            editForm: editForm,
            loadDocuments: loadDocuments,
            handleSearch: handleSearch,
            resetCreateDialog: resetCreateDialog,
            submitCreate: submitCreate,
            resetUploadDialog: resetUploadDialog,
            handleFileChange: handleFileChange,
            handleFileRemove: handleFileRemove,
            submitUpload: submitUpload,
            handleEdit: handleEdit,
            submitEdit: submitEdit,
            handleDelete: handleDelete,
            handleReindex: handleReindex,
            handleReindexAll: handleReindexAll,
            formatDate: formatDate,
            getFileNameLabel: getFileNameLabel,
            getContentTypeLabel: getContentTypeLabel,
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