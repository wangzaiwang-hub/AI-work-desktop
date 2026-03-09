# 启动开发数据库服务（PostgreSQL、Redis、Weaviate、Plugin Daemon）

Write-Host "正在启动数据库服务...`n" -ForegroundColor Green

docker-compose -f "$PSScriptRoot\..\docker-compose.dev.yaml" up -d

Write-Host "`n数据库服务已启动！`n" -ForegroundColor Green

Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "  用户名: postgres" -ForegroundColor White
Write-Host "  密码: difyai123456" -ForegroundColor White
Write-Host "  数据库: dify`n" -ForegroundColor White

Write-Host "Redis: localhost:6700" -ForegroundColor Cyan
Write-Host "  密码: difyai123456`n" -ForegroundColor White

Write-Host "Weaviate: localhost:8080" -ForegroundColor Cyan
Write-Host "  API Key: WVF5YThaHlkYwhGUSmCRgsX3tD5ngdN8pkih`n" -ForegroundColor White

Write-Host "Plugin Daemon: localhost:5002`n" -ForegroundColor Cyan
