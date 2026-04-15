<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="card-header">
        <img src="/logo.svg" class="brand-logo" alt="logo" />
        <h2 class="login-title">基于SpringAI的企业知识库系统</h2>
        <p class="login-subtitle">一款企业级智能知识检索与增强归纳平台</p>
      </div>
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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

onMounted(() => {
  const authRedirectMessage = sessionStorage.getItem('auth_redirect_message')
  if (authRedirectMessage) {
    ElMessage.warning(authRedirectMessage)
    sessionStorage.removeItem('auth_redirect_message')
  }
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

.login-card {
  width: 400px;
  border-radius: 18px;
  border: 1px solid #e8edf5;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  display: block;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(31, 111, 235, 0.35);
}

.login-title {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2a37;
}

.login-subtitle {
  margin: 0;
  font-size: 13px;
  color: #8a9ab5;
}

.login-btn {
  width: 100%;
}
</style>
