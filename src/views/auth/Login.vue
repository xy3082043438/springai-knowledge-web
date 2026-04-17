<template>
  <div class="login-page">
    <!-- Left Section: Premium Visuals -->
    <div class="visual-section">
      <div class="illustration-container">
        <img src="/login-bg.png" alt="AI Context" class="bg-image" />
        <div class="overlay"></div>
      </div>
      <div class="brand-content">
        <div class="logo-wrapper">
          <img src="/logo.svg" alt="logo" class="logo-icon" />
          <span class="logo-text">SpringAI Knowledge</span>
        </div>
        <div class="hero-text">
          <h1>基于 SpringAI 的<br />企业级知识库智能问答系统</h1>
           <p>
            集成 RAG 架构与多模态数据处理的双语知识问答平台，<br />
            实现企业私有领域知识的高效检索与智能归纳。
          </p>
        </div>
        <div class="feature-tags">
          <span class="tag"><el-icon><Monitor /></el-icon> RAG 增强检索</span>
          <span class="tag"><el-icon><Lock /></el-icon> 细粒度访问控制</span>
          <span class="tag"><el-icon><MagicStick /></el-icon> 语义特征提取</span>
        </div>
      </div>
    </div>

    <!-- Right Section: Login Form -->
    <div class="form-section">
      <div class="form-scroll">
        <el-card class="login-card">
          <div class="card-header">
            <h2>欢迎回来</h2>
            <p>身份认证：请登录以进入系统后台</p>
          </div>

          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入账号" 
                class="premium-input"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                class="premium-input"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="验证码" prop="captchaCode">
              <div class="captcha-wrapper">
                <el-input
                  v-model="loginForm.captchaCode"
                  placeholder="计算结果"
                  class="premium-input captcha-input"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <el-icon><CircleCheck /></el-icon>
                  </template>
                </el-input>
                <div class="captcha-box" @click="refreshCaptcha" v-loading="captchaLoading">
                  <img v-if="captchaImg" :src="captchaImg" alt="Captcha" />
                  <span v-else>加载中</span>
                </div>
              </div>
            </el-form-item>

            <div class="form-footer">
              <el-button 
                type="primary" 
                class="login-button" 
                :loading="loading" 
                @click="handleLogin"
              >
                登录
              </el-button>
            </div>
          </el-form>

          <div class="copyright">
            © 2026 毕业设计：基于SpringAI的知识库智能问答助手
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getCaptcha } from '@/api/auth'
import { User, Lock, CircleCheck, Monitor, MagicStick } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaLoading = ref(false)
const captchaImg = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  captchaCode: '',
  captchaKey: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 64, message: '长度需在 3-64 之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '长度需在 6-100 之间', trigger: 'blur' },
  ],
  captchaCode: [
    { required: true, message: '请输入验证码计算结果', trigger: 'blur' },
  ]
})

onMounted(() => {
  const authRedirectMessage = sessionStorage.getItem('auth_redirect_message')
  if (authRedirectMessage) {
    ElMessage.warning(authRedirectMessage)
    sessionStorage.removeItem('auth_redirect_message')
  }
  refreshCaptcha()
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
  } finally {
    captchaLoading.value = false
  }
}

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
          captchaKey: loginForm.captchaKey
        })
        ElMessage.success('登录成功，欢迎回来！')
        router.push('/dashboard')
      } catch (e: any) {
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  background-color: #fcfdfe;
}

.visual-section {
  position: relative;
  flex: 1.4;
  height: 100%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  color: white;
}

@media (max-width: 1024px) {
  .visual-section {
    display: none;
  }
}

.illustration-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.4) 100%);
  z-index: 2;
}

.brand-content {
  position: relative;
  z-index: 10;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 80px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  padding: 12px 24px;
  border-radius: 100px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hero-text h1 {
  font-size: 48px;
  line-height: 1.2;
  font-weight: 800;
  margin-bottom: 24px;
}

.hero-text p {
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 500px;
}

.feature-tags {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 20px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-section {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  padding: 40px;
}

.form-scroll {
  width: 100%;
  max-width: 440px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-card {
  border: none;
  box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.1);
  border-radius: 24px;
  padding: 20px;
}

.card-header {
  margin-bottom: 32px;
  text-align: left;
}

.card-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.card-header p {
  color: #64748b;
  font-size: 15px;
}

:deep(.premium-input .el-input__wrapper) {
  padding: 10px 16px;
  border-radius: 12px;
  background-color: #f1f5f9;
  box-shadow: none !important;
  border: 1px solid transparent;
  transition: all 0.3s;
}

:deep(.premium-input .el-input__wrapper.is-focus) {
  background-color: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px !important;
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-box {
  width: 120px;
  height: 44px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s;
}

.captcha-box:hover {
  border-color: #cbd5e1;
}

.captcha-box img {
  height: 100%;
  width: 100%;
  object-fit: contain; /* Standard arithmetic captcha doesn't need cover */
}

.form-footer {
  margin-top: 10px;
}

.login-button {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.copyright {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

:deep(.el-input__inner:-webkit-autofill) {
  -webkit-text-fill-color: #1e293b !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>
