"""
审计日志服务 - 本地文件记录
Audit Log Service - Local File Logging
"""
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from flask import request

# 配置审计日志文件
AUDIT_LOG_DIR = Path("logs")
AUDIT_LOG_DIR.mkdir(exist_ok=True)
AUDIT_LOG_FILE = AUDIT_LOG_DIR / "audit.log"

# 配置审计日志记录器
audit_logger = logging.getLogger("audit")
audit_logger.setLevel(logging.INFO)

# 如果还没有handler，添加文件handler
if not audit_logger.handlers:
    file_handler = logging.FileHandler(AUDIT_LOG_FILE, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    
    # 使用JSON格式记录，方便后续解析和上传
    formatter = logging.Formatter('%(message)s')
    file_handler.setFormatter(formatter)
    
    audit_logger.addHandler(file_handler)
    # 不传播到root logger
    audit_logger.propagate = False


def log_operation(
    action: str,
    content: Optional[dict[str, Any]] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
) -> None:
    """
    记录操作日志到本地文件
    
    Args:
        action: 操作类型，如 "file_mask", "file_restore", "knowledge_sync"
        content: 操作详情（JSON格式）
        resource_type: 资源类型，如 "file", "dataset"
        resource_id: 资源ID
    """
    try:
        # 获取客户端IP
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        if ip_address and ',' in ip_address:
            ip_address = ip_address.split(',')[0].strip()
        
        # 构建日志内容
        log_content = content or {}
        if resource_type:
            log_content['resource_type'] = resource_type
        if resource_id:
            log_content['resource_id'] = resource_id
        
        # 构建日志记录
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "content": log_content,
            "ip": ip_address or "unknown",
        }
        
        # 写入日志文件（JSON格式，每行一条记录）
        audit_logger.info(json.dumps(log_entry, ensure_ascii=False))
        
        print(f"[AUDIT] ✓ 记录操作日志: {action}")
        
    except Exception as e:
        # 日志记录失败不应影响主业务流程
        print(f"[AUDIT] ✗ 记录操作日志失败: {e}")
