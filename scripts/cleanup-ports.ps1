# 端口清理脚本
# 用于清理 Dify 项目占用的端口

$rootDir = Split-Path $PSScriptRoot -Parent

Write-Host "清理 Dify 项目端口..." -ForegroundColor Cyan

# 停止 Docker 容器
Write-Host "`n1. 停止 Docker 容器..." -ForegroundColor Yellow
docker-compose -f "$rootDir\docker-compose.dev.yaml" down 2>$null

# 杀掉 Node.js 进程
Write-Host "`n2. 停止 Node.js 进程..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "   已停止 $($nodeProcesses.Count) 个 Node.js 进程" -ForegroundColor Green
} else {
    Write-Host "   没有运行的 Node.js 进程" -ForegroundColor Gray
}

# 杀掉 Python 进程
Write-Host "`n3. 停止 Python 进程..." -ForegroundColor Yellow
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "   已停止 $($pythonProcesses.Count) 个 Python 进程" -ForegroundColor Green
} else {
    Write-Host "   没有运行的 Python 进程" -ForegroundColor Gray
}

# 验证端口状态
Write-Host "`n4. 检查端口状态..." -ForegroundColor Yellow
$ports = @(5432, 3000, 5001, 6379, 8080, 5002)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   端口 $port 仍被占用 (进程 ID: $($connection.OwningProcess))" -ForegroundColor Red
    } else {
        Write-Host "   端口 $port 已释放" -ForegroundColor Green
    }
}

Write-Host "`n清理完成！" -ForegroundColor Green
Write-Host "`n现在可以重新启动服务：" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.dev.yaml up -d" -ForegroundColor White
