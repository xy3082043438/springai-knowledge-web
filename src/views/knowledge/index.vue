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
          placeholder="搜索文档..."
          prefix-icon="Search"
          style="width: 220px;"
          @keyup.enter="handleSearch"
          clearable
          @clear="loadDocuments"
        />
        <el-button @click="handleSearch">搜索</el-button>
        <el-button icon="Refresh" @click="loadDocuments">刷新</el-button>
        <el-button v-if="canManageKnowledge" type="primary" icon="Upload" @click="uploadVisible = true">上传文档</el-button>
        <el-button v-if="canManageKnowledge" type="warning" @click="handleReindexAll">全部重索引</el-button>
      </div>
    </div>

    <el-table :data="documents" v-loading="loading" style="width: 100%;" stripe border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="文档标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="fileName" label="文件名" width="200" show-overflow-tooltip />
      <el-table-column prop="contentType" label="类型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ row.contentType || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="100">
        <template #default="{ row }">
          {{ formatSize(row.fileSize) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="允许角色" width="160">
        <template #default="{ row }">
          <el-tag v-for="r in row.allowedRoles" :key="r" size="small" style="margin: 2px;">{{ r }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column v-if="canManageKnowledge" label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="warning" size="small" @click="handleReindex(row)">重索引</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Upload Dialog -->
    <el-dialog v-model="uploadVisible" title="上传文档" width="500px" align-center>
      <el-form label-width="80px" label-position="left">
        <el-form-item label="文档标题">
          <el-input v-model="uploadForm.title" placeholder="可选，留空使用文件名" />
        </el-form-item>
        <el-form-item label="允许角色">
          <el-select v-model="uploadForm.allowedRoles" multiple placeholder="请选择角色" style="width: 100%;">
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="() => ElMessage.warning('只能上传一个文件')"
            drag
            style="width: 100%;"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽文件到此处，或 <em>点击选择</em></div>
            <template #tip>
              <div class="el-upload__tip">仅支持 PDF、TXT 格式，单次限 1 个文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="submitUpload">确认上传</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import {
  listDocuments,
  searchDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  reindexAll,
  reindexOne,
} from '@/api/document'
import { listRoles } from '@/api/role'
import { useUserStore } from '@/store/user'
import { isAdminRole } from '@/utils/access'
import type { DocumentSummaryResponse, RoleResponse } from '@/types/api'

const userStore = useUserStore()
const searchQuery = ref('')
const loading = ref(false)
const documents = ref<DocumentSummaryResponse[]>([])
const roles = ref<RoleResponse[]>([])
const canManageKnowledge = computed(() => isAdminRole(userStore.userInfo?.role))

// Upload
const uploadVisible = ref(false)
const uploading = ref(false)
const uploadRef = ref()
const selectedFile = ref<File | null>(null)
const uploadForm = ref({ title: '', allowedRoles: [] as string[] })

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

const handleFileChange = (file: UploadFile) => {
  selectedFile.value = file.raw || null
}

const submitUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  if (uploadForm.value.allowedRoles.length === 0) {
    ElMessage.warning('请选择至少一个允许角色')
    return
  }
  uploading.value = true
  try {
    await uploadDocument(
      selectedFile.value,
      uploadForm.value.allowedRoles,
      uploadForm.value.title || undefined,
    )
    ElMessage.success('上传成功')
    uploadVisible.value = false
    uploadForm.value = { title: '', allowedRoles: [] }
    selectedFile.value = null
    loadDocuments()
  } finally {
    uploading.value = false
  }
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
    ElMessage.success('保存成功')
    editVisible.value = false
    loadDocuments()
  } catch { /* interceptor */ }
}

const handleDelete = (row: DocumentSummaryResponse) => {
  ElMessageBox.confirm(`确定要删除 "${row.title || row.fileName}" 吗？`, '警告', { type: 'warning' })
    .then(async () => {
      await deleteDocument(row.id)
      ElMessage.success('删除成功')
      loadDocuments()
    })
    .catch(() => {})
}

const handleReindex = async (row: DocumentSummaryResponse) => {
  try {
    const { data } = await reindexOne(row.id)
    ElMessage.success(`重索引完成：成功 ${data.success}，失败 ${data.failed}`)
    loadDocuments()
  } catch { /* interceptor */ }
}

const handleReindexAll = async () => {
  try {
    const { data } = await reindexAll()
    ElMessage.success(`全部重索引：共 ${data.total}，成功 ${data.success}，失败 ${data.failed}`)
    loadDocuments()
  } catch { /* interceptor */ }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN', { hour12: false })
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'READY': return 'success'
    case 'UPLOADED': return 'warning'
    case 'FAILED': return 'danger'
    default: return 'info'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'READY': return '已索引'
    case 'UPLOADED': return '已上传'
    case 'FAILED': return '失败'
    default: return status
  }
}

const formatSize = (bytes: number | null) => {
  if (!bytes) return '-'
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
</style>
