<template>
  <div class="system-config-container">
    <div class="page-header">
      <div>
        <div class="page-title">系统配置</div>
        <div class="page-subtitle">统一管理系统参数与运行状态</div>
      </div>
      <el-button type="primary" icon="Refresh" @click="handleRefresh">刷新全局配置</el-button>
    </div>

    <el-table :data="configs" v-loading="loading" style="width: 100%;" border>
      <el-table-column prop="key" label="配置键" width="250" />
      <el-table-column prop="value" label="配置值" min-width="300">
        <template #default="{ row }">
          <el-input
            v-if="editingKey === row.key"
            v-model="editValue"
            type="textarea"
            :rows="2"
          />
          <span v-else style="white-space: pre-wrap;">{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="250" show-overflow-tooltip />
      <el-table-column prop="updatedAt" label="更新时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <template v-if="editingKey === row.key">
            <el-button link type="success" size="small" @click="saveConfig(row.key)">保存</el-button>
            <el-button link size="small" @click="cancelEdit">取消</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" size="small" @click="startEdit(row)">编辑</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listConfigs, upsertConfig, refreshConfig } from '@/api/system/config'
import type { SystemConfigResponse } from '@/types/api'

const loading = ref(false)
const configs = ref<SystemConfigResponse[]>([])
const editingKey = ref<string | null>(null)
const editValue = ref('')
const editDescription = ref('')

const HIDDEN_KEYS = new Set([
  'chunk.size',
  'chunk.overlap',
  'chunk.embeddingSafeSize',
  'hybrid.vectorTopK',
  'hybrid.keywordTopK',
  'hybrid.vectorSimilarityThreshold',
  'hybrid.vectorWeight',
  'hybrid.keywordWeight',
  'rag.maxOutputTokens',
  'rag.temperature',
  'rag.topP',
  'keyword.tsConfig',
  'system.boundary',
])

const loadConfigs = async () => {
  loading.value = true
  try {
    const { data } = await listConfigs()
    configs.value = data.filter(c => !HIDDEN_KEYS.has(c.key))
  } finally {
    loading.value = false
  }
}

onMounted(loadConfigs)

const startEdit = (row: SystemConfigResponse) => {
  editingKey.value = row.key
  editValue.value = row.value
  editDescription.value = row.description || ''
}

const cancelEdit = () => {
  editingKey.value = null
  editValue.value = ''
}

const saveConfig = async (key: string) => {
  if (!editValue.value.trim()) {
    ElMessage.warning('配置值不能为空')
    return
  }
  try {
    await upsertConfig(key, {
      value: editValue.value,
      description: editDescription.value || undefined,
    })
    ElMessage.success('保存成功')
    editingKey.value = null
    loadConfigs()
  } catch { /* interceptor */ }
}

const handleRefresh = async () => {
  try {
    await refreshConfig()
    ElMessage.success('全局配置已刷新')
    loadConfigs()
  } catch { /* interceptor */ }
}
</script>

<style scoped>
.system-config-container {
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

