# SpringAI Knowledge Base - Web (前端控制台)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.13-409EFF.svg)](https://element-plus.org/)

本仓库是 **SpringAI Knowledge** 项目的前端 Web 应用，采用 Vue3、TypeScript 与 Vite 构建，包含企业级管理后台与智能对话终端，为知识库使用者与系统管理员提供流畅直观的操作体验。

> **💡 完整项目提示**
> 本项目采用前后端分离架构，当前为**前端 Web 应用**仓库。
> 配套的**后端核心服务**（Spring Boot + Spring AI）请访问：[springai-knowledge-server](后端仓库链接请替换至此处)

## 🏗️ 系统整体架构图

*(建议将根目录的 `系统功能模块结构图.png` 及 `用户认证与授权完整流程.png` 图传到仓库中，并在此处展示，让用户一目了然看清全局)*
![系统功能模块结构图](./系统功能模块结构图.png)

## ✨ 核心特性

- **💬 沉浸式对话终端**：支持 Server-Sent Events (SSE) 流式输出，提供打字机般丝滑的大模型回答体验，附带知识片段引用追溯功能。
- **📊 多维数据监控看板**：集成 ECharts 展现服务指标大盘、知识库使用占比及最近问答统计等数据可视化视图。
- **🔐 高级认证与权限管理**：基于 JWT 与路由拦截的完整 RBAC 系统，支持按钮级别与页面级权限过滤，集成滑块与点选图文验证码。
- **📁 文档可视化生命周期管理**：提供直观的批量文档上传、向量转换进度查询、预览、修改以及细粒度的可见性授权界面。
- **⚙️ 全面的系统设置**：友好的后台可视化管理功能，提供用户角色维护、系统参数（如大模型超参调整、检索策略设置）调配及操作日志审计分析。

## 🛠️ 技术栈核心

- **核心框架**: Vue 3.5.25 (Composition API, `<script setup>`)
- **开发语言**: TypeScript 5.7
- **打包与构建**: Vite 7.2.4
- **UI 组件库**: Element Plus 2.13
- **状态管理**: Pinia 3.0
- **客户端路由**: Vue Router 4.6
- **网络请求**: Axios (定制封装：Token 无感自动处理, 全局异常捕获)
- **图表数据化**: ECharts 5.6 & ECharts-Wordcloud
- **样式处理器**: Sass

## 📂 项目目录结构

```text
springai-knowledge-web/
├── public/                 # 静态无编译资源存放处
├── src/
│   ├── api/                # 后端 RESTful 接口封装定义
│   │   ├── business/       # 业务接口 (知识库文档, 问答对话, 意见反馈)
│   │   └── system/         # 系统接口 (用户, 角色, 日志, 参数配置)
│   ├── assets/             # 全局静态资产及公用 SCSS 配置
│   ├── components/         # 全局复用组件 (如图表, 验证码, 自定义列表槽)
│   ├── layout/             # 管理系统页面的全套布局外壳 (Layout骨架)
│   ├── router/             # 路由配置中心及基于权限的动态路由守卫
│   ├── store/              # Pinia 状态树 (用户鉴权信息缓存, 系统布局状态)
│   ├── styles/             # 主题样式覆盖及全局通用 CSS
│   ├── types/              # TypeScript 类型声明 (请求响应模型定义)
│   ├── utils/              # 工具库 (Axios 拦截器, 权限校验, 日期转换)
│   └── views/              # 各大业务视图 (登录, 首页仪表盘, 知识总览, 各种系统管理菜单)
├── .env.development        # 本地开发环境变量配置
├── index.html              # Vue 的挂载点及主要 HTML 入口
├── package.json            # NPM 依赖及运行脚本配置
├── tsconfig.json           # TypeScript 全局配置策略
└── vite.config.ts          # Vite 构建与代理配置信息
```

## 🚀 快速启动

### 1. 环境依赖准备

确保本地已安装 [Node.js](https://nodejs.org/) (推荐 `v20.x` LTS 或 `>= v22.x`)。

### 2. 安装项目依赖

推荐使用 NPM (或使用 Yarn / PNPM 也可以)：
```bash
npm install
```

### 3. 配置开发环境接口转发代理

若后端服务地址与默认配置不同，可前往根目录修改 `vite.config.ts` 中的 `proxy` 配置，以解决跨域及路径代理：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 你的后端服务基础地址
      changeOrigin: true
    }
  }
}
```

### 4. 启动本地开发服务器

运行如下命令，Vue 项目将自动启动 Vite 开发服务器：
```bash
npm run dev
```

## 📦 项目编译构建

当项目准备部署到生产环境或服务器时，运行如下命令构建产物：
```bash
npm run build
```
编译完成后的前端静态文件将默认输出至 `/dist` 目录中。可直接由 Nginx 或任意 HTTP Server 承载运行。针对构建的快速本地预览，可使用 `npm run preview` 检查。

## 🤝 开发约定

- 路由遵循后端权限树对应，`src/router/` 中涉及异步路由的部分需与后端约定的角色权限点同步。
- 业务组件应优先拆解到 `src/components/业务领域/` 下，保持视图层逻辑简洁。
- Axios 统一拦截报错提醒（通过 Element Plus 取出），针对常规的 401 及权限不足已进行预设捕获，不需在页面端赘述重复逻辑。

## 🚀 部署到 Vercel

本项目通过 Vercel 部署时，由 `vercel.json` 配置 `/api/*` 请求转发到后端服务。为避免后端真实地址被提交到公开仓库，`vercel.json` 不入版本库，而是在构建期由 [scripts/gen-vercel-json.mjs](./scripts/gen-vercel-json.mjs) 基于 [vercel.template.json](./vercel.template.json) 注入环境变量生成。

部署步骤：

1. 在 Vercel 项目的 **Settings → Environment Variables** 中新增（注意勾选 **Production**，需要预览部署再勾 Preview）：
   - `BACKEND_API_URL` = 后端服务根地址（例如 `http://1.2.3.4` 或 `https://api.example.com`，**不要带末尾斜杠**，不要包含 `/api` 路径）。
2. **Build Command** 使用默认 `npm run build` 即可，构建脚本会自动调用 `gen:vercel` 生成 `vercel.json`。
3. 本地若需调试生成结果，可执行：
   ```bash
   BACKEND_API_URL=http://localhost:8080 npm run gen:vercel
   ```
