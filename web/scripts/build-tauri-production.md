# Tauri 生产打包说明

## 当前问题

Tauri 打包遇到以下技术限制：

### 1. Next.js 服务器端功能依赖
应用大量使用了 Next.js 服务器端功能：
- `cookies()` API
- 动态路由 `[appId]`, `[datasetId]` 等
- 服务器端渲染 (SSR)
- API 路由

### 2. 静态导出不可行
Tauri 默认需要静态 HTML 文件，但：
- `next export` 不支持服务器端功能
- 强制静态导出会导致大量页面无法工作

### 3. 可能的解决方案

#### 方案 A：嵌入 Next.js 服务器（推荐但复杂）
在 Tauri 中启动 Next.js 服务器：

**优点**：
- 保留所有功能
- 真正的独立应用

**缺点**：
- 需要打包 Node.js 运行时
- 需要修改 Rust 代码启动 Node 进程
- 打包体积大（~150MB）
- 实现复杂度高

**实现步骤**：
1. 使用 `pkg` 或 `nexe` 将 Next.js 打包成可执行文件
2. 在 Tauri 的 Rust 代码中启动 Next.js 进程
3. Tauri WebView 连接到本地服务器

#### 方案 B：重构为静态应用（工作量大）
移除所有服务器端依赖：

**优点**：
- 打包简单
- 体积小

**缺点**：
- 需要重构大量代码
- 改变应用架构
- 工作量巨大（估计 2-4 周）

#### 方案 C：使用开发模式（当前方案）
仅在开发模式下使用 Tauri：

**优点**：
- 无需修改代码
- 功能完整
- 立即可用

**缺点**：
- 需要手动启动服务
- 不是真正的独立应用

## 当前状态

✅ **开发模式可用**：
```bash
.\start-tauri-dev.ps1
```

❌ **生产打包不可用**：
- 技术限制
- 需要选择并实现上述方案之一

## 推荐方案

### 短期（当前）
使用开发模式进行开发和测试：
- 功能完整
- 开发体验好
- 适合内部使用

### 中期
部署 Web 版本：
- 使用 Docker 部署
- 用户通过浏览器访问
- 无需桌面应用打包

### 长期（如果确实需要桌面应用）
实现方案 A（嵌入 Next.js 服务器）：
1. 研究 `tauri-plugin-shell` 启动 Node 进程
2. 使用 `@vercel/ncc` 或 `pkg` 打包 Next.js
3. 在 Tauri 资源中包含 Node 运行时
4. 修改 Rust 代码管理 Next.js 进程生命周期

预计工作量：3-5 天

## 参考资源

- [Tauri + Next.js SSR 讨论](https://github.com/tauri-apps/tauri/discussions/3725)
- [tauri-plugin-shell](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/shell)
- [pkg - Node.js 打包工具](https://github.com/vercel/pkg)
- [Electron 替代方案对比](https://github.com/tauri-apps/tauri/discussions/2948)

## 结论

**Tauri 生产打包暂不可行**，建议：
1. 继续使用开发模式进行开发
2. 部署 Web 版本供用户使用
3. 如果必须要桌面应用，需要投入额外时间实现嵌入式服务器方案
