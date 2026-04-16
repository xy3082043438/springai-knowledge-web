<template>
  <el-dialog
    v-model="visible"
    title="安全验证"
    width="440px"
    destroy-on-close
    aria-modal="true"
    :close-on-click-modal="false"
    class="captcha-dialog"
  >
    <div class="slider-captcha-container" v-loading="loading">
      <!-- Main Image Area -->
      <div 
        class="captcha-image-box" 
        :style="{ width: width + 'px', height: height + 'px' }"
        @selectstart.prevent
      >
        <img :src="captchaData.captchaImg" class="bg-img" alt="background" />
        <img 
          :src="captchaData.sliderImg" 
          class="slider-img" 
          :style="{ 
            left: sliderLeft + 'px', 
            top: captchaData.y + 'px' 
          }"
          alt="slider"
        />
        
        <!-- Success/Fail Message Overlay -->
        <div v-if="resultStatus" class="status-overlay" :class="resultStatus">
          <span>{{ resultStatus === 'success' ? '验证通过' : '请重试' }}</span>
        </div>
      </div>

      <!-- Slider Track -->
      <div class="slider-track" ref="trackRef">
        <div class="track-text" v-if="!isDragging && !resultStatus">向右滑动完成验证</div>
        <div 
          class="track-progress" 
          :style="{ width: (sliderLeft + 20) + 'px' }"
          :class="resultStatus"
        ></div>
        <div 
          class="slider-handle" 
          :style="{ left: sliderLeft + 'px' }"
          @mousedown="startDrag"
          @touchstart="startDrag"
          :class="{ dragging: isDragging, [resultStatus]: true }"
        >
          <el-icon v-if="!resultStatus"><ArrowRight /></el-icon>
          <el-icon v-else-if="resultStatus === 'success'"><Check /></el-icon>
          <el-icon v-else><Close /></el-icon>
        </div>
      </div>

      <div class="captcha-footer">
        <el-button link :icon="Refresh" @click="loadData">刷新验证码</el-button>
        <span class="tip">拖动滑块对齐拼图</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getCaptcha } from '@/api/auth'
import { Refresh, ArrowRight, Check, Close } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const isDragging = ref(false)
const sliderLeft = ref(0)
const startX = ref(0)
const width = 400
const height = 200
const resultStatus = ref<'' | 'success' | 'fail'>('')

const captchaData = reactive({
  captchaImg: '',
  sliderImg: '',
  captchaKey: '',
  y: 0
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
  sliderLeft.value = 0
  resultStatus.value = ''
  isDragging.value = false
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

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (resultStatus.value === 'success' || loading.value) return
  isDragging.value = true
  startX.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', endDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  let moveX = currentX - startX.value
  
  // Constrain
  const maxMove = width - 45 - 20 // slider width is ~45, track padding
  if (moveX < 0) moveX = 0
  if (moveX > maxMove) moveX = maxMove
  
  sliderLeft.value = moveX
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)
  
  // Submit verification
  verify()
}

const verify = () => {
  // We send the current offset to parent to let it handle the actual login or verification
  emit('success', {
    captchaKey: captchaData.captchaKey,
    x: Math.round(sliderLeft.value)
  })
}

// Parent can call this to show result
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

.slider-captcha-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.captcha-image-box {
  position: relative;
  background-color: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.bg-img {
  width: 100%;
  height: 100%;
  display: block;
}

.slider-img {
  position: absolute;
  z-index: 10;
  width: 45px;
  height: 45px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.status-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  z-index: 20;
}

.status-overlay.success { background: rgba(34, 197, 94, 0.9); }
.status-overlay.fail { background: rgba(239, 68, 68, 0.9); }

.slider-track {
  position: relative;
  height: 44px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  overflow: hidden;
}

.track-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b;
  font-size: 14px;
  pointer-events: none;
}

.track-progress {
  height: 100%;
  background-color: rgba(59, 130, 246, 0.1);
  transition: background-color 0.3s;
}

.track-progress.success { background-color: rgba(34, 197, 94, 0.15); }
.track-progress.fail { background-color: rgba(239, 68, 68, 0.15); }

.slider-handle {
  position: absolute;
  top: 2px;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 5;
}

.slider-handle:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.slider-handle.dragging {
  cursor: grabbing;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.slider-handle.success { background-color: #22c55e; color: white; }
.slider-handle.fail { background-color: #ef4444; color: white; }

.captcha-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.tip {
  font-size: 13px;
  color: #94a3b8;
}
</style>
