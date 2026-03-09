# Docker 环境测试报告（CheersAI-Desktop）

本报告记录一次在 Docker Compose 环境中对 Web 前端、API 后端与关键中间件的部署验收测试结果（功能/集成/性能），用于回归与交付留档。

## 测试范围

- Web 前端：通过 Nginx 统一入口访问
- API 后端：通过 Nginx 反代与直连端口访问
- 中间件：PostgreSQL、Redis、Weaviate、Sandbox、SSRF Proxy、Plugin Daemon

## 环境信息

- 运行方式：`docker/docker-compose.yaml` + `docker/docker-compose.override.yaml`
- 本地构建镜像：`dify-api:local`、`dify-web:local`
- 关键对外端口：
  - `80/tcp`：Nginx（Web + API 反代）
  - `8080/tcp`：API 直连（宿主 → 容器 5001）
  - `3000/tcp`：Web 直连
  - `5003/tcp`：Plugin debug

## 功能测试（Smoke）

### 1) Web 首页可访问

- 请求：`GET http://localhost/`
- 结果：返回 307（应用路由重定向，属预期行为）

### 2) API 存活探针（Nginx 反代）

- 请求：`GET http://localhost/console/api/ping`
- 结果：`200 OK`
- 响应示例：

```json
{"result":"pong"}
```

### 3) API 存活探针（直连端口）

- 请求：`GET http://localhost:8080/console/api/ping`
- 结果：`200 OK`

## 集成测试（依赖链路）

### 1) API ↔ 数据库链路

选择会访问数据库的无鉴权接口作为验证点：

- 请求：`GET http://localhost/console/api/setup`
- 预期：返回系统初始化状态（需要数据库可读）
- 结果：`200 OK`
- 响应示例（示例环境已完成 setup）：

```json
{"step":"finished","setup_at":"2026-03-01T03:41:59"}
```

### 2) Worker ↔ Redis 链路

- 观察点：Worker 日志出现已连接 Redis 的记录（示例：`Connected to redis://...@redis:6379/1`）
- 结果：正常

### 3) 向量库 Weaviate 存活

- 观察点：容器内调用 Weaviate 元信息接口：
  - `GET http://localhost:8080/v1/meta`（在 weaviate 容器内执行）
- 结果：正常，返回版本信息（示例：`1.27.0`）

## 性能测试（轻量基线）

### 1) Ping 端点延迟基线

- 目标：`http://localhost/console/api/ping`
- 方法：单进程串行请求 200 次，统计 min/avg/p95/max（仅作为基线，不等同生产压测）
- 结果（示例一次运行）：
  - n=200
  - min_ms=5.29
  - avg_ms=7.36
  - p95_ms=9.73
  - max_ms=76.34

## 运行状态与端口映射核对

以 `docker compose ps` 输出为准，重点校验：

- `nginx`：`80->80`、`443->443`
- `api`：`8080->5001`
- `web`：`3000->3000`
- 其他服务：保持内部网络通信（无额外对外暴露亦可）

## 已知注意事项

- 若 `api/web` 容器被重新创建但 `nginx` 没有重启，可能出现 Nginx 仍缓存旧的上游 IP 导致 502。建议执行：

```bash
cd docker
docker compose -f docker-compose.yaml -f docker-compose.override.yaml restart nginx
```

