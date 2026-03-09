# CheersAI Tauri 桌面应用设置指南

## 快速开始

### 1. 启动开发环境

使用一键启动脚本：

```bash
# PowerShell（推荐）
.\start-tauri-dev.ps1

# CMD
start-tauri-dev.bat
```

脚本会自动启动所有必要的服务并打开 Tauri 桌面应用。

### 2. 手动启动（如果自动脚本失败）

#### 步骤 1：启动数据库服务
```bash
.\start-database.ps1
```

等待所有容器启动完成（约 10 秒）。

#### 步骤 2：启动后端 API
```bash
.\start-backend.ps1
```

等待后端启动完成，看到 "Running on http://0.0.0.0:5001" 消息。

#### 步骤 3：启动前端开发服务器
```bash
cd web
pnpm dev
```

等待前端编译完成，看到 "Ready in X ms" 消息。

#### 步骤 4：启动 Tauri（新终端窗口）
```bash
cd web
pnpm run dev:tauri
```

首次启动会编译 Rust 代码，需要 5-10 分钟。后续启动会快很多。

## 系统要求

### 必需软件

- ✅ Node.js 24+
- ✅ pnpm 10+
- ✅ Rust 1.70+
- ✅ Docker Desktop
- ✅ Python 3.11+ (后端)
- ✅ uv (Python 包管理器)

### Windows 特定要求

- Visual Studio Build Tools 或 Visual Studio 2019+
- Windows 10 SDK

### 检查安装

```bash
node --version    # 应该显示 v24.x.x
pnpm --version    # 应该显示 10.x.x
rustc --version   # 应该显示 1.x.x
docker --version  # 应该显示 Docker version
```

## 服务端口

- **前端开发服务器**: http://localhost:3000
- **后端 API**: http://localhost:5001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6700
- **Weaviate**: localhost:8080
- **Plugin Daemon**: localhost:5002

## 开发工作流

### 修改前端代码

1. 编辑 `web/` 目录下的文件
2. 保存后自动热重载
3. Tauri 窗口会自动刷新

### 修改后端代码

1. 编辑 `api/` 目录下的文件
2. 后端会自动重启（Flask debug 模式）
3. 刷新 Tauri 窗口查看更改

### 修改 Tauri/Rust 代码

1. 编辑 `web/src-tauri/src/` 目录下的文件
2. 停止 Tauri（Ctrl+C）
3. 重新运行 `pnpm run dev:tauri`

## 调试

### 前端调试

在 Tauri 窗口中按 **F12** 打开开发者工具。

### 后端调试

查看后端终端输出，或访问：
- API 文档: http://localhost:5001/swagger-ui.html

### 数据库调试

```bash
# 查看容器状态
docker-compose -f docker-compose.dev.yaml ps

# 查看日志
docker-compose -f docker-compose.dev.yaml logs -f

# 连接到 PostgreSQL
docker exec -it dify-postgres psql -U postgres -d dify
```

## 常见问题

### Q: Tauri 编译失败？

**A:** 确保安装了 Visual Studio Build Tools：
```bash
# 下载并安装
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
```

### Q: 前端无法连接到后端？

**A:** 检查后端是否运行：
```bash
curl http://localhost:5001/health
```

### Q: 数据库连接失败？

**A:** 重启数据库服务：
```bash
docker-compose -f docker-compose.dev.yaml down
.\start-database.ps1
```

### Q: Tauri 窗口显示空白？

**A:** 
1. 确保前端开发服务器正在运行
2. 检查浏览器控制台（F12）是否有错误
3. 尝试在浏览器中访问 http://localhost:3000

### Q: 首次启动很慢？

**A:** 这是正常的：
- Rust 编译需要 5-10 分钟（仅首次）
- 数据库初始化需要 10-20 秒
- 后端启动需要 10-15 秒
- 前端编译需要 30-60 秒

后续启动会快很多（1-2 分钟）。

## 生产构建

### 当前状态

⚠️ **生产打包暂不可用**

原因：应用使用了大量 Next.js 服务器端功能（cookies、动态路由等），无法直接静态导出。

### 解决方案

如需生产打包，需要实现以下方案之一：

**方案 A：嵌入 Next.js 服务器**（推荐）
- 在 Tauri 中启动 Next.js 服务器进程
- 打包 Node.js 运行时
- 预计工作量：3-5 天
- 详见：`web/scripts/build-tauri-production.md`

**方案 B：重构为静态应用**
- 移除所有服务器端依赖
- 工作量巨大（2-4 周）
- 不推荐

**方案 C：使用 Web 部署**（当前推荐）
- 使用 Docker 部署完整应用
- 用户通过浏览器访问
- 无需桌面应用打包

## 性能优化

### Tauri vs Electron

| 特性 | Tauri | Electron |
|------|-------|----------|
| 安装包大小 | ~5MB | ~100MB |
| 内存占用 | ~50MB | ~200MB |
| 启动速度 | 快 | 中等 |
| 跨平台 | ✅ | ✅ |
| 热重载 | ✅ | ✅ |

### 开发体验

- ✅ 热重载速度快
- ✅ 调试工具完整
- ✅ 支持所有 Next.js 功能
- ⚠️ 首次编译较慢

## 下一步

1. 阅读 [web/TAURI_README.md](web/TAURI_README.md) 了解更多细节
2. 查看 [Tauri 官方文档](https://tauri.app/)
3. 探索 `web/src-tauri/` 目录了解 Rust 代码

## 获取帮助

- 查看项目 README.md
- 检查 GitHub Issues
- 阅读 Tauri 官方文档
