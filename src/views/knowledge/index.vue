<template>
  <div class="knowledge-container">
    <div class="page-header">
      <div>
        <div class="page-title">知识库管理</div>
        <div class="page-subtitle">上传、维护与索引企业文档，保障检索质量</div>
      </div>
      <div class="header-actions">
        <el-tag v-if="!canManageKnowledge" type="info" effect="plain">只读视图</el-tag>
        <el-input
          v-model="searchQuery"
          placeholder="输入关键词快速搜索文档..."
          prefix-icon="Search"
          style="width: 220px;"
          @keyup.enter="handleSearch"
          clearable
          @clear="loadDocuments"
        />
        <el-button @click="handleSearch">搜索</el-button>
        <el-button icon="Refresh" @click="loadDocuments">刷新</el-button>
        <el-button v-if="canManageKnowledge" type="success" @click="createVisible = true">文本录入</el-button>
        <el-button v-if="canManageKnowledge" type="primary" icon="Upload" @click="uploadVisible = true">上传文件</el-button>
        <el-button v-if="canManageKnowledge" type="warning" @click="handleReindexAll">全部重索引</el-button>
      </div>
    </div>

    <el-table :data="documents" v-loading="loading" style="width: 100%;" stripe border>
      <el-table-column prop="title" label="文档标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="文件名" width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ getFileNameLabel(row) }}
        </template>
      </el-table-column>
      <el-table-column prop="contentType" label="类型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ getContentTypeLabel(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="100">
        <template #default="{ row }">
          {{ formatSize(row.fileSize) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.status === 'FAILED' && row.errorMessage"
            :content="row.errorMessage"
            placement="top"
            effect="dark"
          >
            <el-tag :type="getStatusType(row.status)" style="cursor: help;">{{ getStatusLabel(row.status) }}</el-tag>
          </el-tooltip>
          <el-tag v-else :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="允许角色" width="160">
        <template #default="{ row }">
          <el-tag v-for="r in row.allowedRoles" :key="r" size="small" style="margin: 2px;">{{ r }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column v-if="canManageKnowledge" label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handlePreview(row)">预览</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="warning" size="small" @click="handleReindex(row)">重索引</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create Text Dialog -->
    <el-dialog v-model="createVisible" title="文本录入" width="620px" align-center @closed="resetCreateDialog">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="文档标题" required>
          <el-input v-model="createForm.title" maxlength="120" show-word-limit placeholder="请输入文档的主题或标题" />
        </el-form-item>
        <el-form-item label="允许角色">
          <el-select v-model="createForm.allowedRoles" multiple placeholder="请点击选择可见角色..." style="width: 100%;">
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="文档内容" required>
          <el-input
            v-model="createForm.content"
            type="textarea"
            :rows="12"
            maxlength="20000"
            show-word-limit
            placeholder="在此输入文本，它将被解析并作为知识库的参考来源..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="submitCreate">保存</el-button>
      </template>
    </el-dialog>

    <!-- Upload Dialog -->
    <el-dialog 
      v-model="uploadVisible" 
      title="上传文件" 
      width="540px" 
      align-center 
      @closed="resetUploadDialog"
      custom-class="premium-upload-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="header-icon"><Upload /></el-icon>
          <span class="header-title">上传新文档</span>
        </div>
      </template>

      <el-form label-width="80px" label-position="top" class="premium-form">
        <el-form-item label="文档标题">
          <el-input 
            v-model="uploadForm.title" 
            placeholder="留空则自动提取文件名" 
            class="premium-input"
          />
        </el-form-item>
        
        <el-form-item label="允许可见的角色">
          <el-select 
            v-model="uploadForm.allowedRoles" 
            multiple 
            collapse-tags
            collapse-tags-indicator
            placeholder="请选择授权可见的角色..." 
            style="width: 100%;"
            class="premium-select"
          >
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="选择源文件">
          <el-upload
            ref="uploadRef"
            :accept="supportedFileAccept"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :on-exceed="() => ElMessage.warning('抱歉，每次只能上传一个文件')"
            drag
            class="premium-upload-box"
          >
            <div class="upload-content">
              <div class="upload-icon-wrapper">
                <el-icon class="upload-main-icon"><UploadFilled /></el-icon>
              </div>
              <div class="upload-primary-text">将文件拖拽到此处，或 <span>点击上传</span></div>
              <div class="upload-secondary-text">建议文件大小不超过 20MB</div>
            </div>
          </el-upload>
          
          <div class="support-labels">
            <span class="support-title">支持格式：</span>
            <div class="format-tags">
              <el-tag v-for="ext in ['PDF', 'DOCX', 'XLSX', 'TXT', 'MD']" :key="ext" size="small" effect="plain" round class="format-tag">{{ ext }}</el-tag>
              <span class="more-formats">等 {{ supportedFileExtensions.length }} 种</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadVisible = false" class="btn-cancel">取消</el-button>
          <el-button 
            type="primary" 
            :loading="uploading" 
            @click="submitUpload"
            class="btn-submit"
          >
            立刻开始解析
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Edit Dialog -->
    <el-dialog v-model="editVisible" title="编辑文档" width="460px" align-center>
      <el-form :model="editForm" label-width="80px" label-position="left">
        <el-form-item label="文档标题">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="允许角色">
          <el-select v-model="editForm.allowedRoles" multiple style="width: 100%;">
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- Document Preview -->
    <DocumentPreview ref="previewRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Upload, Search, Refresh } from '@element-plus/icons-vue'
import type { UploadFile, UploadInstance } from 'element-plus'
import DocumentPreview from '@/components/DocumentPreview.vue'
import { formatDateTime } from '@/utils/date'
import {
  listDocuments,
  searchDocuments,
  createDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  reindexAll,
  reindexOne,
} from '@/api/business/document'
import { listRoles } from '@/api/system/role'
import { useUserStore } from '@/store/user'
import { isAdminRole } from '@/utils/access'
import type { DocumentSummaryResponse, RoleResponse } from '@/types/api'

const supportedFileExtensions = ['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'md', 'markdown', 'html', 'htm', 'csv']
const supportedFileAccept = supportedFileExtensions.map((ext) => `.${ext}`).join(',')
const supportedFileLabel = 'PDF、DOCX、PPTX、XLSX、TXT、MD、HTML、CSV'

const userStore = useUserStore()
const searchQuery = ref('')
const loading = ref(false)
const documents = ref<DocumentSummaryResponse[]>([])
const roles = ref<RoleResponse[]>([])
const canManageKnowledge = computed(() => isAdminRole(userStore.userInfo?.role))

// Create Text
const createVisible = ref(false)
const creating = ref(false)
const createForm = ref({ title: '', content: '', allowedRoles: [] as string[] })

// Upload
const uploadVisible = ref(false)
const uploading = ref(false)
const uploadRef = ref<UploadInstance>()
const selectedFile = ref<File | null>(null)
const uploadForm = ref({ title: '', allowedRoles: [] as string[] })

// Preview
const previewRef = ref()

// Edit
const editVisible = ref(false)
const editForm = ref({ id: 0, title: '', allowedRoles: [] as string[] })

const loadDocuments = async () => {
  loading.value = true
  try {
    const { data } = await listDocuments()
    documents.value = data
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const { data } = await listRoles()
    roles.value = data
  } catch { /* ignore */ }
}

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.ensureUserInfo()
    } catch {
      return
    }
  }

  await loadDocuments()

  if (canManageKnowledge.value) {
    loadRoles()
  }
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    loadDocuments()
    return
  }
  loading.value = true
  try {
    const { data } = await searchDocuments({ query: searchQuery.value })
    documents.value = data
  } finally {
    loading.value = false
  }
}

const resetCreateDialog = () => {
  createForm.value = { title: '', content: '', allowedRoles: [] }
}

const submitCreate = async () => {
  const title = createForm.value.title.trim()
  const content = createForm.value.content

  if (!title) {
    ElMessage.warning('文档标题为必填项，请补充完善')
    return
  }
  if (!content.trim()) {
    ElMessage.warning('文档内容不能为空，请填写要录入的文本')
    return
  }
  if (createForm.value.allowedRoles.length === 0) {
    ElMessage.warning('请至少选择一个允许访问该文档的角色')
    return
  }

  creating.value = true
  try {
    await createDocument({
      title,
      content,
      allowedRoles: createForm.value.allowedRoles,
    })
    ElMessage.success('文档创建成功，系统已开始处理')
    createVisible.value = false
    resetCreateDialog()
    loadDocuments()
  } finally {
    creating.value = false
  }
}

const getFileExtension = (fileName?: string) => {
  if (!fileName) return ''
  const index = fileName.lastIndexOf('.')
  return index >= 0 ? fileName.slice(index + 1).toLowerCase() : ''
}

const isSupportedFile = (file: File) => supportedFileExtensions.includes(getFileExtension(file.name))

const resetUploadDialog = () => {
  uploadForm.value = { title: '', allowedRoles: [] }
  selectedFile.value = null
  uploadRef.value?.clearFiles()
}

const handleFileChange = (file: UploadFile) => {
  const rawFile = file.raw || null
  if (!rawFile) {
    selectedFile.value = null
    return
  }
  if (!isSupportedFile(rawFile)) {
    selectedFile.value = null
    ElMessage.error(`格式不支持，请上传 ${supportedFileLabel} 类型的文件。`)
    uploadRef.value?.clearFiles()
    return
  }
  selectedFile.value = rawFile
}

const handleFileRemove = () => {
  selectedFile.value = null
}

const submitUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('您还未选择文件，请上传后再提交。')
    return
  }
  if (!isSupportedFile(selectedFile.value)) {
    ElMessage.warning(`格式不支持，请上传 ${supportedFileLabel} 类型的文件。`)
    return
  }
  if (uploadForm.value.allowedRoles.length === 0) {
    ElMessage.warning('请至少选择一个允许访问该文档的角色。')
    return
  }
  uploading.value = true
  try {
    await uploadDocument(
      selectedFile.value,
      uploadForm.value.allowedRoles,
      uploadForm.value.title || undefined,
    )
    ElMessage.success('文件上传成功，系统正在解析处理中。')
    uploadVisible.value = false
    resetUploadDialog()
    loadDocuments()
  } finally {
    uploading.value = false
  }
}

const handlePreview = (row: DocumentSummaryResponse) => {
  previewRef.value?.open(row.id)
}

const handleEdit = (row: DocumentSummaryResponse) => {
  editForm.value = {
    id: row.id,
    title: row.title || '',
    allowedRoles: [...(row.allowedRoles || [])],
  }
  editVisible.value = true
}

const submitEdit = async () => {
  try {
    await updateDocument(editForm.value.id, {
      title: editForm.value.title,
      allowedRoles: editForm.value.allowedRoles,
    })
    ElMessage.success('提交成功！您的修改已保存。')
    editVisible.value = false
    loadDocuments()
  } catch { /* interceptor */ }
}

const handleDelete = (row: DocumentSummaryResponse) => {
  ElMessageBox.confirm(`您确定要彻底删除文档 "${row.title || row.fileName}" 吗？此操作无法撤销，所有相关记忆和切片也将被清除。`, '请确认删除', { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' })
    .then(async () => {
      await deleteDocument(row.id)
      ElMessage.success('删除操作已成功完成。')
      loadDocuments()
    })
    .catch(() => {})
}

const handleReindex = async (row: DocumentSummaryResponse) => {
  try {
    const { data } = await reindexOne(row.id)
    ElMessage.success(`切片重新构建完成：成功 ${data.success} 条，失败 ${data.failed} 条。`)
    loadDocuments()
  } catch { /* interceptor */ }
}

const handleReindexAll = async () => {
  try {
    const { data } = await reindexAll()
    ElMessage.success(`全局构建任务已完成：共扫描 ${data.total} 篇文档，成功 ${data.success} 篇，失败 ${data.failed} 篇。`)
    loadDocuments()
  } catch { /* interceptor */ }
}


const getFileNameLabel = (row: DocumentSummaryResponse) => row.fileName || '文本录入'

const getContentTypeLabel = (row: DocumentSummaryResponse) => {
  if (row.contentType) return row.contentType
  if (!row.fileName) return 'TEXT'
  const extension = getFileExtension(row.fileName)
  return extension ? extension.toUpperCase() : '-'
}

  switch (status) {
    case 'READY': return 'success'
    case 'UPLOADED': return 'info'
    case 'PARSING': return 'warning'
    case 'FAILED': return 'danger'
    default: return 'info'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'READY': return '已索引'
    case 'UPLOADED': return '待解析'
    case 'PARSING': return '解析中'
    case 'FAILED': return '失败'
    default: return status
  }
}

const formatSize = (bytes: number | null) => {
  if (bytes == null) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}
</script>

<style scoped>
.knowledge-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid #e8edf5;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* Premium Upload Dialog Styles */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 22px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 8px;
  border-radius: 10px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.premium-form {
  padding: 10px 4px;
}

:deep(.premium-form .el-form-item__label) {
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px !important;
  line-height: 1;
}

.premium-input :deep(.el-input__wrapper),
.premium-select :deep(.el-select__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  padding: 4px 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-input :deep(.el-input__wrapper.is-focus),
.premium-select :deep(.el-select__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset, 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
}

.premium-upload-box {
  width: 100%;
}

:deep(.premium-upload-box .el-upload-dragger) {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background-color: #f8fafc;
  transition: all 0.4s ease;
  padding: 30px 20px;
}

:deep(.premium-upload-box .el-upload-dragger:hover) {
  border-color: #3b82f6;
  background-color: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.1);
}

.upload-icon-wrapper {
  margin-bottom: 16px;
}

.upload-main-icon {
  font-size: 48px;
  color: #64748b;
  transition: all 0.4s ease;
}

:deep(.el-upload-dragger:hover) .upload-main-icon {
  color: #3b82f6;
  transform: scale(1.1);
}

.upload-primary-text {
  font-size: 15px;
  color: #334155;
  font-weight: 500;
  margin-bottom: 6px;
}

.upload-primary-text span {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.upload-secondary-text {
  font-size: 13px;
  color: #94a3b8;
}

.support-labels {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.support-title {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.format-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.format-tag {
  background: white;
  border-color: #e2e8f0;
  color: #64748b;
  font-weight: 600;
}

.more-formats {
  font-size: 12px;
  color: #94a3b8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
}

.btn-cancel {
  border-radius: 10px;
  padding: 10px 20px;
  height: 40px;
  font-weight: 500;
  border-color: #e2e8f0;
}

.btn-submit {
  border-radius: 10px;
  padding: 10px 24px;
  height: 40px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  opacity: 0.9;
}

.btn-submit:active {
  transform: translateY(0);
}
</style>

