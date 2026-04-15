<template>
  <div class="qa-container">
    <div class="chat-panel">
      <div class="chat-header">
        <div>
          <div class="chat-title">智能问答</div>
          <div class="chat-subtitle">基于企业知识库的检索增强问答</div>
        </div>
        <el-tag type="info">企业知识库</el-tag>
      </div>
      <div class="chat-history" ref="chatHistoryRef">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="message-content">
            <div class="avatar">
              <el-avatar :icon="msg.role === 'user' ? 'User' : 'Service'" :class="msg.role" />
            </div>
            <div class="text">
              <div v-if="msg.role === 'assistant'" class="answer-content">
                <div v-html="formatMessage(msg.content)"></div>
                <!-- 引证来源 -->
                <div v-if="msg.sources && msg.sources.length > 0" class="references">
                  <div class="ref-title">参考来源：</div>
                  <el-tag
                    v-for="(src, idx) in msg.sources"
                    :key="idx"
                    class="ref-item"
                    @click="handlePreviewChunk(src.chunkId)"
                  >
                    {{ src.title || src.fileName }} (相似度: {{ src.score?.toFixed(2) }})
                  </el-tag>
                </div>
                <!-- 反馈按钮 -->
                <div v-if="msg.qaLogId" class="feedback-actions">
                  <el-button
                    :type="msg.feedbackGiven === true ? 'success' : ''"
                    size="small"
                    circle
                    @click="handleFeedback(msg, true)"
                    :disabled="msg.feedbackGiven !== undefined"
                  >👍</el-button>
                  <el-button
                    :type="msg.feedbackGiven === false ? 'danger' : ''"
                    size="small"
                    circle
                    @click="handleFeedback(msg, false)"
                    :disabled="msg.feedbackGiven !== undefined"
                  >👎</el-button>
                </div>
              </div>
              <div v-else>{{ msg.content }}</div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="message assistant">
          <div class="message-content">
            <div class="avatar"><el-avatar icon="Service" class="assistant" /></div>
            <div class="text">思考中...</div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-wrap">
          <div class="input-box">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 5 }"
              placeholder="在此输入您的问题，系统将基于知识库为您解答（按 Enter 发送，Shift+Enter 换行）..."
              @keydown.enter.exact.prevent="sendMessage"
              resize="none"
            />
          </div>
          <el-button
            type="primary"
            class="send-btn"
            @click="sendMessage"
            :loading="loading"
          >发送</el-button>
        </div>
      </div>
    </div>

    <!-- 分片预览面板 -->
    <div class="preview-panel" v-if="currentChunk">
      <el-card class="preview-card">
        <template #header>
          <div class="preview-header">
            <span>文档预览: {{ currentChunk.title || currentChunk.fileName }}</span>
            <el-button link @click="currentChunk = null">关闭</el-button>
          </div>
        </template>
        <div class="preview-content">
          <p><strong>片段内容：</strong></p>
          <div class="fragment-text">{{ currentChunk.content }}</div>
          <el-divider />
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="页码">{{ currentChunk.pageNumber }}</el-descriptions-item>
            <el-descriptions-item label="分片序号">{{ currentChunk.chunkIndex }}</el-descriptions-item>
            <el-descriptions-item label="起始偏移">{{ currentChunk.startOffset }}</el-descriptions-item>
            <el-descriptions-item label="结束偏移">{{ currentChunk.endOffset }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>

    <!-- 反馈评论对话框 -->
    <el-dialog v-model="feedbackDialog.visible" :title="feedbackDialog.helpful ? '顶（有用）' : '踩（无用）'" width="400px">
      <el-form :model="feedbackDialog.form" label-position="top">
        <el-form-item label="详细建议 (可选)">
          <el-input
            v-model="feedbackDialog.form.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入您遇到的问题或者想要改进的地方..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="feedbackDialog.saving" @click="submitFeedback">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ask, askStream } from '@/api/business/qa'
import { createFeedback } from '@/api/business/feedback'
import { previewChunk } from '@/api/business/document'
import type { QaSourceResponse, DocumentChunkPreviewResponse } from '@/types/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: QaSourceResponse[]
  qaLogId?: number
  feedbackGiven?: boolean
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是你的 AI 助手，有什么可以帮助你的吗？'
  }
])

const inputMessage = ref('')
const loading = ref(false)
const chatHistoryRef = ref<HTMLElement | null>(null)
const currentChunk = ref<DocumentChunkPreviewResponse | null>(null)

const feedbackDialog = reactive({
  visible: false,
  saving: false,
  helpful: true,
  msg: null as Message | null,
  form: {
    comment: ''
  }
})

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

  await askStream(
    { question },
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
      scrollToBottom()
    },
    () => {
      loading.value = false
      scrollToBottom()
    },
    (err) => {
      if (loading.value) {
        // 如果出错还没流出任何文字
        loading.value = false
        messages.value.push({ role: 'assistant', content: '抱歉，网络或服务响应异常，请稍后重试。' })
      } else if (assistantMsgIndex >= 0) {
        messages.value[assistantMsgIndex].content += '\n\n*(网络连接已中断)*'
      }
      scrollToBottom()
    }
  )
}

const handlePreviewChunk = async (chunkId: number) => {
  try {
    const { data } = await previewChunk(chunkId)
    currentChunk.value = data
  } catch {
    ElMessage.error('抱歉，预览内容加载失败，请重试。')
  }
}

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
    ElMessage.success('感谢您的宝贵反馈！我们将持续改进。')
    feedbackDialog.visible = false
  } catch (err: any) {
    // captured in interceptor
  } finally {
    feedbackDialog.saving = false
  }
}

const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.qa-container {
  display: flex;
  height: calc(100vh - 80px);
  gap: 20px;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8edf5;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
  overflow: hidden;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff, #f6f9ff);
}

.chat-title {
  font-weight: 700;
  font-size: 16px;
}

.chat-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.chat-history {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f6f8fb;
}

.message { margin-bottom: 20px; }
.message-content { display: flex; gap: 10px; }
.message.user .message-content { flex-direction: row-reverse; }

.avatar .el-avatar { background-color: #409EFF; }
.avatar .el-avatar.assistant { background-color: #67C23A; }

.text {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 12px;
  max-width: 80%;
  line-height: 1.5;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.message.user .text { background-color: #e9f2ff; }

.chat-input {
  padding: 16px 20px;
  border-top: 1px solid #eef2f7;
  background-color: #fff;
}

.input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.input-box {
  flex: 1;
  min-height: 56px;
  display: flex;
  align-items: center;
  border: 1.5px solid #dce3ef;
  border-radius: 14px;
  background: #f8fafc;
  padding: 0 14px;
  transition: border-color 0.2s;
}

.input-box:focus-within {
  border-color: #409eff;
  background: #fff;
}

.input-box :deep(.el-textarea) {
  width: 100%;
}

.input-box :deep(.el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  background: transparent;
  padding: 0;
  font-size: 14px;
  resize: none;
  line-height: 1.6;
}

.send-btn {
  flex-shrink: 0;
  height: 56px;
  padding: 0 28px;
  font-size: 15px;
  border-radius: 12px;
}

.preview-panel { width: 400px; display: flex; flex-direction: column; }
.preview-card { height: 100%; overflow-y: auto; }
.preview-header { display: flex; justify-content: space-between; align-items: center; }

.references { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; }
.ref-title { font-size: 12px; color: #909399; margin-bottom: 5px; }
.ref-item { margin-right: 5px; margin-bottom: 5px; cursor: pointer; }
.fragment-text { background-color: #f9fafc; padding: 10px; border-radius: 4px; border: 1px solid #eaeefb; }

.feedback-actions { margin-top: 8px; display: flex; gap: 6px; }
</style>

