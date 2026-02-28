<template>
  <div class="qa-container">
    <div class="chat-panel">
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
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="基于知识库提问..."
          @keydown.enter.exact.prevent="sendMessage"
        />
        <div class="input-actions">
          <el-button type="primary" @click="sendMessage" :loading="loading">发送</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ask } from '@/api/qa'
import { createFeedback } from '@/api/feedback'
import { previewChunk } from '@/api/document'
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

  try {
    const { data } = await ask({ question })
    messages.value.push({
      role: 'assistant',
      content: data.answer,
      sources: data.sources,
      qaLogId: data.qaLogId,
    })
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，请求失败，请稍后重试。',
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const handlePreviewChunk = async (chunkId: number) => {
  try {
    const { data } = await previewChunk(chunkId)
    currentChunk.value = data
  } catch {
    ElMessage.error('预览加载失败')
  }
}

const handleFeedback = async (msg: Message, helpful: boolean) => {
  if (!msg.qaLogId) return
  try {
    await createFeedback({ qaLogId: msg.qaLogId, helpful })
    msg.feedbackGiven = helpful
    ElMessage.success('感谢反馈！')
  } catch {
    // handled by interceptor
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
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-history {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.message { margin-bottom: 20px; }
.message-content { display: flex; gap: 10px; }
.message.user .message-content { flex-direction: row-reverse; }

.avatar .el-avatar { background-color: #409EFF; }
.avatar .el-avatar.assistant { background-color: #67C23A; }

.text {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message.user .text { background-color: #d9ecff; }

.chat-input {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  background-color: #fff;
}

.input-actions { margin-top: 10px; text-align: right; }

.preview-panel { width: 400px; display: flex; flex-direction: column; }
.preview-card { height: 100%; overflow-y: auto; }
.preview-header { display: flex; justify-content: space-between; align-items: center; }

.references { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; }
.ref-title { font-size: 12px; color: #909399; margin-bottom: 5px; }
.ref-item { margin-right: 5px; margin-bottom: 5px; cursor: pointer; }
.fragment-text { background-color: #f9fafc; padding: 10px; border-radius: 4px; border: 1px solid #eaeefb; }

.feedback-actions { margin-top: 8px; display: flex; gap: 6px; }
</style>
