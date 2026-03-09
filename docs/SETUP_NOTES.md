# Dify Development Setup Notes

## Issue Resolved

The backend API was returning 500 errors because it couldn't connect to the plugin daemon service, which wasn't running.

## What Was Fixed

Added the following services to `docker-compose.dev.yaml`:

1. **Weaviate** (Vector Database) - Port 8080
2. **Plugin Daemon** - Ports 5002, 5003

## Services Now Running

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6700
- **Weaviate**: localhost:8080
- **Plugin Daemon**: localhost:5002

## How to Use

### Start all services:
```bash
.\start-database.ps1
# or
.\start-database.bat
```

### Start backend:
```bash
.\start-backend.ps1
# or
.\start-backend.bat
```

### View logs:
```bash
docker-compose -f docker-compose.dev.yaml logs -f
```

### Stop services:
```bash
docker-compose -f docker-compose.dev.yaml down
```

## Notes

- The plugin daemon requires a separate database (`dify_plugin`) which is automatically created
- The backend connects to the plugin daemon at `http://127.0.0.1:5002`
- All services are configured to work with the local development setup
