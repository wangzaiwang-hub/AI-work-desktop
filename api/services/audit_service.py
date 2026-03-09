"""
审计日志服务
Audit Log Service
"""
from datetime import datetime
from typing import Any, Optional

from flask import request
from flask_login import current_user

from extensions.ext_database import db
from models.model import OperationLog


def log_operation(
    action: str,
    content: Optional[dict[str, Any]] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
) -> None:
    """
    记录操作日志
    
    Args:
        action: 操作类型，如 "file_mask", "file_restore", "knowledge_sync"
        content: 操作详情（JSON格式）
        resource_type: 资源类型，如 "file", "dataset"
        resource_id: 资源ID
    """
    try:
        print(f"[AUDIT] 尝试记录操作日志: action={action}")
        
        # 获取当前用户和租户
        if not current_user or not current_user.is_authenticated:
            # 对于无认证的API，使用系统账户记录
            account_id = "system"
            tenant_id = "system"
            print(f"[AUDIT] 使用系统账户记录")
        else:
            account_id = current_user.id
            tenant_id = current_user.current_tenant_id
            print(f"[AUDIT] 使用用户账户: account_id={account_id}, tenant_id={tenant_id}")
        
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
        
        print(f"[AUDIT] 创建日志记录: ip={ip_address}")
        
        # 创建日志记录
        operation_log = OperationLog(
            tenant_id=tenant_id,
            account_id=account_id,
            action=action,
            content=log_content,
            created_at=datetime.utcnow(),
            created_ip=ip_address or '0.0.0.0',
        )
        
        db.session.add(operation_log)
        db.session.commit()
        
        print(f"[AUDIT] ✓ 成功记录操作日志: {action}")
        
    except Exception as e:
        # 日志记录失败不应影响主业务流程
        print(f"[AUDIT] ✗ 记录操作日志失败: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
