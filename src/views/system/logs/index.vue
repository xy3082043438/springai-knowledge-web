<template>
  <div class="logs-container">
    <div class="page-header">
      <div>
        <div class="page-title">日志与反馈</div>
        <div class="page-subtitle">审计系统操作、问答记录与用户反馈</div>
      </div>
      <div class="header-filter">
        <el-date-picker
          v-model="currentDateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 360px;"
        />
        <el-button type="primary" style="margin-left: 8px;" @click="handleQuery">查询</el-button>
        <el-button type="success" style="margin-left: 8px;" @click="handleExportLogs" :loading="exportLoading">导出 Excel</el-button>
      </div>
    </div>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">

      <!-- 操作日志 -->
      <el-tab-pane label="操作日志" name="operation">
        <el-table :data="operationLogs" v-loading="opLoading" style="width: 100%; margin-top: 10px;" border>
          <el-table-column prop="username" label="用户" width="120" />
          <el-table-column prop="action" label="操作" width="150" />
          <el-table-column prop="resource" label="资源" width="120" />
          <el-table-column prop="resourceId" label="资源ID" width="100" />
          <el-table-column prop="detail" label="详情" show-overflow-tooltip />
          <el-table-column prop="ip" label="IP" width="140" />
          <el-table-column prop="success" label="结果" width="80">
            <template #default="{ row }">
              <el-tag :type="row.success ? 'success' : 'danger'" size="small">
                {{ row.success ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="opTotal"
          :page-sizes="[10, 15, 20, 50, 100]"
          :page-size="opFilter.size"
          v-model:current-page="opFilter.currentPage"
          @size-change="(val: number) => { opFilter.size = val; loadOperationLogs() }"
          @current-change="loadOperationLogs"
          style="margin-top: 15px; justify-content: flex-end;"
        />
      </el-tab-pane>

      <!-- QA 日志 -->
      <el-tab-pane label="问答日志" name="qa">
        <el-table :data="qaLogs" v-loading="qaLoading" style="width: 100%; margin-top: 10px;" border>
          <el-table-column prop="username" label="用户" width="120" />
          <el-table-column prop="question" label="问题" show-overflow-tooltip />
          <el-table-column prop="answer" label="回答" show-overflow-tooltip />
          <el-table-column prop="roleName" label="角色" width="100" />
          <el-table-column prop="topK" label="TopK" width="70" />
          <el-table-column prop="createdAt" label="时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="qaTotal"
          :page-sizes="[10, 15, 20, 50, 100]"
          :page-size="qaFilter.size"
          v-model:current-page="qaFilter.currentPage"
          @size-change="(val: number) => { qaFilter.size = val; loadQaLogs() }"
          @current-change="loadQaLogs"
          style="margin-top: 15px; justify-content: flex-end;"
        />
      </el-tab-pane>

      <!-- 用户反馈 -->
      <el-tab-pane label="用户反馈" name="feedback">
        <el-table :data="feedbacks" v-loading="fbLoading" style="width: 100%; margin-top: 10px;" border>
          <el-table-column prop="username" label="用户" width="120" />
          <el-table-column prop="qaLogId" label="关联问答ID" width="120" />
          <el-table-column prop="helpful" label="是否有用" width="100">
            <template #default="{ row }">
              <el-tag :type="row.helpful ? 'success' : 'danger'" size="small">
                {{ row.helpful ? '👍 有用' : '👎 无用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="评论" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="fbTotal"
          :page-sizes="[10, 15, 20, 50, 100]"
          :page-size="fbFilter.size"
          v-model:current-page="fbFilter.currentPage"
          @size-change="(val: number) => { fbFilter.size = val; loadFeedbacks() }"
          @current-change="loadFeedbacks"
          style="margin-top: 15px; justify-content: flex-end;"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { searchOperationLogs, exportOperationLogs, searchQaLogs, exportQaLogs } from '@/api/system/log'
import { searchFeedback, exportFeedback } from '@/api/business/feedback'
import { formatDateTime } from '@/utils/date'
import type { OperationLogResponse, QaLogResponse, QaFeedbackResponse } from '@/types/api'

const activeTab = ref('operation')
const currentDateRange = ref<string[] | null>(null)

const handleQuery = () => {
  if (activeTab.value === 'operation') loadOperationLogs()
  else if (activeTab.value === 'qa') loadQaLogs()
  else if (activeTab.value === 'feedback') loadFeedbacks()
}

// ---- Operation Logs ----
const opLoading = ref(false)
const operationLogs = ref<OperationLogResponse[]>([])
const opTotal = ref(0)
const opFilter = reactive({ size: 15, currentPage: 1 })

const loadOperationLogs = async () => {
  opLoading.value = true
  try {
    const params: any = { page: opFilter.currentPage - 1, size: opFilter.size }
    if (currentDateRange.value?.length === 2) {
      params.from = currentDateRange.value[0]
      params.to = currentDateRange.value[1]
    }
    const { data } = await searchOperationLogs(params)
    operationLogs.value = data.items
    opTotal.value = data.total
  } finally {
    opLoading.value = false
  }
}

const exportLoading = ref(false)
const handleExportLogs = async () => {
  exportLoading.value = true
  try {
    const params: any = {}
    if (currentDateRange.value?.length === 2) {
      params.from = currentDateRange.value[0]
      params.to = currentDateRange.value[1]
    }
    let res: any
    let filename = ''
    if (activeTab.value === 'operation') {
      res = await exportOperationLogs(params)
      filename = '操作日志.xlsx'
    } else if (activeTab.value === 'qa') {
      res = await exportQaLogs(params)
      filename = '问答日志.xlsx'
    } else if (activeTab.value === 'feedback') {
      res = await exportFeedback(params)
      filename = '用户反馈.xlsx'
    }
    
    if (res && res.data) {
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success(`${activeTab.value === 'operation' ? '操作日志' : activeTab.value === 'qa' ? '问答日志' : '用户反馈'} 导出成功！`)
    } else {
      ElMessage.warning('未能获取到导出数据，请重试')
    }
  } catch (error) {
    console.error('Export failed', error)
    ElMessage.error('导出失败，可能由于数据量过大或服务器暂不可用。')
  } finally {
    exportLoading.value = false
  }
}

// ---- QA Logs ----
const qaLoading = ref(false)
const qaLogs = ref<QaLogResponse[]>([])
const qaTotal = ref(0)
const qaFilter = reactive({ size: 15, currentPage: 1 })

const loadQaLogs = async () => {
  qaLoading.value = true
  try {
    const params: any = { page: qaFilter.currentPage - 1, size: qaFilter.size }
    if (currentDateRange.value?.length === 2) {
      params.from = currentDateRange.value[0]
      params.to = currentDateRange.value[1]
    }
    const { data } = await searchQaLogs(params)
    qaLogs.value = data.items
    qaTotal.value = data.total
  } finally {
    qaLoading.value = false
  }
}

// ---- Feedbacks ----
const fbLoading = ref(false)
const feedbacks = ref<QaFeedbackResponse[]>([])
const fbTotal = ref(0)
const fbFilter = reactive({ size: 15, currentPage: 1 })

const loadFeedbacks = async () => {
  fbLoading.value = true
  try {
    const params: any = { page: fbFilter.currentPage - 1, size: fbFilter.size }
    if (currentDateRange.value?.length === 2) {
      params.from = currentDateRange.value[0]
      params.to = currentDateRange.value[1]
    }
    const { data } = await searchFeedback(params)
    feedbacks.value = data.items
    fbTotal.value = data.total
  } finally {
    fbLoading.value = false
  }
}

const handleTabChange = (tab: string) => {
  if (tab === 'operation' && operationLogs.value.length === 0) loadOperationLogs()
  else if (tab === 'qa' && qaLogs.value.length === 0) loadQaLogs()
  else if (tab === 'feedback' && feedbacks.value.length === 0) loadFeedbacks()
}

onMounted(() => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
  
  const format = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  
  currentDateRange.value = [format(start), format(end)]
  loadOperationLogs()
})
</script>

<style scoped>
.logs-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid #e8edf5;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
}
.header-filter {
  display: flex;
  align-items: center;
}
.pagination {
  justify-content: flex-end;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

