# 📚 文档索引

本文档提供项目所有文档的快速导航。

---

## 🚀 快速开始

### 新手入门
1. 📖 [README.md](README.md) - 项目概览
2. 🏃 [快速启动指南](docs/setup/QUICK_START.md) - 5分钟快速启动
3. 🔧 [项目启动详细说明](docs/setup/START_PROJECT.md) - 完整启动流程
4. 🎯 [后端快速启动](docs/setup/QUICK_START_BACKEND.md) - 后端专用指南

### 启动脚本（Windows）
- `start-backend.bat` / `start-backend.ps1` - 启动后端服务
- `start-database.bat` / `start-database.ps1` - 启动数据库

---

## 📋 项目需求与规范

### 原始需求（中文）
- 📝 [项目需求](docs/zh-CN/项目需求.md) - 会议需求记录

### 正式功能规范
- 📂 [数据脱敏功能规范](.kiro/specs/data-masking/)
  - [需求文档](.kiro/specs/data-masking/requirements.md) - 12个详细需求
  - [设计文档](.kiro/specs/data-masking/design.md) - 技术架构和接口
  - [任务列表](.kiro/specs/data-masking/tasks.md) - 17个实现任务

---

## 🎨 UI/UX 设计

### 设计规范
- 🎨 [CheersAI 产品 UI 规范](docs/zh-CN/CheersAI产品UI规范.md) - UI 设计规范（中文）
- 🖼️ [UI 实现说明](docs/guides/CHEERSAI_UI_IMPLEMENTATION.md) - UI 实现指南
- 🎭 [主题变更说明](docs/guides/CHEERSAI_THEME_CHANGES.md) - 主题定制指南

---

## 🖥️ 桌面应用开发

### 桌面应用指南
- 💻 [CheersAI 桌面应用说明](docs/guides/CHEERSAI_DESKTOP_README.md) - 桌面应用概览
- 📊 [桌面应用总结](docs/guides/DESKTOP_APP_SUMMARY.md) - 功能总结

### Electron 构建
- ⚡ [Electron 构建指南](docs/build/ELECTRON_BUILD_GUIDE.md) - 完整构建流程
- ✅ [Electron 设置完成](docs/build/ELECTRON_SETUP_COMPLETE.md) - 设置验证

### Tauri 构建
- 🦀 [Tauri 构建指南](docs/build/TAURI_BUILD_GUIDE.md) - Rust + Tauri 构建
- 🔧 [Tauri 设置说明](docs/build/TAURI_SETUP.md) - 环境配置

---

## 🏗️ 构建与部署

### 构建指南
- 🔨 [构建说明](docs/build/BUILD_INSTRUCTIONS.md) - 通用构建指南
- 🚀 [生产环境构建](docs/build/BUILD_PRODUCTION.md) - 生产部署指南

### Docker 部署
- 🐳 [Docker 配置](docker-compose.dev.yaml) - 开发环境配置
- 📦 [Docker 说明](docker/README.md) - Docker 部署文档

---

## 💡 功能实现指南

### 核心功能
- 🔒 [数据脱敏实现](docs/guides/DATA_MASKING_IMPLEMENTATION.md) - 数据脱敏功能实现说明

---

## 👥 开发指南

### 开发规范
- 📘 [开发规范](AGENTS.md) - AI 辅助开发指南
- 🤝 [贡献指南](CONTRIBUTING.md) - 如何贡献代码
- 🤖 [Claude 使用说明](CLAUDE.md) - Claude AI 使用指南

### 模块文档
- 🔧 [后端开发指南](api/AGENTS.md) - Python/Flask 后端
- 🎨 [前端开发指南](web/AGENTS.md) - Next.js/React 前端

---

## 📊 项目状态

- ✅ [设置完成状态](docs/setup/SETUP_COMPLETE.md) - 环境配置验证
- 🎉 [成功标记](docs/setup/SUCCESS.md) - 里程碑记录

---

## 📁 文档组织

- 📚 [文档组织说明](docs/文档组织说明.md) - 完整的文档结构说明

---

## 🗂️ 目录结构

```
项目根目录/
├── README.md                    # 项目主文档
├── DOCS_INDEX.md               # 本文档（文档索引）
├── AGENTS.md                   # 开发规范
├── CONTRIBUTING.md             # 贡献指南
├── CLAUDE.md                   # Claude AI 使用说明
├── docker-compose.dev.yaml     # Docker 开发配置
├── start-*.bat/ps1             # 启动脚本
│
├── docs/                       # 文档目录
│   ├── 文档组织说明.md          # 文档结构说明
│   ├── zh-CN/                  # 中文文档
│   │   ├── 项目需求.md
│   │   └── CheersAI产品UI规范.md
│   ├── setup/                  # 设置指南
│   │   ├── QUICK_START.md
│   │   ├── QUICK_START_BACKEND.md
│   │   ├── START_PROJECT.md
│   │   ├── SETUP_COMPLETE.md
│   │   └── SUCCESS.md
│   ├── build/                  # 构建指南
│   │   ├── BUILD_INSTRUCTIONS.md
│   │   ├── BUILD_PRODUCTION.md
│   │   ├── ELECTRON_BUILD_GUIDE.md
│   │   ├── ELECTRON_SETUP_COMPLETE.md
│   │   ├── TAURI_BUILD_GUIDE.md
│   │   └── TAURI_SETUP.md
│   └── guides/                 # 功能指南
│       ├── CHEERSAI_DESKTOP_README.md
│       ├── DESKTOP_APP_SUMMARY.md
│       ├── CHEERSAI_UI_IMPLEMENTATION.md
│       ├── CHEERSAI_THEME_CHANGES.md
│       └── DATA_MASKING_IMPLEMENTATION.md
│
├── .kiro/specs/                # 功能规范
│   └── data-masking/
│       ├── requirements.md     # 需求文档
│       ├── design.md          # 设计文档
│       └── tasks.md           # 任务列表
│
├── api/                        # 后端代码
├── web/                        # 前端代码
├── docker/                     # Docker 配置
└── scripts/                    # 脚本工具
```

---

## 🔍 按主题查找文档

### 我想...

#### 启动项目
→ [快速启动指南](docs/setup/QUICK_START.md)

#### 了解需求
→ [项目需求](docs/zh-CN/项目需求.md) → [数据脱敏需求](.kiro/specs/data-masking/requirements.md)

#### 开发功能
→ [设计文档](.kiro/specs/data-masking/design.md) → [任务列表](.kiro/specs/data-masking/tasks.md)

#### 构建应用
→ [构建说明](docs/build/BUILD_INSTRUCTIONS.md) → [Electron](docs/build/ELECTRON_BUILD_GUIDE.md) / [Tauri](docs/build/TAURI_BUILD_GUIDE.md)

#### 设计 UI
→ [UI 规范](docs/zh-CN/CheersAI产品UI规范.md) → [UI 实现](docs/guides/CHEERSAI_UI_IMPLEMENTATION.md)

#### 贡献代码
→ [贡献指南](CONTRIBUTING.md) → [开发规范](AGENTS.md)

---

## 📞 获取帮助

- 📖 查看 [文档组织说明](docs/文档组织说明.md) 了解完整文档结构
- 🤝 阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与
- 🤖 参考 [AGENTS.md](AGENTS.md) 了解 AI 辅助开发流程

---

## 🔄 文档更新

本索引会随着项目发展持续更新。如发现文档链接失效或需要补充，请提交 Issue 或 PR。

**最后更新**: 2026-02-08
