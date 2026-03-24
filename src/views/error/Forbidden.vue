<template>
  <div class="forbidden-page">
    <div class="forbidden-card">
      <div class="status-code">403</div>
      <div class="status-title">无权限访问</div>
      <div class="status-text">
        当前账号没有访问此页面的权限。你可以返回仪表盘，或联系管理员开通对应角色。
      </div>
      <div class="actions">
        <el-button @click="router.back()">返回上一页</el-button>
        <el-button type="primary" @click="router.push('/dashboard')">回到仪表盘</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.forbidden-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.forbidden-card {
  width: min(100%, 560px);
  padding: 40px 36px;
  border-radius: 24px;
  background:
    radial-gradient(220px 120px at top right, rgba(255, 193, 7, 0.12), transparent 70%),
    linear-gradient(145deg, #ffffff, #f8fbff 55%, #f3f7fd);
  border: 1px solid #e8edf5;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.status-code {
  font-size: 56px;
  line-height: 1;
  font-weight: 800;
  color: #e6a23c;
}

.status-title {
  margin-top: 14px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2a37;
}

.status-text {
  margin-top: 12px;
  color: #6b7280;
  line-height: 1.7;
}

.actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
