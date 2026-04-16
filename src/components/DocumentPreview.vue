<template>
  <el-dialog
    v-model="visible"
    :title="`文档预览 - ${docTitle}`"
    width="85%"
    destroy-on-close
    class="preview-dialog"
    :show-close="true"
    align-center
    header-class="preview-header"
    style="height: 88vh; display: flex; flex-direction: column;"
  >
    <div v-loading="loading" class="preview-content-container">
      <!-- PDF Preview -->
      <template v-if="isPreviewablePdf">
        <embed
          v-if="fileBlobUrl"
          :src="`${fileBlobUrl}#view=FitH`"
          type="application/pdf"
          class="pdf-viewer"
        />
      </template>

      <!-- Text/Markdown Preview -->
      <template v-else>
        <div class="text-preview">
          <div v-if="docContent" class="content-wrapper">
             <pre class="pure-text">{{ docContent }}</pre>
          </div>
          <el-empty v-else description="暂无预览内容" />
        </div>
      </template>
    </div>
    
    <template #footer>
      <div class="preview-footer">
        <el-tag size="small" type="info">{{ contentType }}</el-tag>
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :icon="Download" @click="handleDownload">下载原文件</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { getDocument, getDocumentFile } from '@/api/business/document'
import { Download } from '@element-plus/icons-vue'

const visible = ref(false)
const loading = ref(false)
const docTitle = ref('')
const docContent = ref('')
const contentType = ref('')
const fileBlobUrl = ref<string | null>(null)
let currentDocId: number | null = null

const isPreviewablePdf = computed(() => {
  return contentType.value === 'application/pdf'
})

const open = async (id: number) => {
  currentDocId = id
  visible.value = true
  loading.value = true
  
  // Clear previous blob
  clearBlobUrl()

  try {
    // 1. Get document details (for content text)
    const { data: doc } = await getDocument(id)
    docTitle.value = doc.title || doc.fileName || '未知文档'
    docContent.value = doc.content || ''
    contentType.value = doc.contentType || ''

    // 2. If PDF, fetch the binary file for iframe preview
    if (isPreviewablePdf.value) {
      const resp = await getDocumentFile(id)
      const blob = (resp as any).data || resp
      fileBlobUrl.value = URL.createObjectURL(blob as any)
    }
  } catch (error) {
    console.error('Failed to load preview:', error)
  } finally {
    loading.value = false
  }
}

const clearBlobUrl = () => {
  if (fileBlobUrl.value) {
    URL.revokeObjectURL(fileBlobUrl.value)
    fileBlobUrl.value = null
  }
}

const handleDownload = async () => {
  if (!currentDocId) return
  try {
    const blob = await getDocumentFile(currentDocId)
    const url = URL.createObjectURL(blob as any)
    const link = document.createElement('a')
    link.href = url
    link.download = docTitle.value
    link.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Download failed:', e)
  }
}

onBeforeUnmount(() => {
  clearBlobUrl()
})

defineExpose({ open })
</script>

<style scoped>
.preview-dialog :deep(.el-dialog__body) {
  padding: 0;
  flex: 1;
  overflow: hidden;
  background-color: #f1f5f9;
  position: relative; /* 为绝对定位提供参考 */
}

.preview-content-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.text-preview {
  padding: 40px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  background: white;
  padding: 50px 60px;
  border-radius: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  min-height: 100%;
  width: 100%;
  max-width: 1000px;
}

.pure-text {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #1e293b;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
