"""手动插入测试审计日志"""
import sys
import os

# 设置环境变量
os.environ['FLASK_APP'] = 'api/app.py'

# 添加api目录到路径
sys.path.insert(0, 'api')

from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

# 从.env文件读取数据库连接
db_config = {}
try:
    with open('api/.env', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith('DB_'):
                key, value = line.split('=', 1)
                db_config[key] = value
except Exception as e:
    print(f"读取.env文件失败: {e}")
    sys.exit(1)

if not db_config:
    print("无法从.env文件读取数据库配置")
    sys.exit(1)

# 构建数据库URL
db_url = f"postgresql://{db_config.get('DB_USERNAME')}:{db_config.get('DB_PASSWORD')}@{db_config.get('DB_HOST')}:{db_config.get('DB_PORT')}/{db_config.get('DB_DATABASE')}"
print(f"数据库URL: postgresql://{db_config.get('DB_USERNAME')}:***@{db_config.get('DB_HOST')}:{db_config.get('DB_PORT')}/{db_config.get('DB_DATABASE')}")

# 创建数据库引擎
engine = create_engine(db_url)

# 查询当前用户
with Session(engine) as session:
    # 获取第一个账户
    result = session.execute(text("SELECT id, name, email FROM accounts LIMIT 1"))
    account = result.fetchone()
    
    if not account:
        print("数据库中没有账户")
        sys.exit(1)
    
    account_id, account_name, account_email = account
    print(f"找到账户: {account_name} ({account_email})")
    
    # 获取租户ID
    result = session.execute(text("SELECT tenant_id FROM tenant_account_joins WHERE account_id = :account_id LIMIT 1"), 
                           {"account_id": account_id})
    tenant = result.fetchone()
    
    if not tenant:
        print("账户没有关联租户")
        sys.exit(1)
    
    tenant_id = tenant[0]
    print(f"租户ID: {tenant_id}")
    
    # 插入测试日志
    now = datetime.utcnow()
    session.execute(text("""
        INSERT INTO operation_logs (id, tenant_id, account_id, action, content, created_at, created_ip, updated_at)
        VALUES (gen_random_uuid(), :tenant_id, :account_id, :action, :content, :created_at, :created_ip, :updated_at)
    """), {
        "tenant_id": tenant_id,
        "account_id": account_id,
        "action": "test_operation",
        "content": '{"test": "这是一条测试日志", "timestamp": "' + now.isoformat() + '"}',
        "created_at": now,
        "created_ip": "127.0.0.1",
        "updated_at": now,
    })
    
    session.commit()
    print("✓ 成功插入测试日志")
    
    # 查询验证
    result = session.execute(text("SELECT COUNT(*) FROM operation_logs WHERE tenant_id = :tenant_id"), 
                           {"tenant_id": tenant_id})
    count = result.scalar()
    print(f"该租户共有 {count} 条审计日志")
