#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <timestamp>"
  exit 1
fi

TS="$1"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/docker"

docker tag "dify-api:local_prev_${TS}" dify-api:local
docker tag "dify-web:local_prev_${TS}" dify-web:local
if docker image inspect "dify-web:hot_prev_${TS}" >/dev/null 2>&1; then
  docker tag "dify-web:hot_prev_${TS}" dify-web:hot
fi

cd "${DOCKER_DIR}"
docker compose -f docker-compose.yaml -f docker-compose.override.yaml up -d --remove-orphans
docker compose -f docker-compose.yaml -f docker-compose.override.yaml restart nginx
docker compose -f docker-compose.yaml -f docker-compose.override.yaml ps
