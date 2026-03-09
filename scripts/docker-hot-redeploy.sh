#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/docker"

cd "${ROOT_DIR}"
git status --porcelain
git rev-parse HEAD

cd "${DOCKER_DIR}"

TS="$(date +%Y%m%d_%H%M%S)"
docker image inspect dify-api:local >/dev/null 2>&1 && docker tag dify-api:local "dify-api:local_prev_${TS}" || true
docker image inspect dify-web:local >/dev/null 2>&1 && docker tag dify-web:local "dify-web:local_prev_${TS}" || true
docker image inspect dify-web:hot >/dev/null 2>&1 && docker tag dify-web:hot "dify-web:hot_prev_${TS}" || true

CONSOLE_API_URL= APP_API_URL= SERVICE_API_URL= FILES_URL= MARKETPLACE_API_URL= MARKETPLACE_URL= \
  docker compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.hot.yaml build api web worker worker_beat
CONSOLE_API_URL= APP_API_URL= SERVICE_API_URL= FILES_URL= MARKETPLACE_API_URL= MARKETPLACE_URL= \
  docker compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.hot.yaml up -d --remove-orphans
CONSOLE_API_URL= APP_API_URL= SERVICE_API_URL= FILES_URL= MARKETPLACE_API_URL= MARKETPLACE_URL= \
  docker compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.hot.yaml restart nginx

for _ in $(seq 1 60); do
  code="$(curl -s -o /dev/null -w "%{http_code}" http://localhost/console/api/ping || true)"
  if [[ "${code}" == "200" ]]; then
    break
  fi
  sleep 1
done

for _ in $(seq 1 60); do
  code="$(curl -s -o /dev/null -w "%{http_code}" http://localhost/apps || true)"
  if [[ "${code}" =~ ^(200|301|302)$ ]]; then
    break
  fi
  sleep 1
done

docker compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.hot.yaml ps
