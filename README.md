# SpringAI Knowledge Base · Web 前端控制台

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.13-409EFF.svg)](https://element-plus.org/)

**SpringAI Knowledge** 项目的前端 Web 应用，基于 Vue 3 + TypeScript + Vite 构建，包含管理后台与对话界面，已适配 **PC 与移动端响应式布局**。

> 本项目为前后端分离架构，此处为**前端仓库**。配套的后端服务（Spring Boot 4 + Spring AI）见 [springai-knowledge-server](https://github.com/xy3082043438/springai-knowledge-server)。

## ✨ 核心特性

- **💬 对话界面**：通过 SSE（Server-Sent Events）接收大模型流式输出，并展示回答所引用的知识片段来源。
- **📱 响应式布局**：统一断点（手机 ≤768px / 平板 ≤1024px / 桌面）。手机端侧边栏折叠为图标条、会话列表改为滑出抽屉；桌面端完整展开。
- **📊 数据看板**：使用 ECharts 与词云组件，展示服务指标、知识库使用占比、最近问答统计等图表。
- **🔐 RBAC 权限**：JWT + 路由守卫，按页面与按钮粒度控制访问；登录页集成滑块与点选验证码。
- **📁 文档管理**：批量上传、向量化进度查询、在线预览与编辑，支持按角色配置文档可见性；列表行可展开查看解析时自动生成的 AI 文档摘要。
- **⚙️ 系统设置**：用户与角色维护、系统参数配置、操作日志与反馈查询。

## 🛠️ 技术栈

| 分类 | 选型 |
| --- | --- |
| 核心框架 | Vue 3.5（Composition API，`<script setup>`） |
| 开发语言 | TypeScript 5.7 |
| 构建工具 | Vite 7.2 |
| UI 组件库 | Element Plus 2.13 |
| 状态管理 | Pinia 3.0 |
| 路由 | Vue Router 4.6 |
| 网络请求 | Axios（封装：Token 自动注入、全局异常拦截） |
| 数据可视化 | ECharts 5.6 + echarts-wordcloud |
| 样式 | Sass |

## 📂 目录结构

```text
springai-knowledge-web/
├── public/                     # 不参与编译的静态资源
├── src/
│   ├── api/                    # 后端接口封装
│   │   ├── auth.ts             # 登录 / 认证
│   │   ├── dashboard.ts        # 仪表盘数据
│   │   ├── business/           # 业务：document · feedback · qa · session
│   │   └── system/             # 系统：config · log · role · user
│   ├── assets/                 # 全局静态资产
│   ├── components/             # 复用组件：Dashboard 图表面板、DocumentPreview、滑块/点选验证码
│   ├── composables/            # 组合式函数（useBreakpoint：响应式断点）
│   ├── layout/                 # 布局外壳（侧边栏 / 顶栏 / 主区，含响应式）
│   ├── router/                 # 路由表与基于权限的路由守卫
│   ├── store/                  # Pinia 状态（用户鉴权信息等）
│   ├── styles/                 # 全局样式与断点（_responsive.scss）
│   ├── types/                  # TypeScript 类型声明（api.ts、router.d.ts）
│   ├── utils/                  # 工具：request(Axios) · access/rbac(权限) · date
│   └── views/                  # 页面：登录 / 仪表盘 / 问答 / 知识库 / 系统管理 / 个人信息
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 构建与开发代理配置
├── vercel.json                 # Vercel 路由配置（通过环境变量代理后端）
└── tsconfig.json
```

## 🚀 快速开始

### 1. 环境要求

- [Node.js](https://nodejs.org/)：`^20.19.0` 或 `>= 22.12.0`（推荐最新 LTS）

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务运行在 **`http://localhost:3000`**，并将 `/api` 请求代理到后端。代理目标由 `vite.config.ts` 读取环境变量 `VITE_API_TARGET` 决定，默认 `http://localhost:8080`：

```bash
# 指向非默认后端地址（可选）
VITE_API_TARGET=http://192.168.1.10:8080 npm run dev
```

> 也可直接修改 `vite.config.ts` 中 `server.proxy['/api'].target`。

## 📦 构建与预览

```bash
npm run build     # 类型检查(vue-tsc) → vite 打包，产物输出至 dist/
npm run preview   # 本地预览生产构建产物
```

> 产物为纯静态文件，可由 Nginx 等任意 HTTP Server 承载。

## ☁️ 部署到 Vercel

为避免后端真实地址进入公开仓库，[vercel.json](./vercel.json) 使用 Vercel 官方支持的环境变量展开语法，将 `/api/*` 代理到 `BACKEND_API_URL`。

1. 在 Vercel 项目 **Settings → Environment Variables** 中新增（勾选 **Production**，需预览部署再勾 Preview）：
   - `BACKEND_API_URL` = 后端服务根地址（如 `https://api.example.com`，**不带末尾斜杠**、不含 `/api` 路径）。
2. **Build Command** 保持默认 `npm run build`。Vercel 会根据 `vercel.json` 将 `/api/*` 转发到后端。

## 🤝 开发约定

- **权限同步**：`src/router/` 中的路由 `meta.permissions` 需与后端权限点保持一致，权限校验逻辑见 `src/utils/access.ts` 与 `rbac.ts`。
- **请求与异常**：所有请求经 `src/utils/request.ts` 统一拦截，Token 自动注入、401 与权限不足已全局处理，页面端无需重复编写。
- **组件拆分**：业务组件优先按领域拆分到 `src/components/` 下，保持视图层简洁。
- **响应式**：新增样式断点统一引用 `src/styles/_responsive.scss`；需在脚本中感知视口时使用 `src/composables/useBreakpoint.ts`。
