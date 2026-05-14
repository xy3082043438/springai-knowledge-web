/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, nextTick, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { ChatDotRound, Delete, CaretTop, CaretBottom } from '@element-plus/icons-vue';
import { askStream, getSuggestions } from '@/api/business/qa';
import { createFeedback } from '@/api/business/feedback';
import { previewChunk } from '@/api/business/document';
import { listSessions, listSessionLogs, deleteSession } from '@/api/business/session';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const messages = ref([]);
const inputMessage = ref('');
const loading = ref(false);
const chatHistoryRef = ref(null);
const currentChunk = ref(null);
const showPreview = ref(false);
const suggestedQuestions = ref([]);
/* ── 会话状态 ── */
const sessions = ref([]);
const currentSessionId = ref(null);
const sessionsLoading = ref(false);
const currentSessionTitle = computed(() => {
    return sessions.value.find(s => s.id === currentSessionId.value)?.title;
});
/* ── 会话管理 ── */
const loadSessionsList = async () => {
    sessionsLoading.value = true;
    try {
        const { data } = await listSessions();
        sessions.value = data;
    }
    catch (err) {
        console.error('加载会话列表失败', err);
    }
    finally {
        sessionsLoading.value = false;
    }
};
const handleSelectSession = async (sessionId) => {
    if (currentSessionId.value === sessionId)
        return;
    currentSessionId.value = sessionId;
    messages.value = [];
    loading.value = true;
    try {
        const { data } = await listSessionLogs(sessionId);
        messages.value = data.map(log => [
            { role: 'user', content: log.question },
            {
                role: 'assistant',
                content: log.answer,
                qaLogId: log.id,
                sources: parseRetrievalSources(log.retrievalJson)
            }
        ]).flat();
        await nextTick();
        scrollToBottom();
    }
    catch (err) {
        ElMessage.error('加载历史记录失败');
    }
    finally {
        loading.value = false;
    }
};
const parseRetrievalSources = (json) => {
    try {
        if (!json)
            return undefined;
        const parsed = JSON.parse(json);
        return parsed.sources;
    }
    catch {
        return undefined;
    }
};
const handleNewChat = () => {
    currentSessionId.value = null;
    messages.value = [];
};
const handleDeleteSession = async (id) => {
    try {
        await deleteSession(id);
        if (currentSessionId.value === id) {
            handleNewChat();
        }
        loadSessionsList();
    }
    catch (err) {
        ElMessage.error('删除失败');
    }
};
const formatDate = (iso) => {
    if (!iso)
        return '';
    const date = new Date(iso);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toTimeString().slice(0, 5);
    }
    return `${date.getMonth() + 1}/${date.getDate()}`;
};
/* ── 消息互动 ── */
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
    await askStream({ question, sessionId: currentSessionId.value || undefined }, (chunk) => {
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
        // 更新 Session ID (如果是新建的会话)
        if (chunk.sessionId && !currentSessionId.value) {
            currentSessionId.value = chunk.sessionId;
            loadSessionsList(); // 刷新列表以显示新标题
        }
        scrollToBottom();
    }, () => {
        loading.value = false;
        scrollToBottom();
    }, (err) => {
        loading.value = false;
        const errorMsg = err?.message || '';
        let displayMsg = '抱歉，网络或服务响应异常，请稍后重试。';
        if (errorMsg.includes('504') || errorMsg.includes('timeout')) {
            displayMsg = '大模型服务响应超时，请稍后再试。';
        }
        if (assistantMsgIndex >= 0) {
            messages.value[assistantMsgIndex].content += `\n\n*(错误: ${displayMsg})*`;
        }
        else {
            messages.value.push({ role: 'assistant', content: displayMsg });
        }
        scrollToBottom();
    });
};
/* ── 引用预览 ── */
const handlePreviewChunk = async (chunkId) => {
    try {
        const { data } = await previewChunk(chunkId);
        currentChunk.value = data;
        showPreview.value = true;
    }
    catch {
        ElMessage.error('无法预览内容');
    }
};
/* ── 反馈逻辑 ── */
const feedbackDialog = reactive({
    visible: false,
    saving: false,
    helpful: true,
    msg: null,
    form: {
        comment: ''
    }
});
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
        feedbackDialog.visible = false;
        ElMessage.success('感谢反馈');
    }
    finally {
        feedbackDialog.saving = false;
    }
};
const formatMessage = (content) => {
    if (!content)
        return '';
    return content.replace(/\n/g, '<br>');
};
/* ── 初始加载 ── */
const fetchSuggestions = async () => {
    try {
        const { data } = await getSuggestions();
        if (data && data.length > 0) {
            suggestedQuestions.value = data;
        }
    }
    catch (err) {
        console.warn('获取推荐问题失败', err);
    }
};
onMounted(() => {
    loadSessionsList();
    fetchSuggestions();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['user-brief']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-item']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-box']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-box']} */ ;
/** @type {__VLS_StyleScopedClasses['suggest-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-sidebar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qa-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "chat-sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sidebar-header" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "new-chat-btn" },
    icon: "Plus",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "new-chat-btn" },
    icon: "Plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleNewChat)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "session-list-wrap" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "session-list-wrap" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
if (__VLS_ctx.sessionsLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sessions-loading" },
    });
    const __VLS_12 = {}.ElSkeleton;
    /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        rows: (5),
        animated: true,
    }));
    const __VLS_14 = __VLS_13({
        rows: (5),
        animated: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
else if (__VLS_ctx.sessions.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-sessions" },
    });
    const __VLS_16 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        description: "暂无对话历史",
        imageSize: (60),
    }));
    const __VLS_18 = __VLS_17({
        description: "暂无对话历史",
        imageSize: (60),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "session-list" },
    });
    for (const [session] of __VLS_getVForSourceType((__VLS_ctx.sessions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.sessionsLoading))
                        return;
                    if (!!(__VLS_ctx.sessions.length === 0))
                        return;
                    __VLS_ctx.handleSelectSession(session.id);
                } },
            key: (session.id),
            ...{ class: (['session-item', { active: __VLS_ctx.currentSessionId === session.id }]) },
        });
        const __VLS_20 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...{ class: "session-icon" },
        }));
        const __VLS_22 = __VLS_21({
            ...{ class: "session-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        const __VLS_24 = {}.ChatDotRound;
        /** @type {[typeof __VLS_components.ChatDotRound, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
        const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
        var __VLS_23;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "session-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "session-title" },
        });
        (session.title || '新对话');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "session-time" },
        });
        (__VLS_ctx.formatDate(session.updatedAt));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            ...{ class: "session-actions" },
        });
        const __VLS_28 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            ...{ 'onConfirm': {} },
            title: "确定删除该会话吗？",
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onConfirm': {} },
            title: "确定删除该会话吗？",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_32;
        let __VLS_33;
        let __VLS_34;
        const __VLS_35 = {
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.sessionsLoading))
                    return;
                if (!!(__VLS_ctx.sessions.length === 0))
                    return;
                __VLS_ctx.handleDeleteSession(session.id);
            }
        };
        __VLS_31.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_31.slots;
            const __VLS_36 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                link: true,
                ...{ class: "delete-btn" },
            }));
            const __VLS_38 = __VLS_37({
                link: true,
                ...{ class: "delete-btn" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            __VLS_39.slots.default;
            const __VLS_40 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
            const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
            __VLS_43.slots.default;
            const __VLS_44 = {}.Delete;
            /** @type {[typeof __VLS_components.Delete, ]} */ ;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
            const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
            var __VLS_43;
            var __VLS_39;
        }
        var __VLS_31;
    }
}
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-main" },
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
(__VLS_ctx.currentSessionTitle ? `- ${__VLS_ctx.currentSessionTitle}` : '');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-right" },
});
const __VLS_48 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    type: "info",
    ...{ class: "brand-tag" },
}));
const __VLS_50 = __VLS_49({
    type: "info",
    ...{ class: "brand-tag" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
var __VLS_51;
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
    const __VLS_52 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        icon: (msg.role === 'user' ? 'User' : 'Service'),
        ...{ class: (msg.role) },
    }));
    const __VLS_54 = __VLS_53({
        icon: (msg.role === 'user' ? 'User' : 'Service'),
        ...{ class: (msg.role) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text" },
    });
    if (msg.role === 'assistant') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "answer-content" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "markdown-body" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formatMessage(msg.content)) }, null, null);
        if (msg.sources && msg.sources.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "references" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ref-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ref-tags" },
            });
            for (const [src, idx] of __VLS_getVForSourceType((msg.sources))) {
                const __VLS_56 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                    ...{ 'onClick': {} },
                    key: (idx),
                    ...{ class: "ref-item" },
                    size: "small",
                    effect: "plain",
                }));
                const __VLS_58 = __VLS_57({
                    ...{ 'onClick': {} },
                    key: (idx),
                    ...{ class: "ref-item" },
                    size: "small",
                    effect: "plain",
                }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                let __VLS_60;
                let __VLS_61;
                let __VLS_62;
                const __VLS_63 = {
                    onClick: (...[$event]) => {
                        if (!(msg.role === 'assistant'))
                            return;
                        if (!(msg.sources && msg.sources.length > 0))
                            return;
                        __VLS_ctx.handlePreviewChunk(src.chunkId);
                    }
                };
                __VLS_59.slots.default;
                (src.title || src.fileName);
                ((src.score * 100).toFixed(0));
                var __VLS_59;
            }
        }
        if (msg.qaLogId) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feedback-actions" },
            });
            const __VLS_64 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === true ? 'success' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }));
            const __VLS_66 = __VLS_65({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === true ? 'success' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            let __VLS_68;
            let __VLS_69;
            let __VLS_70;
            const __VLS_71 = {
                onClick: (...[$event]) => {
                    if (!(msg.role === 'assistant'))
                        return;
                    if (!(msg.qaLogId))
                        return;
                    __VLS_ctx.handleFeedback(msg, true);
                }
            };
            __VLS_67.slots.default;
            {
                const { icon: __VLS_thisSlot } = __VLS_67.slots;
                const __VLS_72 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
                const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
                __VLS_75.slots.default;
                const __VLS_76 = {}.CaretTop;
                /** @type {[typeof __VLS_components.CaretTop, ]} */ ;
                // @ts-ignore
                const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
                const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
                var __VLS_75;
            }
            var __VLS_67;
            const __VLS_80 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === false ? 'danger' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }));
            const __VLS_82 = __VLS_81({
                ...{ 'onClick': {} },
                type: (msg.feedbackGiven === false ? 'danger' : ''),
                size: "small",
                circle: true,
                disabled: (msg.feedbackGiven !== undefined),
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            let __VLS_84;
            let __VLS_85;
            let __VLS_86;
            const __VLS_87 = {
                onClick: (...[$event]) => {
                    if (!(msg.role === 'assistant'))
                        return;
                    if (!(msg.qaLogId))
                        return;
                    __VLS_ctx.handleFeedback(msg, false);
                }
            };
            __VLS_83.slots.default;
            {
                const { icon: __VLS_thisSlot } = __VLS_83.slots;
                const __VLS_88 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
                const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
                __VLS_91.slots.default;
                const __VLS_92 = {}.CaretBottom;
                /** @type {[typeof __VLS_components.CaretBottom, ]} */ ;
                // @ts-ignore
                const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
                const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
                var __VLS_91;
            }
            var __VLS_83;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "user-text" },
        });
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
    const __VLS_96 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        icon: "Service",
        ...{ class: "assistant" },
    }));
    const __VLS_98 = __VLS_97({
        icon: "Service",
        ...{ class: "assistant" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text typing" },
    });
}
if (__VLS_ctx.messages.length === 0 && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-welcome" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "welcome-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "suggested-questions" },
    });
    for (const [q, i] of __VLS_getVForSourceType((__VLS_ctx.suggestedQuestions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.messages.length === 0 && !__VLS_ctx.loading))
                        return;
                    __VLS_ctx.inputMessage = q;
                } },
            key: (i),
            ...{ class: "suggest-chip" },
        });
        (q);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-input-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-container" },
});
const __VLS_100 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.inputMessage),
    type: "textarea",
    autosize: ({ minRows: 1, maxRows: 6 }),
    placeholder: "发送消息...",
    resize: "none",
    ...{ class: "chat-textarea" },
}));
const __VLS_102 = __VLS_101({
    ...{ 'onKeydown': {} },
    modelValue: (__VLS_ctx.inputMessage),
    type: "textarea",
    autosize: ({ minRows: 1, maxRows: 6 }),
    placeholder: "发送消息...",
    resize: "none",
    ...{ class: "chat-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onKeydown: (__VLS_ctx.sendMessage)
};
var __VLS_103;
if (__VLS_ctx.inputMessage.trim() || __VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-actions" },
    });
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        type: "primary",
        circle: true,
        icon: "Top",
        ...{ class: "send-btn" },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        type: "primary",
        circle: true,
        icon: "Top",
        ...{ class: "send-btn" },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (__VLS_ctx.sendMessage)
    };
    var __VLS_111;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-hint" },
});
const __VLS_116 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.showPreview),
    title: (__VLS_ctx.currentChunk?.title || __VLS_ctx.currentChunk?.fileName),
    direction: "rtl",
    size: "450px",
    customClass: "preview-drawer",
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.showPreview),
    title: (__VLS_ctx.currentChunk?.title || __VLS_ctx.currentChunk?.fileName),
    direction: "rtl",
    size: "450px",
    customClass: "preview-drawer",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
if (__VLS_ctx.currentChunk) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fragment-text" },
    });
    (__VLS_ctx.currentChunk.content);
    const __VLS_120 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    const __VLS_124 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        column: (1),
        border: true,
    }));
    const __VLS_126 = __VLS_125({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        label: "所在页码",
    }));
    const __VLS_130 = __VLS_129({
        label: "所在页码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (__VLS_ctx.currentChunk.pageNumber);
    var __VLS_131;
    const __VLS_132 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "分片序号",
    }));
    const __VLS_134 = __VLS_133({
        label: "分片序号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.currentChunk.chunkIndex);
    var __VLS_135;
    const __VLS_136 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "起始字符",
    }));
    const __VLS_138 = __VLS_137({
        label: "起始字符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (__VLS_ctx.currentChunk.startOffset);
    var __VLS_139;
    const __VLS_140 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "结束字符",
    }));
    const __VLS_142 = __VLS_141({
        label: "结束字符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (__VLS_ctx.currentChunk.endOffset);
    var __VLS_143;
    var __VLS_127;
}
var __VLS_119;
const __VLS_144 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.feedbackDialog.visible),
    title: (__VLS_ctx.feedbackDialog.helpful ? '提交肯定反馈' : '提交反馈建议'),
    width: "450px",
    appendToBody: true,
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.feedbackDialog.visible),
    title: (__VLS_ctx.feedbackDialog.helpful ? '提交肯定反馈' : '提交反馈建议'),
    width: "450px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    model: (__VLS_ctx.feedbackDialog.form),
    labelPosition: "top",
}));
const __VLS_150 = __VLS_149({
    model: (__VLS_ctx.feedbackDialog.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "详细说明",
}));
const __VLS_154 = __VLS_153({
    label: "详细说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.feedbackDialog.form.comment),
    type: "textarea",
    rows: (4),
    placeholder: "请分享您的反馈，帮助我们做得更好...",
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.feedbackDialog.form.comment),
    type: "textarea",
    rows: (4),
    placeholder: "请分享您的反馈，帮助我们做得更好...",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
var __VLS_151;
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.feedbackDialog.visible = false;
        }
    };
    __VLS_163.slots.default;
    var __VLS_163;
    const __VLS_168 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.feedbackDialog.saving),
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.feedbackDialog.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (__VLS_ctx.submitFeedback)
    };
    __VLS_171.slots.default;
    var __VLS_171;
}
var __VLS_147;
/** @type {__VLS_StyleScopedClasses['qa-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
/** @type {__VLS_StyleScopedClasses['new-chat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['session-list-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['sessions-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-sessions']} */ ;
/** @type {__VLS_StyleScopedClasses['session-list']} */ ;
/** @type {__VLS_StyleScopedClasses['session-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['session-info']} */ ;
/** @type {__VLS_StyleScopedClasses['session-title']} */ ;
/** @type {__VLS_StyleScopedClasses['session-time']} */ ;
/** @type {__VLS_StyleScopedClasses['session-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-main']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-history']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['answer-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['references']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-item']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['user-text']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['assistant']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['typing']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-welcome']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-box']} */ ;
/** @type {__VLS_StyleScopedClasses['suggested-questions']} */ ;
/** @type {__VLS_StyleScopedClasses['suggest-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['input-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['input-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-body']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['fragment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChatDotRound: ChatDotRound,
            Delete: Delete,
            CaretTop: CaretTop,
            CaretBottom: CaretBottom,
            messages: messages,
            inputMessage: inputMessage,
            loading: loading,
            chatHistoryRef: chatHistoryRef,
            currentChunk: currentChunk,
            showPreview: showPreview,
            suggestedQuestions: suggestedQuestions,
            sessions: sessions,
            currentSessionId: currentSessionId,
            sessionsLoading: sessionsLoading,
            currentSessionTitle: currentSessionTitle,
            handleSelectSession: handleSelectSession,
            handleNewChat: handleNewChat,
            handleDeleteSession: handleDeleteSession,
            formatDate: formatDate,
            sendMessage: sendMessage,
            handlePreviewChunk: handlePreviewChunk,
            feedbackDialog: feedbackDialog,
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