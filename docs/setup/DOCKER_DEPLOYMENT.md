# Docker 部署与重构建指南（CheersAI-Desktop）

本文档用于将本项目的 Web 前端、API 后端以及相关中间件服务，以 Docker Compose 的方式进行构建、部署与配置，并在容器环境中完成基本验收。

## 目录结构与关键文件

- 主部署编排文件（由脚本生成，建议不要直接修改）
  - [docker-compose.yaml](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/docker/docker-compose.yaml)
- 本地代码构建覆盖（用于用本地代码构建 api/web 镜像并替换主编排中的预构建镜像）
  - [docker-compose.override.yaml](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/docker/docker-compose.override.yaml)
- 运行期环境变量（主编排强依赖）
  - [docker/.env](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/docker/.env)
  - [docker/.env.example](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/docker/.env.example)
- Dockerfile
  - 后端 [api/Dockerfile](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/api/Dockerfile)
  - 前端 [web/Dockerfile](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/web/Dockerfile)

## 前置条件

- 已安装 Docker Desktop（本机可用 `docker version` 验证）
- 本项目代码已在本机可用路径中（含 `api/`、`web/`、`docker/`）

## 端口与访问入口

- 统一入口（推荐）：Nginx
  - `http://localhost`（80）
  - `https://localhost`（443，如启用/配置 TLS）
- 直连调试端口
  - API：`http://localhost:8080` → 容器内 `api:5001`
  - Web：`http://localhost:3000` → 容器内 `web:3000`
  - Plugin debug：`http://localhost:5003`（插件守护进程调试端口，不保证 HTTP 首页）

## 构建与启动（本地代码 → 容器集群）

在项目根目录执行：

```bash
cd docker
```

1) 确保存在 `docker/.env`

```bash
cp .env.example .env
```

根据需要编辑 `.env`，至少保证数据库与向量库组合正确。常见组合：

- `DB_TYPE=postgresql`
- `VECTOR_STORE=weaviate`
- `COMPOSE_PROFILES=${VECTOR_STORE:-weaviate},${DB_TYPE:-postgresql}`

2) 使用本地代码构建最新镜像（api/web）

```bash
docker compose -f docker-compose.yaml -f docker-compose.override.yaml build api web worker worker_beat
```

3) 启动容器集群

```bash
docker compose -f docker-compose.yaml -f docker-compose.override.yaml up -d
```

4) 若发现 Nginx 代理到 api/web 出现 502（上游容器重建导致 IP 变更），重启 Nginx 以刷新 DNS 解析：

```bash
docker compose -f docker-compose.yaml -f docker-compose.override.yaml restart nginx
```

## 数据持久化

该编排默认使用仓库内的持久化目录（示例）：

- Postgres 数据目录（bind mount）：`docker/volumes/db/data/pgdata`
- 应用存储目录（bind mount）：`docker/volumes/app/storage`

建议将 `docker/volumes/` 作为需要备份的目录纳入备份策略。

## 环境变量与配置要点

- 所有服务的核心运行参数由 [docker/.env](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/docker/.env) 注入。
- Web 容器启动脚本会根据 `CONSOLE_API_URL` / `APP_API_URL` 生成 `NEXT_PUBLIC_API_PREFIX` 等前端变量（见 [entrypoint.sh](file:///Users/FYP/Documents/WorkSpace/CheersAI/subproducts/CheersAI-Desktop/cheersAIdesktop/web/docker/entrypoint.sh)）。
  - 若通过 Nginx 同域访问（推荐），`CONSOLE_API_URL` 留空可让前端使用相对路径 `/console/api`。

## 运维操作

- 查看运行状态

```bash
cd docker
docker compose -f docker-compose.yaml -f docker-compose.override.yaml ps
```

- 查看日志

```bash
cd docker
docker compose -f docker-compose.yaml -f docker-compose.override.yaml logs -f --tail=200 api web nginx
```

- 停止并清理（保留数据卷目录）

```bash
cd docker
docker compose -f docker-compose.yaml -f docker-compose.override.yaml down
```

