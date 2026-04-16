<template>
  <div class="user-container">
    <div class="page-header">
      <div>
        <div class="page-title">用户管理</div>
        <div class="page-subtitle">管理系统账号与角色权限</div>
      </div>
      <div class="page-actions">
        <el-button type="primary" icon="Plus" @click="handleAdd">添加用户</el-button>
      </div>
    </div>

    <el-table :data="users" v-loading="loading" style="width: 100%;" stripe border>
      <el-table-column prop="username" label="用户名" min-width="180" />
      <el-table-column prop="role" label="角色" min-width="150">
        <template #default="{ row }">
          <el-tag :type="row.role?.toUpperCase() === 'ADMIN' ? 'danger' : 'info'" size="small">{{ row.role || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.enabled"
            @change="(val) => handleStatusChange(row, val as boolean)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="200">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="200">
        <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- User Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加用户' : '编辑用户'" width="500px">
      <el-form :model="userForm" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="点击选择对应角色..." clearable style="width: 100%;">
            <el-option v-for="role in roles" :key="role.name" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveUser">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { listUsers, createUser, updateUser, deleteUser } from '@/api/system/user'
import { listRoles } from '@/api/system/role'
import { formatDateTime } from '@/utils/date'
import type { UserResponse, RoleResponse } from '@/types/api'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const router = useRouter()

const users = ref<UserResponse[]>([])
const roles = ref<RoleResponse[]>([])

const userForm = reactive<{
  id: number | null
  username: string
  role: string
  password: string
}>({
  id: null,
  username: '',
  role: '',
  password: ''
})

const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 64, message: '长度 3-64', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '长度 6-100', trigger: 'blur' },
  ],
})

const loadData = async () => {
  loading.value = true
  try {
    const [userRes, roleRes] = await Promise.all([listUsers(), listRoles()])
    users.value = userRes.data
    roles.value = roleRes.data
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const handleAdd = () => {
  dialogType.value = 'add'
  userForm.id = null
  userForm.username = ''
  userForm.role = ''
  userForm.password = ''
  dialogVisible.value = true
}

const handleEdit = (row: UserResponse) => {
  dialogType.value = 'edit'
  userForm.id = row.id
  userForm.username = row.username
  userForm.role = row.role || ''
  userForm.password = ''
  dialogVisible.value = true
}

const formatDateLabel = (dateStr?: string) => {
  return formatDateTime(dateStr)
}

const saveUser = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      if (dialogType.value === 'add') {
        await createUser({
          username: userForm.username,
          password: userForm.password,
          role: userForm.role || undefined,
        })
      } else {
        if (userForm.id === null) return
        await updateUser(userForm.id, {
          username: userForm.username,
          role: userForm.role || undefined,
        })
      }
      dialogVisible.value = false
      ElMessage.success('提交成功！您的修改已保存。')
      loadData()
    } finally {
      saving.value = false
    }
  })
}

const handleDelete = (row: UserResponse) => {
  ElMessageBox.confirm(`您确定要彻底删除用户 "${row.username}" 吗？此操作无法撤销。`, '请确认删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除操作已成功完成。')
      loadData()
    } catch (e: any) {
      // 错误由拦截器统一处理
    }
  }).catch(() => {})
}

const handleStatusChange = async (row: UserResponse, val: boolean) => {
  try {
    await updateUser(row.id, { enabled: val })
    ElMessage.success(`用户 ${row.username} 状态已更新为 ${val ? '启用' : '停用'}`)
  } catch (e: any) {
    row.enabled = !val // revert
  }
}
</script>

<style scoped>
.user-container {
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
</style>

