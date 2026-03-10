"""Sandbox file management API for data masking module.

These endpoints are unauthenticated by design — they serve a local-only
developer tool that reads/writes files on the machine running the API server.
"""

import os
import re
from datetime import datetime, timezone
from pathlib import Path

from flask import Blueprint, request

from services.audit_service import log_operation

sandbox_bp = Blueprint("sandbox_files", __name__, url_prefix="/console/api/data-masking/sandbox")

SANDBOX_BASE = os.environ.get("DATA_MASKING_SANDBOX_PATH", "")


def _safe_filename(name: str) -> str:
    name = os.path.basename(name)
    name = re.sub(r'[<>:"/\\|?*]', "_", name)
    if not name or name.startswith("."):
        raise ValueError("Invalid filename")
    return name


@sandbox_bp.route("/files", methods=["POST"])
def save_file():
    data = request.get_json(silent=True)
    if not data:
        return {"error": "Request body required"}, 400
    sandbox_path: str = data.get("sandbox_path", "") or SANDBOX_BASE
    file_name: str = data.get("file_name", "")
    content: str = data.get("content", "")
    if not sandbox_path:
        return {"error": "sandbox_path is required"}, 400
    if not file_name:
        return {"error": "file_name is required"}, 400
    # Reject relative paths to avoid writing to unexpected locations
    if not Path(sandbox_path).is_absolute():
        return {"error": "sandbox_path must be an absolute path, e.g. C:\\Users\\xxx\\masked-files"}, 400
    try:
        safe_name = _safe_filename(file_name)
        dir_path = Path(sandbox_path).resolve()
        dir_path.mkdir(parents=True, exist_ok=True)
        file_path = dir_path / safe_name
        file_path.write_text(content, encoding="utf-8")
        
        # 记录审计日志 - 文件脱敏操作
        log_operation(
            action="file_mask",
            content={
                "file_name": file_name,
                "sandbox_path": sandbox_path,
                "size": len(content.encode("utf-8")),
            },
            resource_type="file",
        )
        
        return {
            "result": "success",
            "file_path": str(file_path),
            "file_name": safe_name,
            "size": len(content.encode("utf-8")),
        }
    except ValueError as e:
        return {"error": str(e)}, 400
    except OSError as e:
        return {"error": f"Failed to save file: {e}"}, 500


@sandbox_bp.route("/files/list", methods=["GET"])
def list_files():
    sandbox_path: str = request.args.get("sandbox_path", "") or SANDBOX_BASE
    if not sandbox_path:
        return {"error": "sandbox_path is required"}, 400
    try:
        dir_path = Path(sandbox_path).resolve()
        if not dir_path.exists():
            return {"files": [], "total": 0}
        files: list[dict] = []
        for entry in dir_path.iterdir():
            if entry.is_file():
                stat = entry.stat()
                created = datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc).isoformat()
                files.append({
                    "name": entry.name,
                    "size": stat.st_size,
                    "created_at": created,
                })
        files.sort(key=lambda f: f["created_at"], reverse=True)
        return {"files": files, "total": len(files)}
    except OSError as e:
        return {"error": f"Failed to list files: {e}"}, 500


@sandbox_bp.route("/files/read", methods=["GET"])
def read_file():
    sandbox_path: str = request.args.get("sandbox_path", "") or SANDBOX_BASE
    file_name: str = request.args.get("file_name", "")
    if not sandbox_path or not file_name:
        return {"error": "sandbox_path and file_name required"}, 400
    try:
        safe_name = _safe_filename(file_name)
        file_path = Path(sandbox_path).resolve() / safe_name
        if not file_path.exists():
            return {"error": "File not found"}, 404
        content = file_path.read_text(encoding="utf-8")
        return {
            "content": content,
            "file_name": safe_name,
            "size": len(content.encode("utf-8")),
        }
    except ValueError as e:
        return {"error": str(e)}, 400
    except OSError as e:
        return {"error": f"Failed to read file: {e}"}, 500


@sandbox_bp.route("/files/delete", methods=["DELETE"])
def delete_file():
    data = request.get_json(silent=True)
    if not data:
        return {"error": "Request body required"}, 400
    sandbox_path: str = data.get("sandbox_path", "") or SANDBOX_BASE
    file_name: str = data.get("file_name", "")
    if not sandbox_path or not file_name:
        return {"error": "sandbox_path and file_name required"}, 400
    try:
        safe_name = _safe_filename(file_name)
        file_path = Path(sandbox_path).resolve() / safe_name
        if not file_path.exists():
            return {"error": "File not found"}, 404
        file_path.unlink()
        
        # 记录审计日志
        log_operation(
            action="file_delete",
            content={
                "file_name": file_name,
                "sandbox_path": sandbox_path,
            },
            resource_type="file",
        )
        
        return {"result": "success"}
    except ValueError as e:
        return {"error": str(e)}, 400
    except OSError as e:
        return {"error": f"Failed to delete file: {e}"}, 500
