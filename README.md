# springai-knowledge-web 前端

基于 Vue 3 + Vite + TypeScript 的知识库问答管理系统前端工程，对接后端 `Spring AI` 服务。

## 技术栈

- Vue 3
- Vite 7
- TypeScript
- Element Plus
- Pinia
- Vue Router
- Axios

## 功能模块

- 登录鉴权（JWT）
- 仪表盘
- 智能问答
- 知识库管理
- 用户管理
- 日志与反馈
- 系统配置

## 目录结构

```text
src
  api/          接口定义
  layout/       页面布局
  router/       路由与守卫
  store/        状态管理
  styles/       全局样式
  types/        类型定义
  utils/        工具函数（含 Axios 封装）
  views/        页面模块
```

## 环境要求

- Node.js: `^20.19.0 || >=22.12.0`
- npm: 建议使用 Node 自带的 npm 最新稳定版本

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

默认访问地址：`http://localhost:3000`

## 后端联调说明

开发环境已在 `vite.config.ts` 配置代理：

- 前端请求 `/api/**`
- 代理到 `http://localhost:8080`

因此本地联调时请确保后端服务运行在 `8080` 端口；如果端口不同，请修改 `vite.config.ts` 中的 `server.proxy`。

## 构建与预览

构建生产包：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

`build` 命令会先执行 `vue-tsc` 类型检查，再执行 Vite 打包。

## 鉴权与请求约定

- Token 从 `localStorage` 的 `token` 字段读取
- 请求头自动携带：`Authorization: Bearer <token>`
- 当接口返回 `401/403` 时，前端会清理 token 并跳转登录页

## 常见问题

1. 页面空白或接口 404

确认后端是否启动，且 `/api` 代理目标是否正确。

2. 频繁跳转登录页

检查 token 是否过期，或后端是否返回 `401/403`。

3. 构建失败

先执行 `npm install`，再检查 TypeScript 报错信息并修复后重试。
