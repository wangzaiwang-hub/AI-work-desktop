"""测试审计日志功能"""
import sys
sys.path.insert(0, 'api')

from datetime import datetime
from extensions.ext_database import db
from models.model import OperationLog
from app_factory import create_flask_app_with_configs

# 创建应用上下文
app = create_flask_app_with_configs()

with app.app_context():
    # 查询现有的审计日志
    logs = db.session.query(OperationLog).order_by(OperationLog.created_at.desc()).limit(10).all()
    
    print(f"找到 {len(logs)} 条审计日志:")
    for log in logs:
        print(f"  - {log.created_at} | {log.action} | Account: {log.account_id}")
    
    # 尝试创建一条测试日志
    try:
        test_log = OperationLog(
            tenant_id="test-tenant",
            account_id="test-account",
            action="test_action",
            content={"test": "data"},
            created_at=datetime.utcnow(),
            created_ip="127.0.0.1",
        )
        db.session.add(test_log)
        db.session.commit()
        print("\n✓ 成功创建测试日志")
    except Exception as e:
        print(f"\n✗ 创建测试日志失败: {e}")
        db.session.rollback()
