<template>
  <div class="profile-container">
    <el-row :gutter="24">
      <!-- 左侧：用户基本信息卡片 -->
      <el-col :span="8" :xs="24">
        <el-card shadow="hover" class="user-profile-card" :body-style="{ padding: '0px' }">
          <div class="card-header-bg">
            <div class="actions">
              <el-button color="#ffffff20" class="action-btn" size="small" @click="showPasswordDialog = true" plain>
                修改密码
              </el-button>
            </div>
          </div>
          <div class="profile-avatar-group">
            <div class="avatar-wrapper" @click="showAvatarDialog = true">
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-img" />
              <div v-else class="avatar">{{ avatarChar }}</div>
              <div class="avatar-mask"><el-icon><Edit /></el-icon></div>
            </div>
            <h2 class="username">{{ userInfo?.username }}</h2>
            <div class="role-tag">
              <el-tag :type="userInfo?.role === 'ADMIN' ? 'danger' : 'primary'" effect="dark" round>
                {{ userInfo?.role }}
              </el-tag>
            </div>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-value">1</div>
              <div class="stat-label">关联角色</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">正常</div>
              <div class="stat-label">账号状态</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：账户详细资料 -->
      <el-col :span="16" :xs="24">
        <el-card shadow="hover" class="user-detail-card">
          <template #header>
            <div class="detail-header">
              <span class="title">账户详细资料</span>
            </div>
          </template>
          
          <div class="detail-content">
            <el-descriptions :column="1" border size="large">
              <el-descriptions-item>
                <template #label>
                  <div class="desc-label">
                    <el-icon><User /></el-icon>
                    登录账号
                  </div>
                </template>
                <span class="desc-value">{{ userInfo?.username }}</span>
              </el-descriptions-item>
              
              <el-descriptions-item>
                <template #label>
                  <div class="desc-label">
                    <el-icon><Calendar /></el-icon>
                    注册时间
                  </div>
                </template>
                <span class="desc-value">{{ formatDateTime(userInfo?.createdAt) }}</span>
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <div class="desc-label">
                    <el-icon><Clock /></el-icon>
                    最近更新
                  </div>
                </template>
                <span class="desc-value">{{ formatDateTime(userInfo?.updatedAt) }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改头像对话框 -->
    <el-dialog v-model="showAvatarDialog" title="修改头像" width="400px" center>
      <div class="avatar-uploader-container">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
          accept="image/*"
        >
          <img v-if="tempAvatar" :src="tempAvatar" class="uploaded-avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAvatarDialog">取消</el-button>
          <el-button type="primary" @click="submitAvatar" :loading="avatarSaving">保存头像</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改登录密码" width="450px" @closed="pwdFormRef?.resetFields()">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码（至少6位）" />
        </el-form-item>
        <el-form-item label="密码确认" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPassword" :loading="pwdSaving">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, User, Plus, Edit } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { formatDateTime } from '@/utils/date'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { updateMe, updatePassword } from '@/api/system/user'

const userStore = useUserStore()
const router = useRouter()
const userInfo = computed(() => userStore.userInfo)
const avatarChar = computed(() => userInfo.value?.username?.charAt(0).toUpperCase() || 'U')
const uploadHeaders = computed(() => {
  return { Authorization: `Bearer ${userStore.token}` }
})

// ----- 头像逻辑 -----
const showAvatarDialog = ref(false)
const avatarSaving = ref(false)
const tempAvatar = ref('')

const handleAvatarSuccess = (res: any) => {
  if (res.url) {
    tempAvatar.value = res.url
  } else {
    ElMessage.error('上传失败，未获取到图片地址')
  }
}

const handleAvatarError = () => {
  ElMessage.error('头像上传失败')
}

const beforeAvatarUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片格式!')
  }
  if (!isLt5M) {
    ElMessage.error('头像图片大小不能超过 5MB!')
  }
  return isImage && isLt5M
}

const closeAvatarDialog = () => {
  showAvatarDialog.value = false
  tempAvatar.value = ''
}

const submitAvatar = async () => {
  if (!tempAvatar.value) {
    ElMessage.warning('请先上传图片')
    return
  }
  avatarSaving.value = true
  try {
    await updateMe({ avatar: tempAvatar.value })
    await userStore.fetchUserInfo()
    ElMessage.success('头像已更新')
    closeAvatarDialog()
  } catch (error) {
    console.error(error)
  } finally {
    avatarSaving.value = false
  }
}

// ----- 密码逻辑 -----
const showPasswordDialog = ref(false)
const pwdSaving = ref(false)
const pwdFormRef = ref<FormInstance>()

const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== pwdForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = ref<FormRules>({
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 64, message: '密码长度在6到64位之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const submitPassword = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      pwdSaving.value = true
      try {
        await updatePassword({
          oldPassword: pwdForm.value.oldPassword,
          newPassword: pwdForm.value.newPassword
        })
        ElMessage.success('密码修改成功，请重新登录')
        showPasswordDialog.value = false
        // 强制登出并去登录页
        userStore.clearSession()
        router.push('/login')
      } catch (error) {
        console.error(error)
      } finally {
        pwdSaving.value = false
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  padding: 24px;
}

.user-profile-card {
  border-radius: 8px;
  border: none;
  margin-bottom: 24px;
}

.card-header-bg {
  height: 120px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d8cff 100%);
  position: relative;
}

.actions {
  position: absolute;
  top: 16px;
  right: 16px;
}

.action-btn {
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(0, 0, 0, 0.15) !important;
  font-weight: 500;
}
.action-btn:hover {
  background: rgba(0, 0, 0, 0.3) !important;
  border-color: #fff !important;
}

.profile-avatar-group {
  position: relative;
  text-align: center;
  padding: 0 20px 20px;
  margin-top: -40px;
  border-bottom: 1px solid #f0f2f5;
}

.avatar-wrapper {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.avatar-wrapper:hover .avatar-mask {
  opacity: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #2d8cff;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s;
}

.username {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2a37;
}

.role-tag {
  margin-bottom: 8px;
}

.profile-stats {
  display: flex;
  padding: 20px 0;
}

.stat-item {
  flex: 1;
  text-align: center;
  position: relative;
}

.stat-item:first-child::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  width: 1px;
  background-color: #f0f2f5;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2a37;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.user-detail-card {
  border-radius: 8px;
  border: none;
  height: 100%;
}

.detail-header {
  display: flex;
  align-items: center;
}

.detail-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2a37;
}

.detail-content {
  padding: 10px 0;
}

.desc-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 120px;
  color: #6b7280;
}

.desc-value {
  color: #1f2a37;
  font-weight: 500;
}

:deep(.el-descriptions__body .el-descriptions__table.is-bordered) {
  border-color: #f0f2f5;
}
:deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
  border-color: #f0f2f5;
}

.avatar-uploader-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploaded-avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>
