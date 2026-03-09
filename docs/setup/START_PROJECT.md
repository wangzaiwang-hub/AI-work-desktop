# 项目启动指南

## 前提条件

在启动项目之前，需要先启动数据库服务。

### 启动数据库（PostgreSQL 和 Redis）

**使用 Docker（推荐）:**

```powershell
# PowerShell
.\start-database.ps1

# 或 CMD
start-database.bat
```

这将启动：
- PostgreSQL (localhost:5432)
- Redis (localhost:6379)

**手动安装（如果不使用 Docker）:**
- 安装 PostgreSQL 15+
- 安装 Redis 7+
- 配置与 `api/.env` 中的设置匹配

## 当前状态

✅ **前端服务已启动**
- URL: http://localhost:3000
- 状态: Ready
- 进程 ID: 2

## 启动后端 API

### 方式 1：使用启动脚本（推荐）

**Windows CMD:**
```cmd
start-backend.bat
```

**Windows PowerShell:**
```powershell
.\start-backend.ps1
```

### 方式 2：手动启动

在你的终端中运行：

```powershell
cd api
python -m uv run flask run --host 0.0.0.0 --port=5001 --debug
```

**注意**: 如果 `uv` 命令不可用，使用 `python -m uv` 代替 `uv`。

## 访问应用

启动后端后，你可以访问：

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:5001
- **数据脱敏页面**: http://localhost:3000/data-masking

## 验证数据脱敏功能

1. 打开浏览器访问 http://localhost:3000
2. 登录系统
3. 在顶部导航栏中找到"数据脱敏"菜单项
4. 点击进入数据脱敏页面

**注意**: 由于后端接口尚未实现，页面会显示"暂无脱敏规则"的空状态。

## 停止服务

### 停止前端服务

在当前终端按 `Ctrl+C` 或使用以下命令：

```powershell
# 查看进程
Get-Process -Name node | Where-Object {$_.Path -like "*dify-main*"}

# 停止进程
Stop-Process -Name node -Force
```

### 停止后端服务

在运行后端的终端按 `Ctrl+C`

## 开发工作流

### 前端开发

```bash
cd web
pnpm dev          # 启动开发服务器
pnpm lint:fix     # 修复 ESLint 错误
pnpm type-check   # TypeScript 类型检查
```

### 后端开发

```bash
cd api
uv run flask run --debug                    # 启动开发服务器
uv run pytest                               # 运行测试
uv run flask db migrate -m "description"    # 创建数据库迁移
uv run flask db upgrade                     # 应用数据库迁移
```

## 下一步：实现后端接口

参考 `DATA_MASKING_IMPLEMENTATION.md` 文档实现后端接口：

1. 创建数据库模型 (`api/models/data_masking.py`)
2. 创建数据库迁移
3. 实现服务层 (`api/services/data_masking_service.py`)
4. 实现控制器 (`api/controllers/console/data_masking/rules.py`)
5. 注册路由
6. 前端取消注释 API 调用代码

## 故障排除

### 前端端口被占用

```powershell
# 查找占用 3000 端口的进程
netstat -ano | findstr :3000

# 停止进程（替换 PID）
taskkill /PID <PID> /F
```

### 后端端口被占用

```powershell
# 查找占用 5001 端口的进程
netstat -ano | findstr :5001

# 停止进程（替换 PID）
taskkill /PID <PID> /F
```

### 数据库连接错误

检查 `api/.env` 文件中的数据库配置：

```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=dify
```

### 依赖安装问题

```bash
# 前端
cd web
pnpm install

# 后端
cd api
uv sync
```

## 相关文档

- [DATA_MASKING_IMPLEMENTATION.md](./DATA_MASKING_IMPLEMENTATION.md) - 数据脱敏功能实现说明
- [AGENTS.md](./AGENTS.md) - 项目开发规范
- [web/AGENTS.md](./web/AGENTS.md) - 前端开发规范
- [api/AGENTS.md](./api/AGENTS.md) - 后端开发规范

---

**当前时间**: 2026-02-05
**项目版本**: 1.12.0
