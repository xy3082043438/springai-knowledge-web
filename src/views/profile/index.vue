<template>
  <div class="profile-container">
    <el-card shadow="hover" class="unified-profile-card" :body-style="{ padding: '0px' }">
      <!-- Top Hero Section -->
      <div class="card-header-bg">
        <div class="actions">
          <el-button color="#ffffff20" class="action-btn" size="small" @click="showPasswordDialog = true" plain>
            修改密码
          </el-button>
        </div>
      </div>

      <div class="profile-main">
        <!-- Basic Info Group -->
        <div class="profile-hero">
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

          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-icon-box"><el-icon><Lock /></el-icon></div>
              <div class="stat-content">
                <div class="stat-value">{{ userInfo?.permissions?.length || 0 }}</div>
                <div class="stat-label">权限项</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon-box success"><el-icon><Finished /></el-icon></div>
              <div class="stat-content">
                <div class="stat-value">正常</div>
                <div class="stat-label">账号状态</div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-section-wrap">
          <el-divider>
            <el-icon><InfoFilled /></el-icon> 账户核心数据
          </el-divider>

          <!-- Detailed Info Group -->
          <div class="detail-section glass-card">
            <el-descriptions :column="1" border size="large" class="profile-desc">
              <el-descriptions-item label-class-name="desc-label-cell">
                <template #label>
                  <div class="desc-label">
                    <el-icon><User /></el-icon>
                    登录账号
                  </div>
                </template>
                <span class="desc-value">{{ userInfo?.username }}</span>
              </el-descriptions-item>

              <el-descriptions-item label-class-name="desc-label-cell">
                <template #label>
                  <div class="desc-label">
                    <el-icon><Calendar /></el-icon>
                    注册时间
                  </div>
                </template>
                <span class="desc-value">{{ formatDateTime(userInfo?.createdAt) }}</span>
              </el-descriptions-item>

              <el-descriptions-item label-class-name="desc-label-cell">
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
        </div>
      </div>
    </el-card>

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
import { Calendar, Clock, User, Plus, Edit, InfoFilled, Lock, Finished } from '@element-plus/icons-vue'
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

.unified-profile-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 20px 60px -10px rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.card-header-bg {
  height: 180px;
  background: 
    linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(45, 140, 255, 0.8) 100%),
    radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%),
    url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJIMjh2LTJoOHptMCA4djJIMjh2LTJoOHptLTEwLTh2MkgxOHYtMmg4em0wIDh2MkgxOHYtMmg4em0tMTAtOHYySDEydi0yaDh6bTAgOHYySDEydi0yaDh6TTM2IDZ2Mkg2VjZoMzB6bTAgOHYySDZ2LTJoMzB6bTAgOHYySDZ2LTJoMzB6bTI0IDB2MmgtMzB2LTJoMzB6bTAgOHYySDEydi0yaDMwem0wIDh2MkgyOHYtMmg4em0wIDh2MkgyOHYtMmg4eiIvPjwvZz48L2c+PC9zdmc+');
  position: relative;
}

.actions {
  position: absolute;
  top: 24px;
  right: 24px;
}

.action-btn {
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.profile-main {
  padding: 0 48px 48px;
}

.profile-hero {
  position: relative;
  text-align: center;
  margin-top: -70px;
  margin-bottom: 40px;
}

.avatar-wrapper {
  margin: 0 auto;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  border: 4px solid #fff;
  background: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.avatar-wrapper:hover .avatar-mask {
  opacity: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 800;
  color: #2563eb;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  opacity: 0;
  transition: all 0.3s ease;
}

.username {
  margin: 20px 0 10px;
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.role-tag {
  margin-bottom: 28px;
}

.profile-stats {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  gap: 40px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  border-color: #3b82f6;
}

.stat-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eff6ff;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon-box.success {
  background: #f0fdf4;
  color: #16a34a;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.glass-section-wrap {
  margin-top: 20px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%);
  border-radius: 20px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8);
}

.detail-section {
  padding: 16px;
}

.glass-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.profile-desc {
  border-radius: 0;
}

:deep(.desc-label-cell) {
  background: #f8fafc !important;
  width: 15vw;
  min-width: 140px;
}

.desc-label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #334155;
  font-weight: 700;
  font-size: 14px;
}

.desc-value {
  color: #0f172a;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}

.desc-value-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-tag {
  font-weight: 600;
}

:deep(.el-divider__text) {
  background-color: transparent;
  color: #475569;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  gap: 8px;
  display: flex;
  align-items: center;
}

.avatar-uploader-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.avatar-uploader :deep(.el-upload) {
  border: 2px dashed #cbd5e1;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #3b82f6;
  background: #f8fafc;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #94a3b8;
}

.uploaded-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
