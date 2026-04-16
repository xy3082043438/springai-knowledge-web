<template>
  <el-dialog
    v-model="visible"
    title="安全验证"
    width="440px"
    destroy-on-close
    :close-on-click-modal="false"
    class="captcha-dialog"
  >
    <div class="point-captcha-container" v-loading="loading">
      <!-- Instruction Area -->
      <div class="instruction">
        请依次点击：
        <div class="word-list">
          <span 
            v-for="(word, index) in captchaData.checkWords" 
            :key="index"
            class="target-word"
          >
            {{ word }}
          </span>
        </div>
      </div>

      <!-- Main Image Area -->
      <div 
        class="captcha-image-box" 
        @click="handleImageClick"
        @selectstart.prevent
      >
        <img :src="captchaData.captchaImg" class="bg-img" alt="background" />
        
        <!-- User Click Markers -->
        <div 
          v-for="(click, index) in userClicks" 
          :key="index"
          class="click-marker"
          :style="{ left: click.x + 'px', top: click.y + 'px' }"
        >
          {{ index + 1 }}
        </div>

        <!-- Success/Fail Message Overlay -->
        <div v-if="resultStatus" class="status-overlay" :class="resultStatus">
          <span>{{ resultStatus === 'success' ? '验证通过' : '验证失败，请重试' }}</span>
        </div>
      </div>

      <div class="captcha-footer">
        <el-button link :icon="Refresh" @click="loadData">刷新验证码</el-button>
        <el-button link @click="clearClicks">重置点击</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getCaptcha } from '@/api/auth'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const resultStatus = ref<'' | 'success' | 'fail'>('')
const userClicks = ref<{ x: number, y: number }[]>([])

const captchaData = reactive({
  captchaImg: '',
  checkWords: [] as string[],
  captchaKey: ''
})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadData()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetState()
  }
})

const resetState = () => {
  userClicks.value = []
  resultStatus.value = ''
}

const clearClicks = () => {
  userClicks.value = []
}

const loadData = async () => {
  loading.value = true
  resetState()
  try {
    const { data } = await getCaptcha()
    Object.assign(captchaData, data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleImageClick = (e: MouseEvent) => {
  if (resultStatus.value === 'success' || loading.value) return
  
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = Math.round(e.clientX - rect.left)
  const y = Math.round(e.clientY - rect.top)
  
  userClicks.value.push({ x, y })
  
  // If reached required clicks, auto-submit
  if (userClicks.value.length === captchaData.checkWords.length) {
    verify()
  }
}

const verify = () => {
  // Format clicks as "x1,y1;x2,y2;x3,y3"
  const captchaCode = userClicks.value
    .map(c => `${c.x},${c.y}`)
    .join(';')
    
  emit('success', {
    captchaKey: captchaData.captchaKey,
    code: captchaCode
  })
}

const setStatus = (status: 'success' | 'fail') => {
  resultStatus.value = status
  if (status === 'fail') {
    setTimeout(() => {
      loadData()
    }, 1000)
  } else {
    setTimeout(() => {
      visible.value = false
    }, 800)
  }
}

defineExpose({ setStatus, loadData })
</script>

<style scoped>
.captcha-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.point-captcha-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.instruction {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}

.word-list {
  display: flex;
  gap: 8px;
}

.target-word {
  padding: 2px 10px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #2563eb;
  font-size: 18px;
}

.captcha-image-box {
  position: relative;
  width: 400px;
  height: 200px;
  background-color: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  cursor: crosshair;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.bg-img {
  width: 100%;
  height: 100%;
  display: block;
}

.click-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  transform: translate(-50%, -50%); /* Center marker on click */
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.status-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  z-index: 20;
}

.status-overlay.success { background: rgba(34, 197, 94, 0.9); }
.status-overlay.fail { background: rgba(239, 68, 68, 0.9); }

.captcha-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}
</style>
