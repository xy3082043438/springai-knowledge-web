<template>
  <div class="login-container">
    <div class="login-shell">
      <div class="login-panel">
        <div class="panel-brand">
          <div class="brand-badge">AI</div>
          <div>
            <div class="brand-title">企业知识库智能问答助手</div>
            <div class="brand-subtitle">让组织知识可检索、可复用、可沉淀</div>
          </div>
        </div>
        <div class="panel-features">
          <div class="feature-item">统一知识入口，减少信息孤岛</div>
          <div class="feature-item">基于角色的权限控制</div>
          <div class="feature-item">可追溯的问答与反馈日志</div>
        </div>
      </div>
      <el-card class="login-card">
        <template #header>
          <h2 class="login-title">登录系统</h2>
        </template>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="User" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 64, message: '用户名长度 3-64', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '密码长度 6-100', trigger: 'blur' },
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login({
          username: loginForm.username,
          password: loginForm.password,
        })
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (e: any) {
        // Error is handled by axios interceptor
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(800px 400px at 20% 10%, #e7f1ff 0%, transparent 60%),
    radial-gradient(700px 400px at 90% 0%, #e6fbf7 0%, transparent 55%),
    #f4f7fb;
  padding: 24px;
}

.login-shell {
  width: min(920px, 92vw);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.login-panel {
  background: linear-gradient(135deg, #22324b 0%, #1e2a3f 100%);
  color: #e5edf7;
  border-radius: 18px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 420px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);
}

.panel-brand {
  display: flex;
  gap: 14px;
  align-items: center;
}

.brand-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(145deg, #2d8cff, #1f6feb);
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: 1px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 12px;
  color: #c4d2e5;
  margin-top: 4px;
}

.panel-features {
  display: grid;
  gap: 10px;
  font-size: 13px;
  color: #c4d2e5;
}

.feature-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.login-card {
  width: 100%;
  border-radius: 18px;
  border: 1px solid #e8edf5;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #1f2a37;
}

.login-btn {
  width: 100%;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
  .login-panel {
    display: none;
  }
}
</style>
