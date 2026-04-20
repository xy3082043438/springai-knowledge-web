# SpringAI Knowledge Web

> 基于当前代码现状整理的前端重构说明文档。
> 本文档不再以“宣传文案”为目标，而是用于统一项目认知、明确问题边界、约束重构范围，并给出可执行的落地路径。

---

## 1. 项目概述

`springai-knowledge-web` 是一个基于 `Vue 3 + TypeScript + Vite + Element Plus` 的企业知识库管理前端，当前已具备以下业务能力：

- 登录鉴权与验证码登录
- 仪表盘统计与图表展示
- 智能问答与流式 SSE 响应
- 会话管理、引用分片预览、问答反馈
- 知识库文档管理、文本录入、文件上传、重建索引
- 用户、角色、系统配置、日志与反馈等后台管理能力
- 个人资料维护、头像与密码修改

当前项目已经可以运行并承载完整业务流程，但代码结构仍以“单页快速交付”风格为主，存在明显的页面职责过重、复用边界不清、领域拆分不完整、README 与真实实现脱节的问题。因此需要进行一次以“可维护性、可扩展性、一致性”为目标的工程化重构。

---

## 2. 当前技术栈

### 核心依赖

- `vue ^3.5.25`
- `typescript ^5.7.2`
- `vite ^7.2.4`
- `element-plus ^2.13.0`
- `pinia ^3.0.4`
- `vue-router ^4.6.4`
- `axios ^1.13.2`
- `echarts ^5.6.0`
- `echarts-wordcloud ^2.1.0`
- `sass ^1.97.1`

### 工程配置

- 默认开发端口：`3000`
- 本地代理前缀：`/api -> http://localhost:8080`
- Node 要求：`^20.19.0 || >=22.12.0`

启动命令：

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

---

## 3. 当前实际目录结构

```text
src/
  api/
    auth.ts
    dashboard.ts
    business/
      document.ts
      feedback.ts
      qa.ts
      session.ts
    system/
      config.ts
      log.ts
      role.ts
      user.ts
  components/
    DocumentPreview.vue
    PointClickCaptcha.vue
    SliderCaptcha.vue
    Dashboard/
      DashboardHero.vue
      DistributionPanel.vue
      EChartsPanel.vue
      MetricCards.vue
      StatusPanel.vue
      TrendPanel.vue
  layout/
    index.vue
  router/
    index.ts
  store/
    index.ts
    user.ts
  styles/
    main.scss
  types/
    api.ts
    router.d.ts
  utils/
    access.ts
    date.ts
    rbac.ts
    request.ts
  views/
    auth/Login.vue
    dashboard/index.vue
    error/Forbidden.vue
    knowledge/index.vue
    profile/index.vue
    qa/index.vue
    system/
      config/index.vue
      logs/index.vue
      roles/index.vue
      users/index.vue
```

说明：

- 当前项目已经按 `api / views / components / utils / store` 做了第一层拆分。
- 但业务域拆分还不彻底，很多页面文件同时承载了“接口调用 + 页面状态 + 业务转换 + 交互逻辑 + 样式”。
- README 之前描述了一些“理想中的模块化结构”，其中一部分成立，一部分尚未真正落地。

---

## 4. 现状评估

### 4.1 已有优点

- 已经完成 TypeScript 化，接口类型集中在 `src/types/api.ts`
- `src/api` 已按业务域初步划分
- `src/utils/request.ts` 已统一处理 token 注入、401 跳转、错误提示映射
- 路由守卫与用户信息拉取逻辑已经具备基本闭环
- Dashboard 已拆出多个展示型组件，具备继续抽象的基础
- QA、知识库、RBAC、日志模块的业务能力比较完整
- 全局样式和页面视觉风格已有统一倾向

### 4.2 主要问题

#### 1. 页面文件过大，职责混杂

典型页面：

- `src/views/qa/index.vue`
- `src/views/knowledge/index.vue`
- `src/views/system/roles/index.vue`
- `src/views/dashboard/index.vue`
- `src/views/profile/index.vue`

这些页面通常同时负责：

- 远程数据请求
- 表单状态维护
- 数据转换和格式化
- 弹窗开关控制
- 权限判断
- 视图布局与大量局部样式

结果是：

- 文件阅读成本高
- 修改局部功能容易误伤整页行为
- 单测和联调成本都偏高

#### 2. 领域逻辑散落在页面内部

例如：

- QA 页中包含消息流拼接、会话切换、反馈提交、分片预览、错误兜底
- 知识库页中包含文件格式校验、表单校验、上传逻辑、状态映射、容量格式化
- Dashboard 页中包含大量统计计算、时间格式拼装、聚合逻辑

这些逻辑应逐步迁移到：

- `composables`
- `services`
- `adapters`
- `constants`

而不应长期堆积在 SFC 内部。

#### 3. 状态管理偏轻，跨页面状态边界不清

当前 `Pinia` 只使用了 `user store`，其他模块基本都在页面内自管状态。问题包括：

- 用户信息、权限信息、菜单可见性依赖关系分散
- QA 会话和消息状态没有独立 store/composable
- 系统配置、角色列表、文档列表等缺少统一缓存策略

#### 4. 权限控制存在双轨实现

当前权限控制同时存在两套思路：

- 路由和布局菜单层主要按角色控制，核心是 `ADMIN`
- 局部页面又会读取 `permissions` 做细粒度按钮可用性判断

这说明：

- 当前 RBAC 能力是“角色控制为主，权限码控制为辅”
- 需要统一约定权限模型，否则后续维护时容易出现页面可见但按钮不可用、菜单隐藏但接口仍可调等不一致行为

#### 5. 组件层级仍偏浅，可复用单元不足

虽然 Dashboard 已有拆分，但整体上仍缺少以下层次：

- 页面容器组件
- 领域表单组件
- 列表工具栏组件
- 空状态 / 加载状态 / 错误状态组件
- 复用型弹窗组件

例如：

- 用户管理、角色管理、系统配置、日志页头都存在重复结构
- 知识库页多个对话框逻辑可继续拆分
- QA 页的侧栏、消息项、输入区、预览抽屉可进一步独立

#### 6. 样式组织仍以页面内 `scoped style` 为主

优点是局部迭代快，但长期问题是：

- 页面风格变量沉淀不足
- 设计 token 分散
- 主题能力弱
- 公共页面结构样式复用较差

#### 7. README 与代码现状不一致

原 README 更偏产品介绍，缺少：

- 当前实现边界
- 技术约束
- 重构目标
- 模块迁移步骤
- 验收标准

这也是本次重构 README 的直接原因。

---

## 5. 重构目标

本次重构不以“大改 UI”或“重写一遍”为目标，而以以下四点为核心：

### 5.1 结构清晰

让每个模块都能回答清楚三件事：

- 页面入口在哪里
- 业务逻辑放在哪里
- 复用组件放在哪里

### 5.2 职责单一

目标拆分原则：

- `views` 负责页面编排
- `components` 负责展示与交互单元
- `composables` 负责页面级状态与行为封装
- `api` 负责接口访问
- `types` 负责协议类型
- `utils` 只保留真正通用的无业务工具

### 5.3 权限统一

统一角色、权限码、路由、菜单、按钮四层之间的关系，避免多套判断标准并存。

### 5.4 便于持续演进

后续如果增加：

- 文档分类
- 多知识库空间
- 更细粒度权限
- 模型参数面板
- 多轮会话管理增强

应尽量做到“局部扩展”，而不是“修改整页”。

---

## 6. 建议的目标目录结构

建议从“按技术层拆分”逐步过渡到“按领域 + 公共层拆分”：

```text
src/
  api/
    modules/
      auth.ts
      dashboard.ts
      document.ts
      feedback.ts
      qa.ts
      session.ts
      config.ts
      log.ts
      role.ts
      user.ts
  app/
    router/
    store/
    guards/
  components/
    common/
      PageHeader.vue
      PageCard.vue
      StatusTag.vue
      EmptyState.vue
      AsyncSection.vue
    business/
      document/
      qa/
      user/
      role/
      dashboard/
  composables/
    useAuth.ts
    useDashboard.ts
    useKnowledge.ts
    useQaChat.ts
    useQaSessions.ts
    useRoleForm.ts
    useUserForm.ts
  constants/
    permissions.ts
    document.ts
    qa.ts
    system.ts
  layouts/
    AppLayout.vue
  modules/
    auth/
      pages/
      components/
      composables/
    dashboard/
      pages/
      components/
      adapters/
    knowledge/
      pages/
      components/
      composables/
    qa/
      pages/
      components/
      composables/
    system/
      users/
      roles/
      logs/
      config/
    profile/
      pages/
      components/
  styles/
    tokens.scss
    mixins.scss
    element-overrides.scss
    main.scss
  types/
    api.ts
    domain.ts
  utils/
    date.ts
    download.ts
    message.ts
    request.ts
    role.ts
```

说明：

- 如果暂时不想做完整领域化迁移，最少也应先引入 `composables/` 和 `components/common/`。
- 不建议一次性重排所有目录，优先做“增量迁移”。

---

## 7. 分模块重构建议

### 7.1 路由与布局

当前现状：

- 路由集中在 `src/router/index.ts`
- 布局、菜单、头部、用户下拉都在 `src/layout/index.vue`

建议：

- 把菜单配置抽离为独立配置文件
- 路由 `meta.roles` 与菜单权限规则统一复用一份源数据
- 布局拆分为 `Sidebar`、`Topbar`、`UserDropdown`、`AppLogo`
- 页面切换动画和布局样式从布局组件中继续剥离

### 7.2 鉴权模块

当前现状：

- `userStore` 已承担 token、用户信息和登录退出
- 401 逻辑主要放在请求拦截器中

建议：

- 增加 `useAuth` 或 `auth service`，统一处理登录态恢复
- 将 `localStorage/sessionStorage` 操作封装，避免散落在路由、请求、登录页
- 明确“是否已拉取用户信息”的状态标记，减少重复 `ensureUserInfo()`

### 7.3 Dashboard

当前现状：

- 页面已拆出多个组件
- 但统计聚合、数据兜底、日期处理仍在 `views/dashboard/index.vue`

建议：

- 新增 `useDashboard.ts`
- 把文档状态聚合、角色分布、问答趋势、指标卡生成迁出页面
- 组件只接收格式化后的 ViewModel
- 将图表 option 构建逻辑放入独立 `adapters`

### 7.4 QA 模块

当前现状：

- `src/views/qa/index.vue` 负责会话列表、历史消息、流式回答、反馈、推荐问题、分片预览
- 是当前最典型的“大而全页面”之一

建议：

- 拆成以下组件：
  - `QaSessionSidebar`
  - `QaMessageList`
  - `QaMessageItem`
  - `QaComposer`
  - `QaChunkPreviewDrawer`
  - `QaFeedbackDialog`
- 抽出以下 composable：
  - `useQaSessions`
  - `useQaChat`
  - `useQaFeedback`
- 把 SSE 解析逻辑从页面移到独立 service/composable
- 为消息结构定义专用 `view-model type`，不要直接用页面内匿名接口长期承载

### 7.5 知识库模块

当前现状：

- 列表、搜索、文本录入、上传文件、编辑、重建索引、预览入口都集中在一个页面
- `DocumentPreview.vue` 已经是一个不错的拆分起点

建议：

- 页面拆分为：
  - `KnowledgeToolbar`
  - `KnowledgeTable`
  - `KnowledgeCreateDialog`
  - `KnowledgeUploadDialog`
  - `KnowledgeEditDialog`
- 把文件格式判断、大小格式化、状态标签映射移到 `constants/document.ts` 或 `utils/document.ts`
- 把上传表单状态收敛到 `useKnowledgeUpload`
- 把文本创建、编辑、重索引等操作各自封装，减少页面中的流程判断

### 7.6 用户 / 角色 / 系统配置 / 日志

当前现状：

- 四个后台页结构类似，但尚未提取公共列表页骨架
- 角色页权限面板设计较完整，但逻辑仍在页面内

建议：

- 提取公共 `PageHeader`、`CrudTableToolbar`、`ExportButton`
- 角色模块单独抽 `useRoleForm`
- 用户模块单独抽 `useUserForm`
- 日志模块拆出各 tab 的查询参数与导出逻辑
- 系统配置模块把隐藏 key、编辑态、提交逻辑从页面移出

### 7.7 个人中心

当前现状：

- 头像上传与密码修改逻辑都放在页面内
- 页面承担展示和表单行为两类职责

建议：

- 拆分 `ProfileAvatarDialog`、`ProfilePasswordDialog`
- 抽出上传校验和密码表单规则
- 明确头像上传接口能力边界，目前页面直接写死 `action="/api/upload"`，需要统一规范

---

## 8. 权限模型重构建议

当前项目已经同时使用：

- 角色：如 `ADMIN`
- 权限码：如 `USER_WRITE`、`ROLE_WRITE`、`DOC_WRITE`

建议统一为以下原则：

### 8.1 路由层

- 路由可见性由 `meta.permissions` 或 `meta.roles` 统一控制
- 不再由页面内部各自解释访问规则

### 8.2 菜单层

- 菜单配置与路由配置共享同一套权限元数据
- 禁止布局内手写一套、路由里再写一套

### 8.3 按钮层

- 统一使用 `can(permission)` / `hasRole(role)` 形式判断
- 页面不直接拼字符串判断权限

### 8.4 文档可见性

- 当前文档使用 `allowedRoles` 控制可见范围
- 后续若要升级为真正细粒度授权，建议保留兼容层，不要直接在页面中扩散更多特判

---

## 9. 样式与设计系统建议

### 当前情况

- 已有全局颜色变量和基础 Element Plus 覆盖
- 多数页面使用 `scoped` 样式独立实现视觉效果
- 视觉统一性尚可，但缺少更系统的 token 分层

### 建议做法

- 将主题变量拆分到 `tokens.scss`
- 将 Element Plus 覆盖集中到 `element-overrides.scss`
- 将卡片、页头、弹窗、工具栏等共性样式沉淀为 mixin 或公共类
- 统一以下设计 token：
  - 色板
  - 阴影
  - 圆角
  - 页面间距
  - 标题层级
  - 状态色

目标不是“减少样式”，而是“减少重复定义”。

---

## 10. 类型与接口层重构建议

当前项目的 `src/types/api.ts` 已经集中定义了后端协议，这是优点；但仍建议继续分层：

- `api.ts` 保留纯接口协议类型
- `domain.ts` 定义前端领域模型
- `view.ts` 或组件内局部类型定义页面展示模型

例如：

- `QaResponse` 是接口类型
- `ChatMessage` 应是前端消息模型
- `DashboardCardViewModel` 应是仪表盘展示模型

避免把接口响应直接穿透到所有 UI 组件。

---

## 11. 推荐的重构实施顺序

建议按风险最低、收益最高的顺序推进。

### 第一阶段：低风险整理

- 重写 README 与开发约定
- 新增 `composables/` 目录
- 新增 `components/common/` 目录
- 提取页面通用头部、状态标签、空态组件
- 抽离常量和映射逻辑

### 第二阶段：中风险页面解耦

- 重构 QA 模块
- 重构知识库模块
- 重构 Dashboard 数据组装逻辑
- 拆分用户/角色/日志/系统配置的公共列表骨架

### 第三阶段：权限与状态统一

- 统一菜单、路由、按钮权限模型
- 引入更清晰的 auth / permission composable
- 整理缓存策略与跨页面状态管理

### 第四阶段：样式体系沉淀

- 整理全局 token
- 合并重复页面样式模式
- 清理局部样式中重复的卡片、页头、表单风格定义

---

## 12. 验收标准

重构完成后，至少应满足以下标准：

### 结构标准

- 单个页面文件不再长期承载大段业务流程代码
- 页面主文件重点用于“组装”，不再负责全部细节
- 公共组件与领域组件边界清晰

### 可维护性标准

- 同类页面具备一致的头部、表格、弹窗组织方式
- 权限判断方式统一
- 常量、标签映射、状态转换不再散落在多个页面中

### 工程标准

- `npm run build` 通过
- 类型检查通过
- 无明显重复代码块继续堆积在页面入口

### 文档标准

- README 与实际目录一致
- 新增模块时有明确放置位置
- 开发者可以快速判断一段逻辑应归属到哪一层

---

## 13. 当前不建议做的事情

以下事项不建议在本轮重构中同时推进，否则容易把“结构优化”变成“全面重写”：

- 不建议同步切换 UI 框架
- 不建议同步引入过重的状态管理方案
- 不建议一次性把所有页面改成完全不同的视觉语言
- 不建议在没有后端配合的情况下重定义接口协议
- 不建议把目录重排作为第一步，而忽视逻辑拆分本身

---

## 14. 本项目当前结论

这个项目不是“从零开始设计”的问题，而是“已有完整业务能力，但缺少第二阶段工程化整理”的问题。

因此本次 README 的定位是：

- 如实反映当前项目实现
- 明确哪些部分已经具备基础
- 明确哪些部分是重构重点
- 为后续逐模块改造提供统一参照

如果按本文档执行，推荐优先从以下两个模块入手：

1. `src/views/qa/index.vue`
2. `src/views/knowledge/index.vue`

这两个页面承担了最多的交互、状态和异步流程，重构收益最高，也最能验证新的目录和职责划分是否合理。
