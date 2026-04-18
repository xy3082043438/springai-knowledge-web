# SpringAI Knowledge Web (企业级知识库管理台)

> 基于 **Vue 3.5**、**Vite 7.2** 和 **Element Plus** 打造的现代化企业知识库与问答管理前端平台。
> 秉承“**高密度、一屏流**”的设计理念，为 SpringAI Knowledge Server 提供极致流畅的管理交互与 AI 对话体验。

---

## ✨ 核心特性

- 🎨 **极致打磨的 UI/UX**: 
  - 采用现代化审美设计（玻璃拟态、光顺动效），全局高度统一了日期时间格式规范与表格交互偏好。
  - **组件级优化**: 侧边栏与菜单具备丝滑的过渡动画，全局支持头像（Avatar）聚合展示，提升系统温度。
- 📊 **集约化全维仪表盘**:
  - **密度优先策略**: 精心设计的极简高密度布局，**无需滚动即可一屏全览**所有关键运行指标、知识分布与问答趋势。
  - **多维大屏组件**: 通过 `EChartsPanel`、`TrendPanel` 和 `DistributionPanel` 等组件化拆分，直观展示系统负载与知识库热点词云。
- 🛡️ **现代化 RBAC与安全网关**:
  - **双重行为验证码**: 登录防盗刷原生集成 `SliderCaptcha` (滑动拼图验证码) 与 `PointClickCaptcha` (中文点选验证码) 组件，拦截恶意程序。
  - **极致权限分配**: 采用横向压缩式权限面板设计，结合全新 `rbac.ts` 与 `access.ts` 细粒度控制指令，从组件级别拦截无权操作。
  - **深度审计**: 提供操作日志、问答日志、反馈日志面板，并一键无缝对接后端的 Excel 数据导出功能。
- 💬 **沉浸式智能问答 (Smart QA)**:
  - **流式对话**: 仿主流 AI 的聊天界面，支持 SSE（Server-Sent Events）毫秒级流式响应。
  - **智能引导**: 自动读取文档相关的 **AI 推荐问题**，引导用户深度挖掘知识库价值。
  - **精密溯源**: 自动标注引用文档、段落来源，并支持一键定位至原始分段预览。
- 📁 **知识库中台**:
  - 文档上传、全异步解析状态深度追踪。
  - **多维预览**: 支持内部原生的 `DocumentPreview` 组件完成高亮渲染、Markdown 检视及切片详情预览。

---

## 🛠 技术架构

- **核心生态层**: Vue `^3.5.25`, TypeScript `^5.7.2`
- **构建驱动**: Vite `^7.2.4` (极致的 HMR 补丁更新流体验)
- **UI 组件库**: Element Plus `^2.13.0`，@element-plus/icons-vue
- **状态与路由**: Pinia `^3.0.4`, Vue Router `^4.6.4`
- **前端可视化**: ECharts `^5.6.0`, ECharts WordCloud
- **网络与拦截**: Axios (完整封装 JWT Token 植入、401/403 路由跳转拦截与异常弹窗降级)
- **CSS 预处理器**: Sass `^1.97.1` (深度定制混合动效、模糊玻璃遮罩)

---

## 📁 核心目录体系

```text
src/
  ├── api/          # Restful 规范的全模块后台 API 绑定字典
  ├── assets/       # 本地静态图片素材与验证码背景预置
  ├── components/   # 高内聚独立组件库
  │   ├── Dashboard/          # 仪表盘拆分包 (EChartsPanel, MetricCards 等)
  │   ├── SliderCaptcha.vue   # 滑块安全验证
  │   ├── PointClickCaptcha.vue # 图文点选防刷验证
  │   └── DocumentPreview.vue # 沉浸式多模态文档检视器
  ├── layout/       # 全局视窗骨架 (核心导航、侧边栏)
  ├── router/       # 前端路由器域与 RBAC 动态守卫路由阻击
  ├── store/        # Pinia 状态树管区
  ├── styles/       # 全局基准与公用样式池
  ├── types/        # TypeScript DTO 类型断言中心
  ├── utils/        # 工具合集 (其中 rbac.ts/access.ts 掌控全视角的细碎鉴权)
  └── views/        # 主功能视窗
      ├── auth/     # 登录面板与鉴权防刷模块
      ├── dashboard/# 全屏主控看板
      └── system/   # 系统底层基座管理页面 (日志、配置、RBAC人员组织架构)
```

---

## 🚀 极速部署指南

### 环境要求
- **Node.js 开发环境**: 兼容 `^20.19.0` 或 `>=22.12.0`

### 1. 挂载依赖包
```bash
npm install
```

### 2. 本地调试发射
```bash
npm run dev
```
> **预设访问口**: `http://localhost:3000`
> **跨域代理**: `vite.config.ts` 已静默包含自动转发至 `http://localhost:8080/api`。

### 3. 上线预编译打成包
```bash
npm run build
```

---

## 🔑 设计守则

- **安全边界**: JWT Token 在 `localStorage` 被妥善保管；按钮级验证码与业务安全相呼应；所有的指令级别权限校验严格遵从 `access.ts` 规范。
- **全栈极简化交互**: 通过 SCSS 实现流体式页面适应法则，系统大面积摒弃累赘滚屏，主张在一个视网膜平面内完成知识查询与维护。
