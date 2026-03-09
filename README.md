# CheersAI

基于 [Dify](https://github.com/langgenius/dify) 开源平台的定制版本，新增数据脱敏功能和 Tauri 桌面应用支持。

## 功能特性

- Dify 全部原生功能（AI 工作流、RAG、Agent、模型管理等）
- 数据脱敏模块：可配置规则的敏感数据脱敏，支持 Markdown 文件处理
- Tauri 桌面应用：一键打包为 Windows 桌面 exe
- 脱敏文件本地存储：通过 Tauri 后端直接写入本地沙箱目录

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Python 3.12 + Flask + PostgreSQL + Redis + Celery |
| 前端 | Next.js + TypeScript + React + Tailwind CSS |
| 桌面 | Tauri 2 (Rust) |
| 向量库 | Weaviate |
| 包管理 | uv (Python) / pnpm (Node.js) |

## 快速启动

详细步骤见 [QUICK_START.md](QUICK_START.md)。

### 环境要求

- Docker Desktop
- Node.js >= 24 + pnpm >= 10
- Python 3.12 + uv
- Rust（打包桌面应用时需要）

### 启动命令

```powershell
# 1. 一键启动后端（Docker 服务 + 数据库迁移 + Flask API）
.\start-backend.ps1

# 2. 启动前端（另开终端）
cd web
pnpm dev
```

### 访问

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 API | http://localhost:5001 |
| 数据脱敏 | http://localhost:3000/data-masking |

登录：`1@qq.com` / `password123`

## 桌面应用

```bash
cd web
pnpm tauri build
```

产物位置：
- exe：`web/src-tauri/target/release/app.exe`
- 安装包：`web/src-tauri/target/release/bundle/nsis/CheersAI_1.12.0_x64-setup.exe`

桌面应用会自动启动前端 dev server，关闭时自动清理进程。

## 数据脱敏模块

位于 `web/app/(commonLayout)/data-masking/`，包含四个功能标签页：

| 标签 | 功能 |
|------|------|
| 脱敏规则 | 创建/编辑/删除脱敏规则，内置 7 种模板（手机号、邮箱、身份证等） |
| 沙箱配置 | 配置本地沙箱目录，脱敏文件将写入该目录 |
| 文件脱敏 | 选择 .md 文件 → 选择规则 → 预览 → 执行脱敏并下载 |
| 文件管理 | 查看/预览/下载/删除已脱敏的文件（Tauri 环境读取本地目录） |

## 项目结构

```
CheersAI/
├── start-backend.ps1/.bat      # 一键启动后端
├── docker-compose.dev.yaml     # Docker 服务（PG、Redis、Weaviate、Plugin）
├── scripts/                    # 工具脚本
├── api/                        # 后端 Flask API
├── web/                        # 前端 Next.js
│   ├── app/components/data-masking/  # 数据脱敏 UI 组件
│   ├── lib/data-masking/             # 数据脱敏核心逻辑
│   └── src-tauri/                    # Tauri 桌面应用
├── QUICK_START.md              # 启动说明
├── SETUP_GUIDE.md              # 环境搭建指南
└── PROJECT_STATUS.md           # 项目状态
```

## Docker 服务

| 服务 | 端口 | 说明 |
|------|------|------|
| PostgreSQL | 5432 | 主数据库 |
| Redis | 6700 | 缓存/消息队列 |
| Weaviate | 8080 | 向量数据库 |
| Plugin Daemon | 5002 | 插件服务 |

## 开发命令

```bash
# 前端
cd web
pnpm dev              # 开发服务器
pnpm lint:fix         # 代码检查
pnpm type-check:tsgo  # 类型检查
pnpm test data-masking # 数据脱敏测试
pnpm tauri build      # 打包桌面应用

# 后端
cd api
uv run flask run --host 0.0.0.0 --port 5001 --debug
uv run pytest         # 运行测试
uv run flask db upgrade  # 数据库迁移
```

## 停止服务

```bash
# Ctrl+C 停止前后端进程
# 停止 Docker 服务
docker-compose -f docker-compose.dev.yaml down
```

## 基于

[Dify](https://github.com/langgenius/dify) - 开源 LLM 应用开发平台，Apache 2.0 协议。
