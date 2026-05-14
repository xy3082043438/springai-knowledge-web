/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onBeforeUnmount } from 'vue';
import { getDocument, getDocumentFile } from '@/api/business/document';
import { Download } from '@element-plus/icons-vue';
const visible = ref(false);
const loading = ref(false);
const docTitle = ref('');
const docContent = ref('');
const contentType = ref('');
const fileBlobUrl = ref(null);
let currentDocId = null;
const isPreviewablePdf = computed(() => {
    return contentType.value === 'application/pdf';
});
const open = async (id) => {
    currentDocId = id;
    visible.value = true;
    loading.value = true;
    // Clear previous blob
    clearBlobUrl();
    try {
        // 1. Get document details (for content text)
        const { data: doc } = await getDocument(id);
        docTitle.value = doc.title || doc.fileName || '未知文档';
        docContent.value = doc.content || '';
        contentType.value = doc.contentType || '';
        // 2. If PDF, fetch the binary file for iframe preview
        if (isPreviewablePdf.value) {
            const resp = await getDocumentFile(id);
            const blob = resp.data || resp;
            fileBlobUrl.value = URL.createObjectURL(blob);
        }
    }
    catch (error) {
        console.error('Failed to load preview:', error);
    }
    finally {
        loading.value = false;
    }
};
const clearBlobUrl = () => {
    if (fileBlobUrl.value) {
        URL.revokeObjectURL(fileBlobUrl.value);
        fileBlobUrl.value = null;
    }
};
const handleDownload = async () => {
    if (!currentDocId)
        return;
    try {
        const blob = await getDocumentFile(currentDocId);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = docTitle.value;
        link.click();
        URL.revokeObjectURL(url);
    }
    catch (e) {
        console.error('Download failed:', e);
    }
};
onBeforeUnmount(() => {
    clearBlobUrl();
});
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: (`文档预览 - ${__VLS_ctx.docTitle}`),
    width: "85%",
    destroyOnClose: true,
    ...{ class: "preview-dialog" },
    showClose: (true),
    alignCenter: true,
    headerClass: "preview-header",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: (`文档预览 - ${__VLS_ctx.docTitle}`),
    width: "85%",
    destroyOnClose: true,
    ...{ class: "preview-dialog" },
    showClose: (true),
    alignCenter: true,
    headerClass: "preview-header",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-content-container" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.isPreviewablePdf) {
    if (__VLS_ctx.fileBlobUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.embed)({
            src: (`${__VLS_ctx.fileBlobUrl}#view=FitH`),
            type: "application/pdf",
            ...{ class: "pdf-viewer" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-preview" },
    });
    if (__VLS_ctx.docContent) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "content-wrapper" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
            ...{ class: "pure-text" },
        });
        (__VLS_ctx.docContent);
    }
    else {
        const __VLS_5 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
            description: "暂无预览内容",
        }));
        const __VLS_7 = __VLS_6({
            description: "暂无预览内容",
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    }
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-footer" },
    });
    const __VLS_9 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        size: "small",
        type: "info",
    }));
    const __VLS_11 = __VLS_10({
        size: "small",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    (__VLS_ctx.contentType);
    var __VLS_12;
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
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_16.slots.default;
    var __VLS_16;
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (__VLS_ctx.handleDownload)
    };
    __VLS_24.slots.default;
    var __VLS_24;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['preview-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pdf-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['pure-text']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            visible: visible,
            loading: loading,
            docTitle: docTitle,
            docContent: docContent,
            contentType: contentType,
            fileBlobUrl: fileBlobUrl,
            isPreviewablePdf: isPreviewablePdf,
            handleDownload: handleDownload,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DocumentPreview.vue.js.map