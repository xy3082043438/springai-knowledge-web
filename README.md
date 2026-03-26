# springai-knowledge-web

`springai-knowledge-web` 是一个基于 `Vue 3 + Vite + TypeScript + Element Plus` 的企业知识库问答管理台前端，用于对接后端 Spring AI / RAG 服务。

当前仓库只包含前端控制台，不包含 Java 后端源码。前端已覆盖登录、问答、知识库管理、用户管理、日志反馈、系统配置和个人信息等核心页面，并通过 `/api/**` 与后端联调。

## 当前能力

### 页面与功能

| 模块 | 当前实现 |
| --- | --- |
| 登录 | 用户名密码登录，登录后保存 JWT 到 `localStorage` |
| 仪表盘 | 展示文档数、问答数、用户数、系统健康状态 |
| 智能问答 | 提问、展示回答、显示检索来源、查看文档分片、提交问答反馈 |
| 知识库管理 | 文档列表、搜索、文本录入、上传 `PDF/DOCX/PPTX/XLSX/TXT/MD/HTML/CSV`、编辑标题/角色、删除、单条/全量重索引 |
| 用户管理 | 用户列表、新增用户、编辑用户名和角色 |
| 日志与反馈 | 操作日志、问答日志、用户反馈分页查询，支持时间范围过滤 |
| 系统配置 | 配置列表、在线编辑配置值、刷新全局配置 |
| 个人信息 | 展示当前登录用户的基础资料 |

### 当前边界

- 这是纯前端仓库，后端服务需要单独启动。
- 当前没有独立的“角色管理”页面，但前端已接入角色列表接口，并在用户管理、知识库管理中复用角色数据。
- 当前没有 `lint`、`test` 脚本，构建校验以 `vue-tsc + vite build` 为主。
- 当前代理地址直接写在 `vite.config.ts`，没有拆分到 `.env` 文件。

## 技术栈

- Vue 3
- Vite 7
- TypeScript 5
- Element Plus
- Pinia
- Vue Router
- Axios
- Sass

## 项目结构

```text
src
  api/          按业务模块封装接口
  layout/       管理台整体布局
  router/       路由与登录守卫
  store/        Pinia 状态管理
  styles/       全局样式
  types/        接口类型定义
  utils/        Axios 请求封装与拦截器
  views/        页面实现
public/
  logo.svg      项目 logo
```

## 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm 使用 Node 自带版本即可

## 本地启动

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 构建与预览

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

`npm run build` 会先执行 `vue-tsc` 类型检查，再执行 Vite 打包。

## 后端联调说明

开发代理配置位于 `vite.config.ts`：

- 前端请求路径：`/api/**`
- 代理目标：`http://localhost:8080`
- 前端端口：`3000`

如果后端不在 `8080` 端口运行，需要手动修改 `vite.config.ts` 中的 `server.proxy`。

### 当前前端已接入的后端接口

#### 认证

- `POST /api/auth/login`
- `POST /api/auth/logout`

#### 用户与角色

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/roles`
- `GET /api/roles/:id`
- `POST /api/roles`
- `PATCH /api/roles/:id`

#### 知识库文档

- `GET /api/documents`
- `GET /api/documents/:id`
- `POST /api/documents`
- `POST /api/documents/upload`
- `POST /api/documents/:id/file`
- `PATCH /api/documents/:id`
- `DELETE /api/documents/:id`
- `POST /api/documents/search`
- `POST /api/documents/reindex`
- `POST /api/documents/:id/reindex`
- `GET /api/documents/chunks/:chunkId`

#### 问答与反馈

- `POST /api/qa`
- `POST /api/feedback`
- `GET /api/feedback`

#### 日志与系统配置

- `GET /api/logs/qa`
- `GET /api/logs/operations`
- `GET /api/config`
- `GET /api/config/:key`
- `PUT /api/config/:key`
- `POST /api/config/refresh`
- `GET /api/system/boundary`
- `GET /api/system/status`

## 鉴权与请求约定

- JWT token 保存在 `localStorage.token`
- Axios 请求会自动附加 `Authorization: Bearer <token>`
- 当接口返回 `401` 且不是登录接口时，前端会清理 token 并跳转 `/login`
- 当接口返回 `403` 时，前端保留当前登录态，并提示“权限不足”
- Axios 超时时间当前为 `30000ms`

## 页面说明

### 仪表盘

- 通过文档、用户、问答日志、系统状态接口汇总出首页统计卡片

### 智能问答

- 问答结果支持展示引用来源
- 点击来源可查看文档分片内容、页码、偏移量等信息
- 每条回答在有 `qaLogId` 时支持点赞/点踩反馈

### 知识库管理

- 支持文本录入并绑定允许访问的角色
- 支持上传 `PDF/DOCX/PPTX/XLSX/TXT/MD/HTML/CSV` 文件并绑定允许访问的角色
- 支持按关键字搜索文档
- 支持编辑文档标题与允许角色
- 支持删除文档、单条重索引、全量重索引

### 用户管理

- 支持新增用户
- 支持编辑已有用户的用户名与角色
- 角色选项来自后端角色接口

### 日志与反馈

- 操作日志、问答日志、用户反馈分 tab 展示
- 支持按时间范围查询
- 三类数据均为后端分页接口

### 系统配置

- 支持在线修改配置值
- 支持刷新全局配置
- 前端会隐藏部分底层参数键，不直接在页面展示

## 常见问题

### 页面打开后立即跳回登录页

- 检查后端是否正常返回 JWT
- 检查接口是否返回了 `401`
- 检查浏览器中是否存在 `localStorage.token`

### 页面数据为空或接口 404

- 确认后端已启动
- 确认后端端口是否为 `8080`
- 确认前端请求是否通过 `/api/**` 发出

### 构建失败

- 先执行 `npm install`
- 再执行 `npm run build`
- 按 `vue-tsc` 输出修复 TypeScript 报错

## 后续可继续补强的方向

- 增加独立的角色管理页面
- 将代理地址与基础配置迁移到 `.env`
- 增加 lint、单元测试和 E2E 测试
- 补充部署说明、截图和接口示例
