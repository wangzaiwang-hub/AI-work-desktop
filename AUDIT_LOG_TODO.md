# 审计日志功能待完成任务清单

## 当前状态

### ✅ 已完成
1. 后端审计日志API（3个端点）
   - `GET /console/api/operation-logs` - 获取日志列表
   - `GET /console/api/operation-logs/stats` - 获取统计数据  
   - `GET /console/api/operation-logs/actions` - 获取操作类型列表
   - 文件：`api/controllers/console/audit/operation_logs.py`

2. 前端审计日志页面（中文界面）
   - 统计卡片、筛选、表格、分页
   - 文件：`web/app/(commonLayout)/audit-logs/page.tsx`
   - 服务：`web/service/audit.ts`
   - 国际化：`web/i18n/zh-Hans/audit-logs.json`, `web/i18n/en-US/audit-logs.json`

3. 侧边栏菜单集成
   - 文件：`web/app/components/header/side-nav/index.tsx`（已添加审计日志菜单项）

4. 全局加密口令配置UI
   - 文件：`web/app/components/data-masking/sandbox-config.tsx`
   - 功能：32位口令输入、生成、显示/隐藏、复制、保存

5. 审计日志服务框架
   - 文件：`api/services/audit_service.py`（已创建）

### ✅ 已修复

**问题：`api/controllers/console/data_masking/ner_scan.py` 文件有重复代码** - 已完成

## 待完成任务

### 任务1：修复 NER 扫描文件的重复代码

**文件：** `api/controllers/console/data_masking/ner_scan.py`

**问题：** 文件中 `scan_entities` 函数末尾有重复的代码段

**修复步骤：**

1. 打开文件 `api/controllers/console/data_masking/ner_scan.py`

2. 找到 `scan_entities` 函数（约第200行）

3. 删除重复的代码，确保函数只有一个 `return` 语句

4. 确保函数结构如下：

```python
@ner_bp.route("/scan", methods=["POST"])
def scan_entities():
    data = request.get_json(silent=True)
    if not data or not data.get("content"):
        return {"error": "content is required"}, 400

    content: str = data["content"]
    if len(content) > 500_000:
        return {"error": "content too large (max 500KB)"}, 400

    regex_results = _scan_with_regex(content)
    try:
        ner_results = _scan_with_ner(content)
    except Exception:
        ner_results = []

    seen: dict[str, dict[str, str]] = {}
    for entity in ner_results:
        key = entity["text"]
        if key not in seen:
            seen[key] = entity

    for entity in regex_results:
        key = entity["text"]
        if key not in seen:
            count = content.count(key)
            entity["count"] = str(count)
            seen[key] = entity

    entities = sorted(seen.values(), key=lambda e: int(e.get("count", "1")), reverse=True)
    
    # 记录审计日志
    log_operation(
        action="ner_scan",
        content={
            "content_length": len(content),
            "entities_found": len(entities),
            "file_name": data.get("file_name", "unknown"),
        },
        resource_type="file",
    )
    
    return {"entities": entities}
```

5. 确保文件顶部有正确的导入：

```python
from flask import Blueprint, request

from services.audit_service import log_operation

ner_bp = Blueprint("ner_scan", __name__, url_prefix="/console/api/data-masking/ner")
```

### 任务2：验证审计日志功能

**步骤：**

1. 重启后端服务（确保代码重新加载）

2. 执行一次 NER 扫描操作

3. 查看后端控制台输出，应该看到：
   ```
   [AUDIT] 尝试记录操作日志: action=ner_scan
   [AUDIT] 使用用户账户: account_id=xxx, tenant_id=xxx
   [AUDIT] 创建日志记录: ip=127.0.0.1
   [AUDIT] ✓ 成功记录操作日志: ner_scan
   ```

4. 刷新审计日志页面，应该能看到新的日志记录

### 任务3：（可选）添加更多操作的审计日志

**已添加日志记录的操作：**
- ✅ NER扫描 (`ner_scan`)
- ✅ 知识库同步 (`knowledge_sync`) - `api/controllers/console/data_masking/sandbox_knowledge.py`
- ✅ 文件删除 (`file_delete`) - `api/controllers/console/data_masking/sandbox_files.py`

**可以添加的其他操作：**
- 文件上传
- 文件脱敏
- 文件还原
- 规则创建/修改/删除
- 配置修改

**添加方法：**

在相应的API函数中调用：
```python
from services.audit_service import log_operation

log_operation(
    action="操作类型",
    content={"详细信息": "值"},
    resource_type="资源类型",
    resource_id="资源ID（可选）",
)
```

## 相关文件清单

### 后端文件
- `api/services/audit_service.py` - 审计日志服务
- `api/controllers/console/audit/operation_logs.py` - 审计日志API控制器
- `api/controllers/console/audit/__init__.py` - 审计模块初始化
- `api/controllers/console/__init__.py` - 已导入审计模块
- `api/controllers/console/data_masking/ner_scan.py` - ⚠️ 需要修复
- `api/controllers/console/data_masking/sandbox_knowledge.py` - 已添加日志
- `api/controllers/console/data_masking/sandbox_files.py` - 已添加日志
- `api/models/model.py` - OperationLog 模型（约1600行）

### 前端文件
- `web/app/(commonLayout)/audit-logs/page.tsx` - 审计日志页面
- `web/service/audit.ts` - 审计日志服务
- `web/i18n/zh-Hans/audit-logs.json` - 中文翻译
- `web/i18n/en-US/audit-logs.json` - 英文翻译
- `web/app/components/header/side-nav/index.tsx` - 侧边栏菜单
- `web/app/components/data-masking/sandbox-config.tsx` - 全局加密口令配置

## 测试步骤

1. **修复代码后重启后端**
   ```bash
   # 停止当前后端服务（Ctrl+C）
   # 重新运行
   python api/app.py
   ```

2. **测试NER扫描**
   - 打开数据脱敏页面
   - 上传一个文件并执行NER扫描
   - 查看后端控制台是否有 `[AUDIT]` 日志

3. **查看审计日志页面**
   - 访问 `/audit-logs` 页面
   - 应该能看到刚才的操作记录
   - 统计数据应该更新

4. **测试其他操作**
   - 同步文件到知识库
   - 删除沙箱文件
   - 查看审计日志是否记录

## 注意事项

1. **数据库权限**：确保应用有权限写入 `operation_logs` 表

2. **用户认证**：
   - 有认证的API会记录实际用户ID
   - 无认证的API（如沙箱文件API）会使用 "system" 作为账户ID

3. **错误处理**：审计日志记录失败不会影响主业务流程，只会在控制台打印错误

4. **性能考虑**：每次操作都会写数据库，高频操作可能需要考虑异步记录或批量写入

## 完成标准

- [x] `ner_scan.py` 文件没有语法错误和重复代码
- [x] 已添加审计日志记录功能到 NER 扫描操作
- [ ] 后端控制台能看到 `[AUDIT]` 日志输出（需要运行测试）
- [ ] 审计日志页面能显示操作记录（需要运行测试）
- [ ] 统计数据正确更新（需要运行测试）
- [ ] 筛选和分页功能正常工作（需要运行测试）
