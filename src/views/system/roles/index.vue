<template>
  <div class="role-container">
    <div class="page-header">
      <div>
        <div class="page-title">角色管理</div>
        <div class="page-subtitle">管理系统角色与权限分配，构建完整的 RBAC 权限模型</div>
      </div>
      <div class="page-actions">
        <el-button icon="Refresh" @click="loadData">刷新</el-button>
        <el-button type="primary" icon="Plus" @click="handleAdd">新增角色</el-button>
      </div>
    </div>

    <el-table :data="roles" v-loading="loading" style="width: 100%;" stripe border>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="角色名称" width="160">
        <template #default="{ row }">
          <div class="role-name-cell">
            <span>{{ row.name }}</span>
            <el-tag v-if="row.systemRole" type="warning" size="small" effect="plain">系统</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="权限" min-width="300">
        <template #default="{ row }">
          <div class="perm-tags">
            <el-tag
              v-for="p in row.permissions"
              :key="p"
              size="small"
              :color="getPermGroupColor(p)"
              style="color: #fff; border: none; margin: 2px;"
            >{{ getPermLabel(p) }}</el-tag>
            <span v-if="!row.permissions?.length" class="no-perm">暂无权限</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userCount" label="关联用户" width="100" align="center" />
      <el-table-column prop="documentCount" label="关联文档" width="100" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            link
            type="danger"
            size="small"
            :disabled="row.systemRole"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create / Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="680px"
      align-center
      @closed="resetForm"
    >
      <el-form :model="roleForm" :rules="formRules" ref="formRef" label-width="90px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
            maxlength="64"
            show-word-limit
            :disabled="editingSystemRole"
          />
          <div v-if="editingSystemRole" class="field-hint">系统内置角色不支持修改名称</div>
        </el-form-item>

        <el-form-item label="权限分配">
          <div class="perm-grid">
            <div
              v-for="group in permissionGroups"
              :key="group.key"
              class="perm-group-card"
              :style="{ '--group-accent': group.accent }"
            >
              <div class="perm-group-head">
                <span class="perm-group-dot" :style="{ background: group.accent }"></span>
                <span class="perm-group-label">{{ group.label }}</span>
                <el-checkbox
                  :model-value="isGroupAllChecked(group)"
                  :indeterminate="isGroupIndeterminate(group)"
                  @change="(val: boolean) => toggleGroup(group, val)"
                  class="perm-group-check-all"
                >全选</el-checkbox>
              </div>
              <div class="perm-group-body">
                <label
                  v-for="perm in group.permissions"
                  :key="perm.code"
                  class="perm-item"
                >
                  <el-checkbox
                    :model-value="roleForm.permissions.includes(perm.code)"
                    @change="(val: boolean) => togglePerm(perm.code, val)"
                  />
                  <div class="perm-item-info">
                    <span class="perm-item-label">{{ perm.label }}</span>
                    <span class="perm-item-desc">{{ perm.description }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveRole">确认保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { listRoles, createRole, updateRole, deleteRole } from '@/api/system/role'
import { permissionGroups, type PermissionOption } from '@/utils/rbac'
import type { RoleResponse, Permission } from '@/types/api'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const roles = ref<RoleResponse[]>([])
const editingSystemRole = ref(false)

const roleForm = reactive<{
  id: number | null
  name: string
  permissions: Permission[]
}>({
  id: null,
  name: '',
  permissions: [],
})

const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 64, message: '角色名称最多 64 个字符', trigger: 'blur' },
  ],
})

/* ---------- permission helpers ---------- */
const permMeta = new Map<string, { label: string; groupAccent: string }>()
permissionGroups.forEach((g) => {
  g.permissions.forEach((p) => {
    permMeta.set(p.code, { label: p.label, groupAccent: g.accent })
  })
})

const getPermLabel = (code: string) => permMeta.get(code)?.label || code
const getPermGroupColor = (code: string) => permMeta.get(code)?.groupAccent || '#909399'

const isGroupAllChecked = (group: typeof permissionGroups[0]) =>
  group.permissions.every((p) => roleForm.permissions.includes(p.code))

const isGroupIndeterminate = (group: typeof permissionGroups[0]) => {
  const checked = group.permissions.filter((p) => roleForm.permissions.includes(p.code)).length
  return checked > 0 && checked < group.permissions.length
}

const toggleGroup = (group: typeof permissionGroups[0], checked: boolean) => {
  const codes = group.permissions.map((p) => p.code)
  if (checked) {
    const set = new Set(roleForm.permissions)
    codes.forEach((c) => set.add(c))
    roleForm.permissions = [...set]
  } else {
    roleForm.permissions = roleForm.permissions.filter((p) => !codes.includes(p))
  }
}

const togglePerm = (code: Permission, checked: boolean) => {
  if (checked) {
    if (!roleForm.permissions.includes(code)) {
      roleForm.permissions.push(code)
    }
  } else {
    roleForm.permissions = roleForm.permissions.filter((p) => p !== code)
  }
}

/* ---------- data ---------- */
const loadData = async () => {
  loading.value = true
  try {
    const { data } = await listRoles()
    roles.value = data
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

/* ---------- CRUD ---------- */
const handleAdd = () => {
  dialogType.value = 'add'
  roleForm.id = null
  roleForm.name = ''
  roleForm.permissions = []
  editingSystemRole.value = false
  dialogVisible.value = true
}

const handleEdit = (row: RoleResponse) => {
  dialogType.value = 'edit'
  roleForm.id = row.id
  roleForm.name = row.name
  roleForm.permissions = [...(row.permissions || [])]
  editingSystemRole.value = row.systemRole
  dialogVisible.value = true
}

const handleDelete = (row: RoleResponse) => {
  if (row.systemRole) {
    ElMessage.warning('系统内置角色不允许删除')
    return
  }

  const warnings: string[] = []
  if (row.userCount > 0) warnings.push(`${row.userCount} 个用户`)
  if (row.documentCount > 0) warnings.push(`${row.documentCount} 篇文档`)

  const extra = warnings.length > 0
    ? `\n该角色仍关联 ${warnings.join('、')}，删除后相关关联将被清除。`
    : ''

  ElMessageBox.confirm(
    `确定要删除角色「${row.name}」吗？${extra}`,
    '删除确认',
    { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
  )
    .then(async () => {
      await deleteRole(row.id)
      ElMessage.success('角色已删除')
      loadData()
    })
    .catch(() => {})
}

const resetForm = () => {
  formRef.value?.resetFields()
  roleForm.id = null
  roleForm.name = ''
  roleForm.permissions = []
  editingSystemRole.value = false
}

const saveRole = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      if (dialogType.value === 'add') {
        await createRole({
          name: roleForm.name,
          permissions: roleForm.permissions,
        })
      } else {
        if (roleForm.id === null) return
        const payload: any = { permissions: roleForm.permissions }
        if (!editingSystemRole.value) {
          payload.name = roleForm.name
        }
        await updateRole(roleForm.id, payload)
      }
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData()
    } finally {
      saving.value = false
    }
  })
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN', { hour12: false })
}
</script>

<style scoped>
.role-container {
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

.page-actions {
  display: flex;
  gap: 10px;
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

.role-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.no-perm {
  color: #c0c4cc;
  font-size: 12px;
}

/* ----- Permission Dialog ----- */
.perm-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  width: 100%;
}

.perm-group-card {
  border-radius: 14px;
  border: 1px solid #e8edf5;
  overflow: hidden;
  background: #fafbfd;
  transition: box-shadow 0.2s;
}

.perm-group-card:hover {
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.perm-group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  border-bottom: 1px solid #eef2f7;
}

.perm-group-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.perm-group-label {
  font-size: 13px;
  font-weight: 600;
  color: #1f2a37;
  flex: 1;
}

.perm-group-check-all {
  font-size: 12px;
}

.perm-group-body {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.perm-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.perm-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.perm-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.perm-item-label {
  font-size: 13px;
  font-weight: 500;
  color: #1f2a37;
}

.perm-item-desc {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}

.field-hint {
  font-size: 12px;
  color: #e6a23c;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .perm-grid {
    grid-template-columns: 1fr;
  }
}
</style>

