# 后端快速启动指南

## 步骤 1: 启动数据库服务

在项目根目录运行：

```powershell
.\start-database.ps1
```

或使用 CMD：

```cmd
start-database.bat
```

这将启动 PostgreSQL 和 Redis 容器。

## 步骤 2: 启动后端 API

在项目根目录运行：

```powershell
.\start-backend.ps1
```

或使用 CMD：

```cmd
start-backend.bat
```

或手动运行：

```powershell
cd api
python -m uv run flask run --host 0.0.0.0 --port=5001 --debug
```

## 验证

访问 http://localhost:5001 应该能看到 API 响应。

## 常见问题

### 1. Docker 未安装

如果没有 Docker，需要手动安装 PostgreSQL 和 Redis：

**PostgreSQL:**
- 下载: https://www.postgresql.org/download/windows/
- 创建数据库: `dify`
- 用户: `postgres`
- 密码: `difyai123456`

**Redis:**
- 下载: https://github.com/tporadowski/redis/releases
- 设置密码: `difyai123456`

### 2. 端口被占用

检查端口占用：

```powershell
# PostgreSQL (5432)
netstat -ano | findstr :5432

# Redis (6379)
netstat -ano | findstr :6379

# Flask (5001)
netstat -ano | findstr :5001
```

停止占用进程：

```powershell
taskkill /PID <PID> /F
```

### 3. 数据库连接失败

检查 `api/.env` 文件中的数据库配置：

```env
DB_TYPE=postgresql
DB_USERNAME=postgres
DB_PASSWORD=difyai123456
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=dify
```

### 4. uv 命令不可用

使用 `python -m uv` 代替 `uv`：

```powershell
python -m uv run flask run --host 0.0.0.0 --port=5001 --debug
```

## 停止服务

### 停止后端

在运行后端的终端按 `Ctrl+C`

### 停止数据库

```powershell
docker-compose -f docker-compose.dev.yaml down
```

## 下一步

1. 访问前端: http://localhost:3000
2. 访问数据脱敏页面: http://localhost:3000/data-masking
3. 查看 API 文档: http://localhost:5001/console/api/docs

## 相关文档

- [START_PROJECT.md](./START_PROJECT.md) - 完整启动指南
- [DATA_MASKING_IMPLEMENTATION.md](./DATA_MASKING_IMPLEMENTATION.md) - 数据脱敏功能说明
