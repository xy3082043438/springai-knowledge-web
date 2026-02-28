# SpringAI 企业级知识库智能问答助手

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d?logo=vue.js)](https://vuejs.org/)
[![Spring AI](https://img.shields.io/badge/Spring%20AI-1.0.0-6db33f?logo=spring)](https://spring.io/projects/spring-ai)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-Latest-409eff?logo=element-plus)](https://element-plus.org/)

一个基于 **Spring AI** 生态构建的现代企业级私人知识库问答助手。本项目采用了最前沿的 **RAG (Retrieval-Augmented Generation)** 技术栈，辅以极具科技感的 **玻璃拟态 (Glassmorphism)** UI 设计，旨在为企业提供安全、精准、高效的 AI 知识管理方案。

## 🌟 核心特性

- 🤖 **智能流式问答 (SSE Integration)**: 对接 Spring AI 生成接口，实现极速打字机式回复，支持上下文关联对话。
- 📚 **精准知识引证**: AI 对话结果附带“知识芯片”，实时展示参考的原始文档名及语义相似度评分，彻底解决回复“幻觉”问题。
- 🛠️ **全链路知识加工中心**:
  - **动态切片策略**: 支持自定义 Chunk Size、Overlap 及多种语义分隔符。
  - **内置物料清洗**: 前端集成文本预处理配置（去除空行、全角转半角、HTML/MD 功能标签清理）。
- 📂 **企业文档资产管理**: 支持 PDF、Word、TXT 格式的一站式上传、解析、向量化与生命周期管理。
- 🔒 **工业级安全基座**: 完整的 JWT 权限认证流程，对齐企业级安全审计标准。
- 💎 **高级视觉体验**: 全站采用 SpringAI 品牌色调与深度微交互动效，提供沉浸式 AI 交互体感。

## 🚀 技术栈

- **前端框架**: Vue 3 (Composition API) + Vite
- **UI 组件库**: Element Plus (定制化主题)
- **状态管理**: Pinia
- **通讯协议**: Axios (带全局拦截器) + SSE 流式传输
- **后端支持**: Spring AI (OpenAI/Ollama/DeepSeek 等 Provider)
- **向量数据库**: 支持 Milvus / PGVector / Redis (由 Spring AI 统一抽象)

## 📦 快速开始

1. **环境准备**:
   确保已安装 [Node.js](https://nodejs.org/) (v16+) 和您的 IDE 环境。

2. **安装依赖**:
   ```sh
   npm install
   ```

3. **配置环境变量**:
   在根目录创建或修改 `.env`：
   ```env
   VITE_API_BASE_URL=您的后端接口地址
   ```

4. **启动开发服务器**:
   ```sh
   npm run dev
   ```

## 🗺️ 未来路线图 (Roadmap)

- [ ] **混合检索 (Hybrid Search)**：结合语义与关键词匹配，提升生僻术语查找精度。
- [ ] **原文高亮预览**: 实现点击引证芯片，直接在侧边栏 PDF 预览中高亮定位原文。
- [ ] **多源自动化连接器**: 实现 Confluence/GitLab Wiki 的定时异步同步。
- [ ] **对话安全审计看板**: 分析企业内部问答热点与模型消耗。

> [!TIP]
> **觉得不错？** 欢迎点击右上角 Star 支持，基于 Spring AI 的更多企业级 Agent 场景正在持续更新中！
