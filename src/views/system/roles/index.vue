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
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
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
            placeholder="请输入角色名称（例如：普通用户）..."
            maxlength="64"
            show-word-limit
            :disabled="editingSystemRole"
          />
          <div v-if="editingSystemRole" class="field-hint">提示：系统内置角色受到保护，不支持修改名称</div>
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
                <div class="perm-group-title">
                  <el-icon class="group-icon" :style="{ color: group.accent }">
                    <component :is="group.icon" />
                  </el-icon>
                  <span class="perm-group-label">{{ group.label }}</span>
                </div>
                <el-checkbox
                  :model-value="isGroupAllChecked(group)"
                  :indeterminate="isGroupIndeterminate(group)"
                  @change="(val: boolean) => toggleGroup(group, val)"
                  class="perm-group-check-all"
                >全选</el-checkbox>
              </div>
              <div class="perm-group-body">
                <div
                  v-for="perm in group.permissions"
                  :key="perm.code"
                  class="perm-compact-item"
                  :class="{ active: roleForm.permissions.includes(perm.code) }"
                  @click="togglePerm(perm.code, !roleForm.permissions.includes(perm.code))"
                >
                  <el-checkbox
                    :model-value="roleForm.permissions.includes(perm.code)"
                    @click.stop
                    @change="(val: boolean) => togglePerm(perm.code, val)"
                  />
                  <el-tooltip :content="perm.description" placement="top" :show-after="500">
                    <span class="perm-item-label">{{ perm.label }}</span>
                  </el-tooltip>
                </div>
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
import { formatDateTime } from '@/utils/date'
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
    ElMessage.warning('抱歉，系统内置角色受到保护，无法进行删除操作。')
    return
  }

  const warnings: string[] = []
  if (row.userCount > 0) warnings.push(`${row.userCount} 个用户`)
  if (row.documentCount > 0) warnings.push(`${row.documentCount} 篇文档`)

  const extra = warnings.length > 0
    ? `\n该角色仍关联 ${warnings.join('、')}，删除后相关关联将被清除。`
    : ''

  ElMessageBox.confirm(
    `您确定要彻底删除角色「${row.name}」吗？操作不可逆。${extra}`,
    '请确认删除',
    { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
  )
    .then(async () => {
      await deleteRole(row.id)
      ElMessage.success('删除操作已成功完成。')
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
      ElMessage.success('提交成功！您的修改已保存。')
      dialogVisible.value = false
      loadData()
    } finally {
      saving.value = false
    }
  })
}

// Local redundant function removed.
</script>

<style scoped>
.role-container {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f2f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 13px;
  color: #8c8c8c;
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
  gap: 4px;
}

.no-perm {
  color: #bfbfbf;
  font-size: 12px;
  font-style: italic;
}

/* ----- Permission Dialog Redesign ----- */
.perm-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.perm-group-card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.perm-group-card:hover {
  border-color: var(--group-accent);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.perm-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  border-top: 3px solid var(--group-accent);
}

.perm-group-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  font-size: 18px;
}

.perm-group-label {
  font-size: 14px;
  font-weight: 700;
  color: #262626;
}

.perm-group-check-all {
  margin: 0;
  height: auto;
}

.perm-group-body {
  padding: 8px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.perm-compact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f0f0f0;
  background: #fafafa;
}

.perm-compact-item:hover {
  background: #f0f0f0;
  border-color: var(--group-accent);
}

.perm-compact-item.active {
  background: color-mix(in srgb, var(--group-accent), transparent 92%);
  border-color: var(--group-accent);
  color: var(--group-accent);
}

.perm-item-label {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  white-space: nowrap;
}

.field-hint {
  font-size: 12px;
  color: #faad14;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 640px) {
  .perm-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .perm-grid {
    grid-template-columns: 1fr;
  }
}
</style>

