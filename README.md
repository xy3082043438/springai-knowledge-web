# SpringAI Knowledge Web (企业知识库前台控制台)

> 基于 Vue 3、Vite 和 Element Plus 打造的现代化企业知识库与问答管理前端平台。
> 为 SpringAI Knowledge Server 服务提供可视化管理与大模型交互界面。

## ✨ 核心特性

- ⚡️ **极速开发**: 基于 Vite 构建，享受极速的服务启动与 HMR (热更新) 体验。
- 🎨 **清爽 UI**: 采用 Element Plus 组件库与 Sass，提供直观、现代响应式的管理台界面。
- 📊 **直观仪表盘**: 接入 ECharts，提供知识库文档、系统运行状态、数据流转的直观可视化图表与词云分析。
- 💬 **智能问答台**: 支持对后端大模型发起提问，直观展示来源文档引用、段落溯源，并随时进行满意度反馈。
- 📁 **知识库管理**: 界面友好的文档上传与检索，并提供实时的解析、重置与角色访问权限配置。
- 👨‍💻 **灵活的权限控制**: 内置对 RBAC 的完整适配，支持角色、用户的增删改查。
- ⚙️ **动态系统配置**: 直接图形化完成检索权重、大模型参数、向量切分等核心参数的管理，支持一键热流转生效。

## 🛠 技术栈

- **核心层**: Vue `^3.5.25`, TypeScript `^5.7.2`
- **工程化构建**: Vite `^7.2.4`, vue-tsc
- **UI 呈现与样式**: Element Plus `^2.13.0`, Sass `^1.97.1`
- **状态管理与路由**: Pinia `^3.0.4`, Vue Router `^4.6.4`
- **数据可视化**: ECharts `^5.6.0`, ECharts WordCloud
- **网络通信**: Axios `^1.13.2`

## 📁 核心项目结构

```text
src/
  ├── api/          # 所有的 Axios 接口定义 (拆分业务模块)
  ├── assets/       # 静态资源 (图片/字体等)
  ├── components/   # 全局和局部复用组件 (如图表面板)
  ├── layout/       # 系统基础布局 (Sidebar, Navbar, MainBox)
  ├── router/       # Vue Router 路由表与权限路由拦截守卫
  ├── store/        # Pinia Store 管理全局状态与令牌
  ├── styles/       # 全局 Sass 样式变量与覆盖
  ├── types/        # TypeScript 全局接口定于
  ├── utils/        # Axios 封装, 鉴权解析拦截器, 通用工具类
  └── views/        # 核心业务页面层 (看板/问答/文档/配置/监控)
```

## 🚀 快速启动

### 境要求

- **Node.js**: `^20.19.0` 或 `>=22.12.0` (推荐使用 Node LTS)

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发与联调

启动开发服务器：

```bash
npm run dev
```
> 默认运行于: `http://localhost:3000`
> 注意：本地开发默将 `/api` 请求代理至 `http://localhost:8080`。若后端未在本地 8080 端口，请调整 `vite.config.ts` 中的 `server.proxy` 配置。

### 3. 生产构建

```bash
# 类型检查并编译打包构建
npm run build
```

打包产物生成在 `/dist` 目录。

构建完成后如果想在本地预览部署效果：
```bash
npm run preview
```

## 🔒 鉴权流程与说明

- 用户信息及 Token (JWT) 保存在浏览器的 `localStorage` 中。
- 所有非公开 API 请求由 Axios 请求拦截器自动在 `Headers` 内挂载 `Authorization: Bearer <token>`。
- 当系统探测到 token 失效（401）时，将自动强制下线返回登录页。无足够权限（403）时，界面将进行无感知拦截提示。
