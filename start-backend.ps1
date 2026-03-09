# CheersAI 一键启动后端服务
# 包含: Docker 服务 (PostgreSQL, Redis, Weaviate, Plugin Daemon) + Flask API
# 使用方法: .\start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CheersAI 后端一键启动" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ---- 第一步: 启动 Docker 服务 ----
Write-Host "[1/3] 启动 Docker 服务..." -ForegroundColor Green

docker-compose -f "$PSScriptRoot\docker-compose.dev.yaml" up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker 服务启动失败，请检查 Docker 是否运行" -ForegroundColor Red
    exit 1
}

Write-Host "  PostgreSQL : localhost:5432" -ForegroundColor Gray
Write-Host "  Redis      : localhost:6700" -ForegroundColor Gray
Write-Host "  Weaviate   : localhost:8080" -ForegroundColor Gray
Write-Host "  Plugin     : localhost:5002`n" -ForegroundColor Gray

# ---- 第二步: 等待数据库就绪 ----
Write-Host "[2/3] 等待数据库就绪..." -ForegroundColor Green
$maxRetries = 15
$retry = 0
while ($retry -lt $maxRetries) {
    $pgReady = docker exec dify-postgres pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  数据库已就绪`n" -ForegroundColor Green
        break
    }
    $retry++
    Write-Host "  等待中... ($retry/$maxRetries)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}
if ($retry -eq $maxRetries) {
    Write-Host "  数据库启动超时，继续尝试启动 API...`n" -ForegroundColor Yellow
}

# ---- 第三步: 启动 Flask API ----
Write-Host "[3/3] 启动 Flask API (端口 5001)..." -ForegroundColor Green
Write-Host "  按 Ctrl+C 停止服务`n" -ForegroundColor Yellow

Set-Location -Path "$PSScriptRoot\api"

# 运行数据库迁移
Write-Host "  运行数据库迁移..." -ForegroundColor Gray
uv run flask db upgrade 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  后端 API: http://localhost:5001" -ForegroundColor Cyan
Write-Host "  登录账号: 1@qq.com / password123" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 启动 Flask
uv run flask run --host 0.0.0.0 --port=5001 --debug
