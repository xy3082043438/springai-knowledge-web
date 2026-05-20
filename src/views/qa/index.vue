<template>
  <div class="qa-container">
    <!-- 手机端侧栏遮罩 -->
    <div v-if="showSidebar" class="sidebar-backdrop" @click="showSidebar = false"></div>
    <!-- 会话侧边栏 -->
    <aside class="chat-sidebar" :class="{ 'mobile-open': showSidebar }">
      <div class="sidebar-header">
        <el-button type="primary" class="new-chat-btn" icon="Plus" @click="handleNewChat">开启新对话</el-button>
      </div>
      
      <el-scrollbar class="session-list-wrap">
        <div v-if="sessionsLoading" class="sessions-loading">
          <el-skeleton :rows="5" animated />
        </div>
        <div v-else-if="sessions.length === 0" class="empty-sessions">
          <el-empty description="暂无对话历史" :image-size="60" />
        </div>
        <ul v-else class="session-list">
          <li 
            v-for="session in sessions" 
            :key="session.id" 
            :class="['session-item', { active: currentSessionId === session.id }]"
            @click="handleSelectSession(session.id)"
          >
            <el-icon class="session-icon"><ChatDotRound /></el-icon>
            <div class="session-info">
              <span class="session-title">{{ session.title || '新对话' }}</span>
              <span class="session-time">{{ formatDate(session.updatedAt) }}</span>
            </div>
            <div class="session-actions" @click.stop>
              <el-popconfirm title="确定删除该会话吗？" @confirm="handleDeleteSession(session.id)">
                <template #reference>
                  <el-button link class="delete-btn"><el-icon><Delete /></el-icon></el-button>
                </template>
              </el-popconfirm>
            </div>
          </li>
        </ul>
      </el-scrollbar>


    </aside>

    <!-- 主聊天区 -->
    <div class="chat-main">
      <div class="chat-panel">
        <div class="chat-header">
          <el-button class="sidebar-toggle" :icon="Expand" circle @click="showSidebar = true" />
          <div>
            <div class="chat-title">知识增强对话检索 {{ currentSessionTitle ? `- ${currentSessionTitle}` : '' }}</div>
            <div class="chat-subtitle">基于 RAG (Retrieval-Augmented Generation) 架构的文档增强问答系统</div>
          </div>
          <div class="header-right">
            <el-tag type="info" class="brand-tag">企业知识库</el-tag>
          </div>
        </div>

        <div class="chat-history" ref="chatHistoryRef">
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
            <div class="message-content">
              <div class="avatar">
                <el-avatar :icon="msg.role === 'user' ? 'User' : 'Service'" :class="msg.role" />
              </div>
              <div class="text">
                <div v-if="msg.role === 'assistant'" class="answer-content">
                  <div class="markdown-body" v-html="formatMessage(msg.content)"></div>
                  <!-- 引证来源 -->
                  <div v-if="msg.sources && msg.sources.length > 0" class="references">
                    <div class="ref-title">参考来源：</div>
                    <div class="ref-tags">
                      <el-tag
                        v-for="(src, idx) in msg.sources"
                        :key="idx"
                        class="ref-item"
                        @click="handlePreviewChunk(src.chunkId)"
                        size="small"
                        effect="plain"
                      >
                        {{ src.title || src.fileName }} ({{ (src.score * 100).toFixed(0) }}%)
                      </el-tag>
                    </div>
                  </div>
                  <!-- 反馈按钮 -->
                  <div v-if="msg.qaLogId" class="feedback-actions">
                    <el-button
                      :type="msg.feedbackGiven === true ? 'success' : ''"
                      size="small"
                      circle
                      @click="handleFeedback(msg, true)"
                      :disabled="msg.feedbackGiven !== undefined"
                    >
                      <template #icon><el-icon><CaretTop /></el-icon></template>
                    </el-button>
                    <el-button
                      :type="msg.feedbackGiven === false ? 'danger' : ''"
                      size="small"
                      circle
                      @click="handleFeedback(msg, false)"
                      :disabled="msg.feedbackGiven !== undefined"
                    >
                      <template #icon><el-icon><CaretBottom /></el-icon></template>
                    </el-button>
                  </div>
                </div>
                <div v-else class="user-text">{{ msg.content }}</div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="message assistant">
            <div class="message-content">
              <div class="avatar"><el-avatar icon="Service" class="assistant" /></div>
              <div class="text typing">思考中...</div>
            </div>
          </div>
          <div v-if="messages.length === 0 && !loading" class="chat-welcome">
            <div class="welcome-box">
              <h3>基于专有知识库的智能对话终端</h3>
              <p>系统已接入您的私有知识库，支持自然语言提问与多维度的知识检索预览。</p>
              <div class="suggested-questions">
                <div 
                  v-for="(q, i) in suggestedQuestions" 
                  :key="i"
                  class="suggest-chip" 
                  @click="inputMessage = q"
                >
                  {{ q }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-container">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 6 }"
              placeholder="发送消息..."
              @keydown.enter.exact.prevent="sendMessage"
              resize="none"
              class="chat-textarea"
            />
            <div class="input-actions" v-if="inputMessage.trim() || loading">
               <el-button
                type="primary"
                circle
                icon="Top"
                class="send-btn"
                @click="sendMessage"
                :loading="loading"
              ></el-button>
            </div>
          </div>
          <div class="input-hint">Enter 发送，Shift + Enter 换行</div>
        </div>
      </div>

      <!-- 分片预览侧滑 -->
      <el-drawer
        v-model="showPreview"
        :title="currentChunk?.title || currentChunk?.fileName"
        direction="rtl"
        :size="isMobile ? '88%' : '450px'"
        custom-class="preview-drawer"
      >
        <div v-if="currentChunk" class="preview-body">
          <div class="preview-section">
            <h4>内容片段</h4>
            <div class="fragment-text">{{ currentChunk.content }}</div>
          </div>
          <el-divider />
          <div class="preview-section">
            <h4>元数据</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="所在页码">{{ currentChunk.pageNumber }}</el-descriptions-item>
              <el-descriptions-item label="分片序号">{{ currentChunk.chunkIndex }}</el-descriptions-item>
              <el-descriptions-item label="起始字符">{{ currentChunk.startOffset }}</el-descriptions-item>
              <el-descriptions-item label="结束字符">{{ currentChunk.endOffset }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-drawer>
    </div>

    <!-- 反馈对话框保持不变 -->
    <el-dialog v-model="feedbackDialog.visible" :title="feedbackDialog.helpful ? '提交肯定反馈' : '提交反馈建议'" width="450px" append-to-body>
      <el-form :model="feedbackDialog.form" label-position="top">
        <el-form-item label="详细说明">
          <el-input
            v-model="feedbackDialog.form.comment"
            type="textarea"
            :rows="4"
            placeholder="请分享您的反馈，帮助我们做得更好..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="feedbackDialog.saving" @click="submitFeedback">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatDotRound, Delete, Plus, Service, User, Top, CaretTop, CaretBottom, Expand } from '@element-plus/icons-vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { askStream, getSuggestions } from '@/api/business/qa'
import { createFeedback } from '@/api/business/feedback'
import { previewChunk } from '@/api/business/document'
import { listSessions, listSessionLogs, deleteSession, type ChatSession } from '@/api/business/session'
import { useUserStore } from '@/store/user'
import type { QaSourceResponse, DocumentChunkPreviewResponse, QaLogResponse } from '@/types/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: QaSourceResponse[]
  qaLogId?: number
  feedbackGiven?: boolean
}

const userStore = useUserStore()
const messages = ref<Message[]>([])
const { isMobile } = useBreakpoint()
const showSidebar = ref(false) // 手机端会话侧栏开合
const inputMessage = ref('')
const loading = ref(false)
const chatHistoryRef = ref<HTMLElement | null>(null)
const currentChunk = ref<DocumentChunkPreviewResponse | null>(null)
const showPreview = ref(false)
const suggestedQuestions = ref<string[]>([])

/* ── 会话状态 ── */
const sessions = ref<ChatSession[]>([])
const currentSessionId = ref<number | null>(null)
const sessionsLoading = ref(false)

/* 流控制 + 竞态守卫 */
const streamCtrl = ref<AbortController | null>(null)
let loadSessionSeq = 0

const abortCurrentStream = () => {
  streamCtrl.value?.abort()
  streamCtrl.value = null
}

onUnmounted(() => {
  abortCurrentStream()
})

const currentSessionTitle = computed(() => {
  return sessions.value.find(s => s.id === currentSessionId.value)?.title
})

/* ── 会话管理 ── */
const loadSessionsList = async () => {
  sessionsLoading.value = true
  try {
    const { data } = await listSessions()
    sessions.value = data
  } catch (err) {
    console.error('加载会话列表失败', err)
  } finally {
    sessionsLoading.value = false
  }
}

const handleSelectSession = async (sessionId: number) => {
  showSidebar.value = false
  if (currentSessionId.value === sessionId) return

  abortCurrentStream()
  const seq = ++loadSessionSeq

  currentSessionId.value = sessionId
  messages.value = []
  loading.value = true

  try {
    const { data } = await listSessionLogs(sessionId)
    // 竞态守卫: 若已切换到别的会话,丢弃本次结果
    if (seq !== loadSessionSeq || currentSessionId.value !== sessionId) return

    messages.value = data.map(log => [
      { role: 'user', content: log.question },
      {
        role: 'assistant',
        content: log.answer,
        qaLogId: log.id,
        sources: parseRetrievalSources(log.retrievalJson)
      }
    ]).flat() as Message[]

    await nextTick()
    scrollToBottom()
  } catch (err) {
    if (seq === loadSessionSeq) {
      ElMessage.error('加载历史记录失败')
    }
  } finally {
    if (seq === loadSessionSeq) {
      loading.value = false
    }
  }
}

const parseRetrievalSources = (json: string): QaSourceResponse[] | undefined => {
  try {
    if (!json) return undefined
    const parsed = JSON.parse(json)
    return parsed.sources
  } catch {
    return undefined
  }
}

const handleNewChat = () => {
  showSidebar.value = false
  currentSessionId.value = null
  messages.value = []
}

const handleDeleteSession = async (id: number) => {
  try {
    await deleteSession(id)
    if (currentSessionId.value === id) {
      handleNewChat()
    }
    loadSessionsList()
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

const formatDate = (iso: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    return date.toTimeString().slice(0, 5)
  }
  return `${date.getMonth() + 1}/${date.getDate()}`
}

/* ── 消息互动 ── */
const scrollToBottom = async () => {
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const question = inputMessage.value
  messages.value.push({ role: 'user', content: question })
  inputMessage.value = ''
  loading.value = true
  scrollToBottom()

  let assistantMsgIndex = -1

  abortCurrentStream()
  const controller = new AbortController()
  streamCtrl.value = controller

  await askStream(
    { question, sessionId: currentSessionId.value || undefined },
    (chunk) => {
      // 收到第一字时隐藏"思考中"加载态并建空消息框
      if (loading.value) {
        loading.value = false
        assistantMsgIndex = messages.value.length
        messages.value.push({ role: 'assistant', content: '' })
      }

      const targetMsg = messages.value[assistantMsgIndex]
      if (chunk.answer) targetMsg.content += chunk.answer
      if (chunk.qaLogId) targetMsg.qaLogId = chunk.qaLogId
      if (chunk.sources) targetMsg.sources = chunk.sources
      
      // 更新 Session ID (如果是新建的会话)
      if (chunk.sessionId && !currentSessionId.value) {
        currentSessionId.value = chunk.sessionId
        loadSessionsList() // 刷新列表以显示新标题
      }
      
      scrollToBottom()
    },
    () => {
      loading.value = false
      scrollToBottom()
    },
    (err: any) => {
      loading.value = false
      const errorMsg = err?.message || ''
      let displayMsg = '抱歉，网络或服务响应异常，请稍后重试。'
      
      if (errorMsg.includes('504') || errorMsg.includes('timeout')) {
        displayMsg = '大模型服务响应超时，请稍后再试。'
      }

      if (assistantMsgIndex >= 0) {
        messages.value[assistantMsgIndex].content += `\n\n*(错误: ${displayMsg})*`
      } else {
        messages.value.push({ role: 'assistant', content: displayMsg })
      }
      scrollToBottom()
    },
    controller.signal
  )

  if (streamCtrl.value === controller) {
    streamCtrl.value = null
  }
}

/* ── 引用预览 ── */
const handlePreviewChunk = async (chunkId: number) => {
  try {
    const { data } = await previewChunk(chunkId)
    currentChunk.value = data
    showPreview.value = true
  } catch {
    ElMessage.error('无法预览内容')
  }
}

/* ── 反馈逻辑 ── */
const feedbackDialog = reactive({
  visible: false,
  saving: false,
  helpful: true,
  msg: null as Message | null,
  form: {
    comment: ''
  }
})

const handleFeedback = (msg: Message, helpful: boolean) => {
  if (!msg.qaLogId) return
  feedbackDialog.msg = msg
  feedbackDialog.helpful = helpful
  feedbackDialog.form.comment = ''
  feedbackDialog.visible = true
}

const submitFeedback = async () => {
  if (!feedbackDialog.msg || !feedbackDialog.msg.qaLogId) return
  
  feedbackDialog.saving = true
  try {
    await createFeedback({
      qaLogId: feedbackDialog.msg.qaLogId,
      helpful: feedbackDialog.helpful,
      comment: feedbackDialog.form.comment || undefined
    })
    feedbackDialog.msg.feedbackGiven = feedbackDialog.helpful
    feedbackDialog.visible = false
    ElMessage.success('感谢反馈')
  } finally {
    feedbackDialog.saving = false
  }
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;')

const formatMessage = (content: string) => {
  if (!content) return ''
  return escapeHtml(content).replace(/\n/g, '<br>')
}

/* ── 初始加载 ── */
const fetchSuggestions = async () => {
  try {
    const { data } = await getSuggestions()
    if (data && data.length > 0) {
      suggestedQuestions.value = data
    }
  } catch (err) {
    console.warn('获取推荐问题失败', err)
  }
}

onMounted(() => {
  loadSessionsList()
  fetchSuggestions()
})
</script>

<style scoped>
.qa-container {
  display: flex;
  height: calc(100vh - 68px);
  width: calc(100% + 40px);
  margin: -20px;
  background-color: #f8fafc;
}

/* ── Sidebar ── */
.chat-sidebar {
  width: 280px;
  background: #fdfdfe;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
}

.new-chat-btn {
  width: 100%;
  height: 42px;
  font-weight: 500;
  border-radius: 10px;
}

.session-list-wrap {
  flex: 1;
}

.session-list {
  list-style: none;
  padding: 0 10px;
  margin: 10px 0;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  group: true;
}

.session-item:hover {
  background: rgba(64, 158, 255, 0.08);
}

.session-item.active {
  background: #eef6ff;
  border-left: 3px solid #409eff;
}

.session-icon {
  font-size: 18px;
  color: #909399;
  margin-right: 12px;
}

.session-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.session-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.session-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.session-item:hover .session-actions {
  opacity: 1;
}

.delete-btn {
  color: #f56c6c;
  font-size: 14px;
}

.sessions-loading, .empty-sessions {
  padding: 20px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #eef2f7;
}

.user-brief {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-brief .username {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

/* ── Main Chat ── */
.chat-main {
  flex: 1;
  display: flex;
  min-width: 0;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: none;
  overflow: hidden;
}

.chat-header {
  padding: 14px 24px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-title {
  font-weight: 700;
  font-size: 17px;
  color: #1a202c;
}

.chat-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.brand-tag {
  border-radius: 6px;
  font-weight: 500;
}

/* 会话侧栏触发按钮：仅手机端显示 */
.sidebar-toggle {
  display: none;
  margin-right: 12px;
}

.sidebar-backdrop {
  display: none;
}

.chat-history {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #fdfdfe;
}

.message {
  margin-bottom: 24px;
  max-width: 90%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  display: flex;
  gap: 14px;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
}

.avatar .el-avatar {
  background-color: #409eff;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.avatar .el-avatar.assistant {
  background-color: #10b981;
}

.text {
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 14.5px;
  line-height: 1.6;
  position: relative;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.message.assistant .text {
  background: #f8fafc;
  color: #1e293b;
  border-top-left-radius: 4px;
}

.message.user .text {
  background: #409eff;
  color: #fff;
  border-top-right-radius: 4px;
}

.typing:after {
  content: '...';
  animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
}

.references {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.ref-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}

.ref-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ref-item {
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.ref-item:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.feedback-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.chat-welcome {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-box {
  text-align: center;
  max-width: 400px;
}

.welcome-box h3 {
  font-size: 20px;
  color: #10233f;
  margin-bottom: 8px;
}

.welcome-box p {
  color: #64748b;
  margin-bottom: 24px;
}

.suggested-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggest-chip {
  padding: 10px 16px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 13.5px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.suggest-chip:hover {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}

/* ── Input Area ── */
.chat-input-area {
  padding: 20px 24px;
  background: #fff;
}

.input-container {
  display: flex;
  align-items: flex-end;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px;
  transition: all 0.3s;
}

.input-container:focus-within {
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.chat-textarea {
  flex: 1;
}

.chat-textarea :deep(.el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  font-size: 15px;
  padding: 8px 4px;
}

.input-actions {
  padding-bottom: 4px;
}

.send-btn {
  width: 36px;
  height: 36px;
  transition: all 0.2s;
}

.input-hint {
  margin-top: 8px;
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
}

.preview-body {
  padding: 0 4px;
}

.preview-section h4 {
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 12px;
}

.fragment-text {
  font-size: 14px;
  line-height: 1.8;
  color: #475569;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  white-space: pre-wrap;
}

@media (max-width: 900px) {
  .preview-panel { display: none; }

  /* 会话侧栏改为从左滑出的覆盖层 */
  .chat-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 80%;
    max-width: 300px;
    z-index: 2001;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(15, 23, 42, 0.18);
  }
  .chat-sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 2000;
  }

  .sidebar-toggle {
    display: inline-flex;
  }
}

@media (max-width: 768px) {
  /* app-main padding 在手机为 12px，修正容器出血量 */
  .qa-container {
    width: calc(100% + 24px);
    margin: -12px;
  }
  .chat-header {
    padding: 12px 14px;
  }
  .chat-title {
    font-size: 15px;
  }
  .chat-history {
    padding: 14px;
  }
  .message {
    max-width: 96%;
  }
}
</style>
