# Tauri 桌面应用开发指南

## 概述

Tauri 是一个轻量级的桌面应用框架，相比 Electron 有以下优势：
- 更小的安装包体积（约 3-5MB vs Electron 的 50-100MB）
- 更低的内存占用
- 使用系统原生 WebView
- 支持 Next.js 的完整功能（无需静态导出）

## 开发模式

### 步骤 1：启动后端

```powershell
# 在项目根目录，一键启动 Docker 服务 + Flask API
.\start-backend.ps1
```

### 步骤 2：启动前端 + Tauri

```bash
cd web
pnpm dev          # 终端 1: 启动前端开发服务器
pnpm run dev:tauri # 终端 2: 启动 Tauri 桌面应用
```

## 生产构建

### 注意事项

由于应用使用了大量服务器端功能（cookies、动态路由等），Tauri 的生产构建需要特殊处理。

### 当前限制

标准的 `pnpm run build:tauri` 会尝试使用静态导出，这会失败，因为：
- 多个页面使用了 `cookies()` API
- 存在动态路由
- 需要 Next.js 服务器端渲染

### 推荐方案

1. **开发模式**（推荐）
   - 使用 `dev:tauri` 进行开发和测试
   - 功能完整，无限制

2. **Web 版本**
   - 部署为 Web 应用
   - 用户通过浏览器访问

3. **自定义打包**（高级）
   - 将 Next.js 服务器打包进 Tauri
   - 需要修改 Rust 代码启动 Node.js 进程
   - 工作量较大

## 配置文件

- `src-tauri/tauri.conf.json` - Tauri 主配置
- `src-tauri/Cargo.toml` - Rust 依赖
- `src-tauri/src/main.rs` - Rust 主程序
- `src-tauri/icons/` - 应用图标

## 开发工具

### 热重载

开发模式下，前端代码修改会自动重载，无需重启 Tauri。

### 调试

- 前端：在 Tauri 窗口中按 F12 打开开发者工具
- 后端：查看后端 API 终端输出
- Rust：使用 `cargo` 命令进行调试

## 常见问题

### Q: Tauri 窗口显示空白？
A: 确保前端开发服务器正在运行（http://localhost:3000）

### Q: 无法连接到后端 API？
A: 检查后端服务是否运行在 http://localhost:5001

### Q: 数据库连接失败？
A: 运行 `docker-compose -f docker-compose.dev.yaml ps` 检查服务状态

### Q: 如何生成生产版本？
A: 当前推荐使用开发模式或 Web 版本。生产打包需要额外的工作。

## 性能优化

- Tauri 使用系统 WebView，性能接近原生应用
- 首次启动可能需要 10-15 秒等待服务启动
- 后续启动会更快（服务已在运行）

## 相关文档

- [Tauri 官方文档](https://tauri.app/)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 README](../README.md)
