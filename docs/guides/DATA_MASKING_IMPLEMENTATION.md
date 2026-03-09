# 数据脱敏功能实现说明

## 概述

本文档说明数据脱敏功能的前端实现和后端接口规范。

## 前端实现

### 1. 路由配置

新增路由：`/data-masking`

- 路径：`web/app/(commonLayout)/data-masking/page.tsx`
- 使用 commonLayout 布局，包含标准的 Header 和侧边栏

### 2. 组件结构

```
web/app/components/data-masking/
└── list.tsx                    # 数据脱敏规则列表组件
```

### 3. 服务层

- 文件：`web/service/data-masking.ts`
- 包含所有与数据脱敏相关的 API 调用函数
- 使用 SWR 进行数据获取和缓存

### 4. 国际化

已添加的翻译键（`web/i18n/en-US/common.json` 和 `web/i18n/zh-Hans/common.json`）：

- `menus.dataMasking` - 菜单名称
- `dataMasking.title` - 页面标题
- `dataMasking.description` - 页面描述
- `dataMasking.createRule` - 创建规则按钮
- `dataMasking.createFirstRule` - 创建第一条规则按钮
- `dataMasking.noRules` - 无规则提示
- `dataMasking.noRulesDescription` - 无规则描述
- `dataMasking.enabled` - 已启用状态
- `dataMasking.disabled` - 已禁用状态
- `dataMasking.ruleName` - 规则名称
- `dataMasking.ruleType` - 规则类型
- `dataMasking.pattern` - 匹配模式
- `dataMasking.maskChar` - 脱敏字符
- `dataMasking.actions` - 操作

### 5. 导航集成

- 文件：`web/app/components/header/data-masking-nav/index.tsx`
- 已集成到主导航栏（Header）中
- 位置：在 Tools 导航项之后

## 后端接口规范

### API 端点

所有接口的基础路径：`/console/api/data-masking`

#### 1. 获取规则列表

```
GET /console/api/data-masking/rules
```

**响应：**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "pattern": "string",
      "maskChar": "string",
      "enabled": boolean,
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "total": number
}
```

#### 2. 创建规则

```
POST /console/api/data-masking/rules
```

**请求体：**
```json
{
  "name": "string",
  "type": "string",
  "pattern": "string",
  "maskChar": "string",
  "enabled": boolean
}
```

**响应：** MaskingRule 对象

#### 3. 获取规则详情

```
GET /console/api/data-masking/rules/{rule_id}
```

**响应：** MaskingRule 对象

#### 4. 更新规则

```
PATCH /console/api/data-masking/rules/{rule_id}
```

**请求体：**
```json
{
  "name": "string (optional)",
  "type": "string (optional)",
  "pattern": "string (optional)",
  "maskChar": "string (optional)",
  "enabled": "boolean (optional)"
}
```

**响应：** MaskingRule 对象

#### 5. 删除规则

```
DELETE /console/api/data-masking/rules/{rule_id}
```

**响应：**
```json
{
  "result": "success"
}
```

#### 6. 批量操作

```
POST /console/api/data-masking/rules/batch
```

**请求体：**
```json
{
  "ruleIds": ["string"],
  "enabled": boolean
}
```

**响应：**
```json
{
  "success": boolean
}
```

### 数据模型

#### MaskingRule

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 规则唯一标识 |
| name | string | 规则名称 |
| type | string | 规则类型（如：phone, email, id_card, custom） |
| pattern | string | 正则表达式匹配模式 |
| maskChar | string | 脱敏字符（如：*） |
| enabled | boolean | 是否启用 |
| createdAt | string | 创建时间（ISO 8601 格式） |
| updatedAt | string | 更新时间（ISO 8601 格式） |

## 后端实现待办

### 1. 数据库模型

需要在 `api/models/` 中创建数据脱敏规则的数据库模型。

建议表结构：
```python
class DataMaskingRule(db.Model):
    __tablename__ = 'data_masking_rules'
    
    id = db.Column(StringUUID, primary_key=True)
    tenant_id = db.Column(StringUUID, nullable=False)  # 租户隔离
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    pattern = db.Column(db.Text, nullable=False)
    mask_char = db.Column(db.String(10), nullable=False, default='*')
    enabled = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### 2. 控制器实现

在 `api/controllers/console/data_masking/` 目录下实现：

- `rules.py` - 规则管理的控制器
- 需要实现权限验证（只有管理员可以管理规则）
- 需要实现租户隔离

### 3. 服务层实现

在 `api/services/` 目录下创建：

- `data_masking_service.py` - 数据脱敏规则的业务逻辑
- 包含规则的 CRUD 操作
- 包含规则应用逻辑（实际的数据脱敏处理）

### 4. 数据库迁移

创建 Alembic 迁移文件：
```bash
cd api
uv run --project api flask db migrate -m "Add data masking rules table"
uv run --project api flask db upgrade
```

### 5. 路由注册

在 `api/extensions/ext_blueprints.py` 中注册数据脱敏相关的蓝图。

### 6. 权限控制

- 只有 Admin 和 Owner 角色可以管理数据脱敏规则
- 需要在控制器中添加 `@account_initialization_required` 和权限检查装饰器

## 前端待完善功能

当后端接口实现后，需要在前端完善以下功能：

1. **取消注释 SWR 数据获取代码**
   - 在 `web/app/components/data-masking/list.tsx` 中
   - 删除临时的本地状态管理

2. **实现创建规则弹窗**
   - 创建表单组件
   - 包含规则类型选择、名称、匹配模式、脱敏字符等字段
   - 表单验证

3. **实现编辑规则功能**
   - 编辑弹窗
   - 调用更新接口

4. **实现删除规则功能**
   - 确认对话框
   - 调用删除接口

5. **实现规则启用/禁用切换**
   - 开关组件
   - 调用更新接口

6. **实现批量操作**
   - 多选功能
   - 批量启用/禁用

7. **添加错误处理和成功提示**
   - 使用 Toast 组件显示操作结果

8. **添加加载状态**
   - Skeleton 加载占位符
   - 按钮加载状态

## 测试

### 前端测试

```bash
cd web
pnpm test
```

### 后端测试

```bash
cd api
uv run --project api pytest tests/unit/services/test_data_masking_service.py
```

## 部署注意事项

1. 确保数据库迁移已执行
2. 检查权限配置是否正确
3. 验证租户隔离是否生效
4. 测试所有 API 端点

## 相关文件清单

### 前端文件
- `web/app/(commonLayout)/data-masking/page.tsx` - 页面入口
- `web/app/components/data-masking/list.tsx` - 列表组件
- `web/app/components/header/data-masking-nav/index.tsx` - 导航组件
- `web/app/components/header/index.tsx` - Header 组件（已更新）
- `web/service/data-masking.ts` - API 服务
- `web/i18n/en-US/common.json` - 英文翻译（已更新）
- `web/i18n/zh-Hans/common.json` - 中文翻译（已更新）

### 后端文件（待创建）
- `api/controllers/console/data_masking/__init__.py` - 控制器入口（已创建占位）
- `api/controllers/console/data_masking/rules.py` - 规则控制器（待创建）
- `api/services/data_masking_service.py` - 服务层（待创建）
- `api/models/data_masking.py` - 数据模型（待创建）
- `api/migrations/versions/xxx_add_data_masking_rules.py` - 数据库迁移（待创建）

## 下一步

1. 实现后端数据库模型
2. 实现后端 API 控制器
3. 实现后端服务层逻辑
4. 创建并执行数据库迁移
5. 前端取消注释并完善功能
6. 编写单元测试
7. 进行集成测试
