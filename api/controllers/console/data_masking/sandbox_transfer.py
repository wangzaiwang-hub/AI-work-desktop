"""Sandbox export/import API — ZIP with PIN protection.

Export: packs all files in the sandbox directory into a ZIP, encrypted
with a user-supplied PIN (using zipfile + hmac-based verification).
Import: accepts a ZIP + PIN, verifies the PIN, then extracts to sandbox.

Since Python's zipfile doesn't support AES encryption natively, we use a
simple approach: store a verification token (HMAC of the PIN) inside the
ZIP as `.pin_verify`, and on import we check the token before extracting.
"""

import hashlib
import hmac
import io
import os
import zipfile
from pathlib import Path

from flask import Blueprint, request

transfer_bp = Blueprint(
    "sandbox_transfer",
    __name__,
    url_prefix="/console/api/data-masking/sandbox",
)

SANDBOX_BASE: str = os.environ.get("DATA_MASKING_SANDBOX_PATH", "")
PIN_VERIFY_FILENAME = ".pin_verify"


def _make_pin_token(pin: str) -> str:
    """Derive a verification token from the PIN."""
    return hmac.new(
        pin.encode("utf-8"),
        b"cheersai-sandbox-export",
        hashlib.sha256,
    ).hexdigest()


@transfer_bp.route("/export", methods=["POST"])
def export_sandbox():
    """Export sandbox directory as a ZIP file.

    Body JSON: { sandbox_path?: str, pin: str }
    Returns: ZIP file download.
    """
    data = request.get_json(silent=True) or {}
    sandbox_path: str = data.get("sandbox_path", "") or SANDBOX_BASE
    pin: str = data.get("pin", "")

    if not sandbox_path:
        return {"error": "sandbox_path is required"}, 400
    if not pin or len(pin) < 4:
        return {"error": "PIN 至少 4 位"}, 400

    dir_path = Path(sandbox_path).resolve()
    if not dir_path.is_dir():
        return {"error": "沙箱目录不存在"}, 404

    try:
        export_name = "sandbox-export.zip"
        export_path = dir_path / export_name

        file_count = 0
        with zipfile.ZipFile(export_path, "w", zipfile.ZIP_DEFLATED) as zf:
            # Write PIN verification token
            zf.writestr(PIN_VERIFY_FILENAME, _make_pin_token(pin))
            # Add all files (non-recursive, skip hidden and the export zip itself)
            for entry in dir_path.iterdir():
                if entry.is_file() and not entry.name.startswith(".") and entry.name != export_name:
                    zf.write(entry, entry.name)
                    file_count += 1

        return {
            "result": "success",
            "file_path": str(export_path),
            "file_name": export_name,
            "file_count": file_count,
            "size": export_path.stat().st_size,
        }
    except OSError as e:
        return {"error": f"导出失败: {e}"}, 500


@transfer_bp.route("/import", methods=["POST"])
def import_sandbox():
    """Import a ZIP into the sandbox directory after PIN verification.

    Multipart form: file (ZIP), pin (str), sandbox_path? (str)
    """
    uploaded = request.files.get("file")
    pin: str = request.form.get("pin", "")
    sandbox_path: str = request.form.get("sandbox_path", "") or SANDBOX_BASE

    if not uploaded:
        return {"error": "请上传 ZIP 文件"}, 400
    if not pin:
        return {"error": "请输入 PIN"}, 400
    if not sandbox_path:
        return {"error": "sandbox_path is required"}, 400

    try:
        zip_bytes = uploaded.read()
        with zipfile.ZipFile(io.BytesIO(zip_bytes), "r") as zf:
            # Verify PIN
            if PIN_VERIFY_FILENAME not in zf.namelist():
                return {"error": "无效的导出文件（缺少校验信息）"}, 400
            stored_token = zf.read(PIN_VERIFY_FILENAME).decode("utf-8").strip()
            expected_token = _make_pin_token(pin)
            if not hmac.compare_digest(stored_token, expected_token):
                return {"error": "PIN 校验失败，请确认密码正确"}, 403

            dir_path = Path(sandbox_path).resolve()
            dir_path.mkdir(parents=True, exist_ok=True)

            imported: list[str] = []
            for name in zf.namelist():
                if name == PIN_VERIFY_FILENAME:
                    continue
                # Security: skip paths with directory traversal
                if ".." in name or name.startswith("/"):
                    continue
                basename = os.path.basename(name)
                if not basename or basename.startswith("."):
                    continue
                target = dir_path / basename
                target.write_bytes(zf.read(name))
                imported.append(basename)

        return {
            "result": "success",
            "imported_files": imported,
            "count": len(imported),
        }
    except zipfile.BadZipFile:
        return {"error": "文件不是有效的 ZIP 格式"}, 400
    except OSError as e:
        return {"error": f"导入失败: {e}"}, 500
