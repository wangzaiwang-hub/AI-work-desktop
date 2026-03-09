@echo off
REM CheersAI Celery Worker 启动脚本
REM 用于处理异步任务（邮件发送、文档处理等）

echo ========================================
echo   启动 Celery Worker
echo ========================================
echo.

cd /d "%~dp0api"

echo 正在启动 Celery Worker...
echo 队列: mail, dataset, generation
echo.
echo 按 Ctrl+C 停止服务
echo.

uv run celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail

pause
