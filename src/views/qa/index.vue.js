/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { askStream } from '@/api/business/qa';
import { createFeedback } from '@/api/business/feedback';
import { previewChunk } from '@/api/business/document';
const messages = ref([
    {
        role: 'assistant',
        content: '你好！我是你的 AI 助手，有什么可以帮助你的吗？'
    }
]);
const inputMessage = ref('');
const loading = ref(false);
const chatHistoryRef = ref(null);
const currentChunk = ref(null);
const feedbackDialog = reactive({
    visible: false,
    saving: false,
    helpful: true,
    msg: null,
    form: {
        comment: ''
    }
});
const scrollToBottom = async () => {
    await nextTick();
    if (chatHistoryRef.value) {
        chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
    }
};
const sendMessage = async () => {
    if (!inputMessage.value.trim() || loading.value)
        return;
    const question = inputMessage.value;
    messages.value.push({ role: 'user', content: question });
    inputMessage.value = '';
    loading.value = true;
    scrollToBottom();
    let assistantMsgIndex = -1;
    await askStream({ question }, (chunk) => {
        // 收到第一字时隐藏"思考中"加载态并建空消息框
        if (loading.value) {
            loading.value = false;
            assistantMsgIndex = messages.value.length;
            messages.value.push({ role: 'assistant', content: '' });
        }
        const targetMsg = messages.value[assistantMsgIndex];
        if (chunk.answer)
            targetMsg.content += chunk.answer;
        if (chunk.qaLogId)
            targetMsg.qaLogId = chunk.qaLogId;
        if (chunk.sources)
            targetMsg.sources = chunk.sources;
        scrollToBottom();
    }, () => {
        loading.value = false;
        scrollToBottom();
    }, (err) => {
        if (loading.value) {
            // 如果出错还没流出任何文字
            loading.value = false;
            messages.value.push({ role: 'assistant', content: '抱歉，网络或服务响应异常，请稍后重试。' });
        }
        else if (assistantMsgIndex >= 0) {
            messages.value[assistantMsgIndex].content += '\n\n*(网络连接已中断)*';
        }
        scrollToBottom();
    });
};
const handlePreviewChunk = async (chunkId) => {
    try {
        const { data } = await previewChunk(chunkId);
        currentChunk.value = data;
    }
    catch {
        ElMessage.error('抱歉，预览内容加载失败，请重试。');
    }
};
const handleFeedback = (msg, helpful) => {
    if (!msg.qaLogId)
        return;
    feedbackDialog.msg = msg;
    feedbackDialog.helpful = helpful;
    feedbackDialog.form.comment = '';
    feedbackDialog.visible = true;
};
const submitFeedback = async () => {
    if (!feedbackDialog.msg || !feedbackDialog.msg.qaLogId)
        return;
    feedbackDialog.saving = true;
    try {
        await createFeedback({
            qaLogId: feedbackDialog.msg.qaLogId,
            helpful: feedbackDialog.helpful,
            comment: feedbackDialog.form.comment || undefined
        });
        feedbackDialog.msg.feedbackGiven = feedbackDialog.helpful;
        ElMessage.success('感谢您的宝贵反馈！我们将持续改进。');
        feedbackDialog.visible = false;
    }
    catch (err) {
        // captured in interceptor
    }
    finally {
        feedbackDialog.saving = false;
    }
};
const formatMessage = (content) => {
    return content.replace(/\n/g, '<br>');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qa-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-subtitle" },
});
const __VLS_0 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    type: "info",
}));
const __VLS_2 = __VLS_1({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-history" },
    ref: "chatHistoryRef",
});
/** @type {typeof __VLS_ctx.chatHistoryRef} */ ;
for (const [msg, index] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: (['message', msg.role]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "message-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar" },
    });
    const __VLS_4 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        icon: (msg.role === 'user' ? 'User' : 'Service'),
        ...{ class: (msg.role) },
    }));
    const __VLS_6 = __VLS_5({
        icon: (msg.role === 'user' ? 'User' : 'Service'),
        ...{ class: (msg.role) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text" },
    });
    if (msg.role === 'assistant') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "answer-content" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formatMessage(msg.content)) }, null, null);
        if (msg.sources && msg.sources.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "references" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ref-title" },
            });
            for (const [src, idx] of __VLS_getVForSourceType((msg.sources))) {
                const __VLS_8 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                    ...{ 'onClick': {} },
                    key: (idx),
                    ...{ class: "ref-item" },
                }));
                const __VLS_10 = __VLS_9({
                    ...{ 'onClick': {} },
                    key: (idx),
                    ...{ class: "ref-item" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_9));
                let __VLS_12;
                let __VLS_13;
                let __VLS_14;
                const __VLS_15 = {
                    onClick: (...[$event]) => {
                        if (!(msg.role === 'assistant'))
                            return;
                        if (!(msg.sources && msg.sources.length > 0))
                            return;
                        __VLS_ctx.handlePreviewChunk(src.chunkId);
                    }
                };
                __VLS_11.slots.default;
                (src.title || src.fileName);
                (src.score?.toFixed(2));
                var __VLS_11;
            }
        }
        if (msg.qaLogId) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feedback-actions" },
            });
            const __VLS_16 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === true ? 'success' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }));
            const __VLS_18 = __VLS_17({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === true ? 'success' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }, ...__VLS_functionalComponentArgsRest(__VLS_17));
            let __VLS_20;
            let __VLS_21;
            let __VLS_22;
            const __VLS_23 = {
                onClick: (...[$event]) => {
                    if (!(msg.role === 'assistant'))
                        return;
                    if (!(msg.qaLogId))
                        return;
                    __VLS_ctx.handleFeedback(msg, true);
                }
            };
            __VLS_19.slots.default;
            var __VLS_19;
            const __VLS_24 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === false ? 'danger' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }));
            const __VLS_26 = __VLS_25({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === false ? 'danger' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            let __VLS_28;
            let __VLS_29;
            let __VLS_30;
            const __VLS_31 = {
                onClick: (...[$event]) => {
                    if (!(msg.role === 'assistant'))
                        return;
                    if (!(msg.qaLogId))
                        return;
                    __VLS_ctx.handleFeedback(msg, false);
                }
            };
            __VLS_27.slots.default;
            var __VLS_27;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (msg.content);
    }
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "message assistant" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "message-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar" },
    });
    const __VLS_32 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        icon: "Service",
        ...{ class: "assistant" },
    }));
    const __VLS_34 = __VLS_33({
        icon: "Service",
        ...{ class: "assistant" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
const __VLS_36 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.inputMessage),
    type: "textarea",
    autosize: ({ minRows: 1, maxRows: 5 }),
    placeholder: "在此输入您的问题，系统将基于知识库为您解答（按 Enter 发送，Shift+Enter 换行）...",
    resize: "none",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.inputMessage),
    type: "textarea",
    autosize: ({ minRows: 1, maxRows: 5 }),
    placeholder: "在此输入您的问题，系统将基于知识库为您解答（按 Enter 发送，Shift+Enter 换行）...",
    resize: "none",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onKeydown: (__VLS_ctx.sendMessage)
};
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "send-btn" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "send-btn" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.sendMessage)
};
__VLS_47.slots.default;
var __VLS_47;
if (__VLS_ctx.currentChunk) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-panel" },
    });
    const __VLS_52 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ class: "preview-card" },
    }));
    const __VLS_54 = __VLS_53({
        ...{ class: "preview-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_55.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentChunk.title || __VLS_ctx.currentChunk.fileName);
        const __VLS_56 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_58 = __VLS_57({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        let __VLS_60;
        let __VLS_61;
        let __VLS_62;
        const __VLS_63 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentChunk))
                    return;
                __VLS_ctx.currentChunk = null;
            }
        };
        __VLS_59.slots.default;
        var __VLS_59;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fragment-text" },
    });
    (__VLS_ctx.currentChunk.content);
    const __VLS_64 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const __VLS_68 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        column: (2),
        size: "small",
        border: true,
    }));
    const __VLS_70 = __VLS_69({
        column: (2),
        size: "small",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "页码",
    }));
    const __VLS_74 = __VLS_73({
        label: "页码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (__VLS_ctx.currentChunk.pageNumber);
    var __VLS_75;
    const __VLS_76 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "分片序号",
    }));
    const __VLS_78 = __VLS_77({
        label: "分片序号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (__VLS_ctx.currentChunk.chunkIndex);
    var __VLS_79;
    const __VLS_80 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "起始偏移",
    }));
    const __VLS_82 = __VLS_81({
        label: "起始偏移",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (__VLS_ctx.currentChunk.startOffset);
    var __VLS_83;
    const __VLS_84 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "结束偏移",
    }));
    const __VLS_86 = __VLS_85({
        label: "结束偏移",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (__VLS_ctx.currentChunk.endOffset);
    var __VLS_87;
    var __VLS_71;
    var __VLS_55;
}
const __VLS_88 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.feedbackDialog.visible),
    title: (__VLS_ctx.feedbackDialog.helpful ? '顶（有用）' : '踩（无用）'),
    width: "400px",
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.feedbackDialog.visible),
    title: (__VLS_ctx.feedbackDialog.helpful ? '顶（有用）' : '踩（无用）'),
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    model: (__VLS_ctx.feedbackDialog.form),
    labelPosition: "top",
}));
const __VLS_94 = __VLS_93({
    model: (__VLS_ctx.feedbackDialog.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "详细建议 (可选)",
}));
const __VLS_98 = __VLS_97({
    label: "详细建议 (可选)",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    modelValue: (__VLS_ctx.feedbackDialog.form.comment),
    type: "textarea",
    rows: (4),
    placeholder: "请输入您遇到的问题或者想要改进的地方...",
}));
const __VLS_102 = __VLS_101({
    modelValue: (__VLS_ctx.feedbackDialog.form.comment),
    type: "textarea",
    rows: (4),
    placeholder: "请输入您遇到的问题或者想要改进的地方...",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_99;
var __VLS_95;
{
    const { footer: __VLS_thisSlot } = __VLS_91.slots;
    const __VLS_104 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.feedbackDialog.visible = false;
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.feedbackDialog.saving),
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.feedbackDialog.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (__VLS_ctx.submitFeedback)
    };
    __VLS_115.slots.default;
    var __VLS_115;
}
var __VLS_91;
/** @type {__VLS_StyleScopedClasses['qa-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-history']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['answer-content']} */ ;
/** @type {__VLS_StyleScopedClasses['references']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-card']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['fragment-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            messages: messages,
            inputMessage: inputMessage,
            loading: loading,
            chatHistoryRef: chatHistoryRef,
            currentChunk: currentChunk,
            feedbackDialog: feedbackDialog,
            sendMessage: sendMessage,
            handlePreviewChunk: handlePreviewChunk,
            handleFeedback: handleFeedback,
            submitFeedback: submitFeedback,
            formatMessage: formatMessage,
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