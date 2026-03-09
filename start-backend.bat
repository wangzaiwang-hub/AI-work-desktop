@echo off
REM CheersAI 一键启动后端服务
REM 包含: Docker 服务 + Flask API
REM 使用方法: start-backend.bat

echo ========================================
echo   CheersAI 后端一键启动
echo ========================================
echo.

REM ---- 第一步: 启动 Docker 服务 ----
echo [1/3] 启动 Docker 服务...
docker-compose -f "%~dp0docker-compose.dev.yaml" up -d
if errorlevel 1 (
    echo Docker 服务启动失败，请检查 Docker 是否运行
    pause
    exit /b 1
)

echo   PostgreSQL : localhost:5432
echo   Redis      : localhost:6700
echo   Weaviate   : localhost:8080
echo   Plugin     : localhost:5002
echo.

REM ---- 第二步: 等待数据库就绪 ----
echo [2/3] 等待数据库就绪...
timeout /t 5 /nobreak >nul
echo   数据库已就绪
echo.

REM ---- 第三步: 启动 Flask API ----
echo [3/3] 启动 Flask API (端口 5001)...
echo   按 Ctrl+C 停止服务
echo.

cd /d "%~dp0api"

REM 运行数据库迁移
echo   运行数据库迁移...
uv run flask db upgrade 2>nul

echo.
echo ========================================
echo   后端 API: http://localhost:5001
echo   登录账号: 1@qq.com / password123
echo ========================================
echo.

uv run flask run --host 0.0.0.0 --port=5001 --debug
