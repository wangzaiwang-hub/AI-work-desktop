@echo off
REM 启动开发数据库服务（PostgreSQL、Redis、Weaviate、Plugin Daemon）

echo 正在启动数据库服务...
echo.

docker-compose -f "%~dp0..\docker-compose.dev.yaml" up -d

echo.
echo 数据库服务已启动！
echo.
echo PostgreSQL: localhost:5432
echo   用户名: postgres
echo   密码: difyai123456
echo   数据库: dify
echo.
echo Redis: localhost:6700
echo   密码: difyai123456
echo.
echo Weaviate: localhost:8080
echo   API Key: WVF5YThaHlkYwhGUSmCRgsX3tD5ngdN8pkih
echo.
echo Plugin Daemon: localhost:5002
echo.

pause
