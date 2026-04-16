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
          <el-input v-model="loginForm.username" prefix-icon="User" placeholder="请输入您的登录账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            type="password"
            placeholder="请输入您的登录密码"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="captchaCode">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captchaCode"
              prefix-icon="CircleCheck"
              placeholder="计算结果"
              class="captcha-input"
              @keyup.enter="handleLogin"
            />
            <div class="captcha-img-box" @click="refreshCaptcha" v-loading="captchaLoading">
              <img v-if="captchaImg" :src="captchaImg" alt="验证码" title="点击刷新" />
              <span v-else>加载中</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="remember-item">
          <el-checkbox v-model="loginForm.rememberMe">记住我 (自动登录)</el-checkbox>
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
import { getCaptcha } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  captchaCode: '',
  captchaKey: '',
  rememberMe: false
})

const captchaImg = ref('')
const captchaLoading = ref(false)

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '登录账号不能为空，请填写', trigger: 'blur' },
    { min: 3, max: 64, message: '用户名长度 3-64', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '登录密码不能为空，请填写', trigger: 'blur' },
    { min: 6, max: 100, message: '密码长度 6-100', trigger: 'blur' },
  ],
  captchaCode: [
    { required: true, message: '请输入计算结果', trigger: 'blur' },
  ]
})

const refreshCaptcha = async () => {
  captchaLoading.value = true
  try {
    const { data } = await getCaptcha()
    captchaImg.value = data.captchaImg
    loginForm.captchaKey = data.captchaKey
    loginForm.captchaCode = ''
  } catch (e) {
    console.error('Captcha load failed:', e)
    ElMessage.error('验证码加载失败，请检查网络或刷新页面')
  } finally {
    captchaLoading.value = false
  }
}

onMounted(() => {
  const authRedirectMessage = sessionStorage.getItem('auth_redirect_message')
  if (authRedirectMessage) {
    ElMessage.warning(authRedirectMessage)
    sessionStorage.removeItem('auth_redirect_message')
  }
  refreshCaptcha()
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
          captchaCode: loginForm.captchaCode,
          captchaKey: loginForm.captchaKey,
          rememberMe: loginForm.rememberMe
        })
        ElMessage.success('欢迎回来，登录成功！')
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

.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img-box {
  width: 110px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 12px;
}

.captcha-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remember-item {
  margin-bottom: 12px !important;
}

/* 解决浏览器自动填充导致的输入框背景色改变变暗变怪问题 */
:deep(.el-input__inner:-webkit-autofill),
:deep(.el-input__inner:-webkit-autofill:hover),
:deep(.el-input__inner:-webkit-autofill:focus),
:deep(.el-input__inner:-webkit-autofill:active) {
  -webkit-text-fill-color: var(--el-text-color-primary) !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>
