"""Sync sandbox files to Dify Knowledge Base (Dataset).

This endpoint requires authentication because it interacts with
the Dataset/Document services which need a current user and tenant.
"""

import logging
import mimetypes
from datetime import datetime
from pathlib import Path

from flask import request
from flask_restx import Resource

from constants import DOCUMENT_EXTENSIONS
from controllers.console import console_ns
from controllers.console.wraps import (
    account_initialization_required,
    setup_required,
)
from extensions.ext_database import db
from libs.login import current_account_with_tenant, login_required
from services.audit_service import log_operation
from services.dataset_service import DatasetService, DocumentService
from services.file_service import FileService

logger = logging.getLogger(__name__)


@console_ns.route("/data-masking/sandbox/sync-to-knowledge")
class SandboxSyncToKnowledge(Resource):
    """Sync sandbox files into a Dify Dataset (Knowledge Base)."""

    @setup_required
    @login_required
    @account_initialization_required
    def post(self):
        current_account, current_tenant_id = current_account_with_tenant()
        data = request.get_json(silent=True) or {}
        sandbox_path: str = data.get("sandbox_path", "")
        dataset_name: str = data.get("dataset_name", "沙箱脱敏知识库")
        file_names: list[str] | None = data.get("file_names")

        if not sandbox_path:
            return {"error": "sandbox_path is required"}, 400

        dir_path = Path(sandbox_path).resolve()
        if not dir_path.is_dir():
            return {"error": "沙箱目录不存在"}, 404

        # Use Dify's own DOCUMENT_EXTENSIONS to filter
        allowed_exts = {e.lower() for e in DOCUMENT_EXTENSIONS}

        if file_names:
            files_to_sync = [
                dir_path / f for f in file_names
                if (dir_path / f).is_file()
                and (dir_path / f).suffix.lstrip(".").lower() in allowed_exts
            ]
        else:
            files_to_sync = [
                f for f in dir_path.iterdir()
                if f.is_file()
                and f.suffix.lstrip(".").lower() in allowed_exts
                and not f.name.startswith(".")
            ]

        if not files_to_sync:
            return {"error": "没有找到可同步的文件（支持: txt, md, pdf, docx, csv, html, xlsx）"}, 400

        try:
            ts = datetime.now().strftime("%m%d_%H%M")
            unique_name = f"{dataset_name}_{ts}"

            dataset = DatasetService.create_empty_dataset(
                tenant_id=current_tenant_id,
                name=unique_name,
                description=f"从沙箱目录 {sandbox_path} 同步的脱敏文件",
                indexing_technique="economy",
                account=current_account,
            )

            uploaded_file_ids: list[str] = []
            synced_names: list[str] = []
            skipped_names: list[str] = []

            for file_path in files_to_sync:
                try:
                    content = file_path.read_bytes()
                    mime = mimetypes.guess_type(file_path.name)[0] or "text/plain"

                    upload_file = FileService(db.engine).upload_file(
                        filename=file_path.name,
                        content=content,
                        mimetype=mime,
                        user=current_account,
                        source="datasets",
                    )
                    uploaded_file_ids.append(upload_file.id)
                    synced_names.append(file_path.name)
                except Exception:
                    logger.warning("Skipped unsupported file: %s", file_path.name)
                    skipped_names.append(file_path.name)

            if not uploaded_file_ids:
                return {"error": "所有文件均不支持上传"}, 400

            from services.entities.knowledge_entities.knowledge_entities import (
                KnowledgeConfig,
            )

            knowledge_config = KnowledgeConfig.model_validate(
                {
                    "data_source": {
                        "info_list": {
                            "data_source_type": "upload_file",
                            "file_info_list": {
                                "file_ids": uploaded_file_ids,
                            },
                        },
                    },
                    "indexing_technique": "economy",
                    "doc_form": "text_model",
                    "doc_language": "Chinese",
                    "process_rule": {
                        "mode": "automatic",
                    },
                }
            )

            documents, batch = DocumentService.save_document_with_dataset_id(
                dataset=dataset,
                knowledge_config=knowledge_config,
                account=current_account,
            )

            db.session.commit()

            # 记录审计日志
            log_operation(
                action="knowledge_sync",
                content={
                    "dataset_id": dataset.id,
                    "dataset_name": dataset.name,
                    "file_count": len(synced_names),
                    "files": synced_names,
                    "sandbox_path": sandbox_path,
                },
                resource_type="dataset",
                resource_id=dataset.id,
            )

            result = {
                "result": "success",
                "dataset_id": dataset.id,
                "dataset_name": dataset.name,
                "file_count": len(synced_names),
                "files": synced_names,
                "document_count": len(documents),
                "batch": batch,
            }
            if skipped_names:
                result["skipped"] = skipped_names
            return result

        except Exception as e:
            logger.exception("Failed to sync sandbox to knowledge base")
            db.session.rollback()
            return {"error": f"同步失败: {e}"}, 500