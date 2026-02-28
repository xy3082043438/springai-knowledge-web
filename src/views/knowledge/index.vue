<template>
  <div class="knowledge-container">
    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文档..."
        prefix-icon="Search"
        style="width: 300px; margin-right: 10px;"
        @keyup.enter="handleSearch"
        clearable
        @clear="loadDocuments"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="primary" icon="Upload" @click="uploadVisible = true">上传文档</el-button>
      <el-button icon="Refresh" @click="loadDocuments">刷新</el-button>
      <el-button type="warning" @click="handleReindexAll">全部重索引</el-button>
    </div>

    <el-table :data="documents" v-loading="loading" style="width: 100%; margin-top: 20px;" border>
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
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="warning" size="small" @click="handleReindex(row)">重索引</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Upload Dialog -->
    <el-dialog v-model="uploadVisible" title="上传文档" width="550px">
      <el-form label-width="100px">
        <el-form-item label="文档标题">
          <el-input v-model="uploadForm.title" placeholder="可选，留空使用文件名" />
        </el-form-item>
        <el-form-item label="允许角色" required>
          <el-select v-model="uploadForm.allowedRoles" multiple placeholder="选择角色" style="width: 100%;">
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件" required>
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="() => ElMessage.warning('只能上传一个文件')"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持 PDF、Word、TXT 格式</div>
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
    <el-dialog v-model="editVisible" title="编辑文档" width="550px">
      <el-form :model="editForm" label-width="100px">
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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
import type { DocumentSummaryResponse, RoleResponse } from '@/types/api'

const searchQuery = ref('')
const loading = ref(false)
const documents = ref<DocumentSummaryResponse[]>([])
const roles = ref<RoleResponse[]>([])

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

onMounted(() => {
  loadDocuments()
  loadRoles()
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
  border-radius: 8px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
