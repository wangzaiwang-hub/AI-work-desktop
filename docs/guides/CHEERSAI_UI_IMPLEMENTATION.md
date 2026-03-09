# CheersAI UI 规范实施文档

版本：v1.0  
基于：CheersAI产品UI规范.md  
实施日期：2026-02-04

## 📋 实施概览

本文档记录了 CheersAI UI 规范在 Dify 项目中的完整实施情况。

---

## ✅ 已实施的规范

### 1. 色彩体系 ✅

#### 1.1 主色（品牌色）
```css
--primary-blue: #3b82f6;       /* 主蓝色 */
--primary-blue-dark: #2563eb;  /* 深蓝色 */
--primary-blue-light: #60a5fa; /* 浅蓝色 */
```
**实施位置**：
- `web/themes/cheersai-theme.css` - CSS 变量定义
- `web/tailwind-common-config.ts` - Tailwind 配置

#### 1.2 功能色
```css
--success-green: #10b981; /* 成功/在线 */
--warning-yellow: #f59e0b; /* 警告 */
--error-red: #ef4444;      /* 错误 */
--info-purple: #8b5cf6;    /* 信息/智能体 */
```
**实施位置**：`web/themes/cheersai-theme.css`

#### 1.3 中性色
```css
--gray-50: #f9fafb;   /* 背景色 */
--gray-100: #f3f4f6;  /* 次级背景 */
--gray-200: #e5e7eb;  /* 边框 */
--gray-300: #d1d5db;  /* 次要边框 */
--gray-600: #4b5563;  /* 次要文字 */
--gray-900: #111827;  /* 主要文字 */
```
**实施位置**：`web/themes/cheersai-theme.css`

#### 1.4 渐变规范
- **侧边栏/导航栏**：`linear-gradient(180deg, #111827 0%, #1f2937 100%)`
- **功能卡片**：
  - 蓝色：`linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`
  - 紫色：`linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`
  - 绿色：`linear-gradient(135deg, #10b981 0%, #059669 100%)`

**实施位置**：`web/themes/cheersai-theme.css`  
**CSS 类**：`.feature-card-blue`, `.feature-card-purple`, `.feature-card-green`

#### 1.5 功能模块颜色映射
| 功能模块 | 主色 | 辅色 | CSS 变量 |
|---------|------|------|----------|
| 脱敏沙箱 | #3b82f6 | #2563eb | `--module-desensitization-primary/secondary` |
| 工作流 | #8b5cf6 | #7c3aed | `--module-workflow-primary/secondary` |
| 智能体 | #10b981 | #059669 | `--module-agent-primary/secondary` |
| 知识库 | #f59e0b | #d97706 | `--module-knowledge-primary/secondary` |

**实施位置**：`web/themes/cheersai-theme.css`

#### 1.6 高亮标注（脱敏沙箱）
- 人名高亮：`#fef3c7` - `.highlight-person`
- 账号高亮：`#dbeafe` - `.highlight-account`
- 金额高亮：`#fed7aa` - `.highlight-amount`

---

### 2. 字体与排版 ✅

#### 2.1 字体栈
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
```
**实施位置**：`web/themes/cheersai-theme.css` (全局 html, body)

#### 2.2 字号与行高
| 用途 | CSS 类 | 大小 | 权重 | 行高 |
|------|--------|------|------|------|
| 页面标题 | `.text-cheers-page-title` | 24px | 700 | 1.2 |
| 区块标题 | `.text-cheers-section-title` | 20px | 600 | 1.3 |
| 卡片标题 | `.text-cheers-card-title` | 18px | 600 | 1.4 |
| 正文 | `.text-cheers-body` | 14px | 400 | 1.5 |
| 辅助文字 | `.text-cheers-caption` | 12px | 400 | 1.4 |
| 小号文字 | `.text-cheers-small` | 10px | 400 | 1.3 |

**实施位置**：`web/themes/cheersai-theme.css`

---

### 3. 间距与布局度量 ✅

#### 3.1 间距系统（基于 4px 基准单位）
| 间距 | 值 | CSS 类 |
|------|-----|--------|
| 极小间距 | 4px (0.25rem) | `.space-cheers-xs` |
| 小间距 | 8px (0.5rem) | `.space-cheers-sm` |
| 中小间距 | 12px (0.75rem) | `.space-cheers-md` |
| 标准间距 | 16px (1rem) | `.space-cheers` |
| 大间距 | 24px (1.5rem) | `.space-cheers-lg` |
| 超大间距 | 32px (2rem) | `.space-cheers-xl` |
| 区块间距 | 48px (3rem) | `.space-cheers-2xl` |

**实施位置**：`web/themes/cheersai-theme.css`

#### 3.2 圆角规范
| 用途 | 值 | CSS 类 |
|------|-----|--------|
| 小元素 | 2px | `.rounded-cheers-sm` |
| 按钮/输入框 | 4px | `.rounded-cheers` |
| 卡片 | 8px | `.rounded-cheers-lg` |
| 大卡片 | 12px | `.rounded-cheers-xl` |
| 气泡 | 16px | `.rounded-cheers-2xl` |
| 圆形 | 9999px | Tailwind `.rounded-full` |

**实施位置**：`web/themes/cheersai-theme.css`

#### 3.3 阴影系统
| 级别 | CSS 类 | 阴影值 |
|------|--------|--------|
| 极小 | `.shadow-cheers-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| 小 | `.shadow-cheers` | `0 1px 3px rgba(0, 0, 0, 0.1)` |
| 中 | `.shadow-cheers-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| 大 | `.shadow-cheers-lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` |
| 超大 | `.shadow-cheers-xl` | `0 20px 25px rgba(0, 0, 0, 0.1)` |
| 悬浮 | `.shadow-cheers-xl-hover:hover` | `0 20px 25px rgba(0, 0, 0, 0.15)` |

**实施位置**：`web/themes/cheersai-theme.css`

---

### 4. 动效标准 ✅

#### 4.1 过渡时长
| 速度 | 时长 | CSS 类 | 缓动函数 |
|------|------|--------|----------|
| 快速反馈 | 150ms | `.transition-cheers-fast` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 标准过渡 | 200ms | `.transition-cheers-base` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 慢速动画 | 300ms | `.transition-cheers-slow` | `cubic-bezier(0.4, 0, 0.2, 1)` |

**实施位置**：`web/themes/cheersai-theme.css`

#### 4.2 既定动效模式
- **卡片悬浮**：`.card-hover-effect` - 300ms 过渡 + 上移 2px + 阴影增强
- **进度条**：`.progress-cheers` + `.progress-cheers-bar` - 300ms ease

**实施位置**：`web/themes/cheersai-theme.css`

---

### 5. 组件规范 ✅

#### 5.1 按钮
| 类型 | CSS 类 | 样式特征 |
|------|--------|----------|
| 主要按钮 | `.btn-cheers-primary` | 蓝色背景，白色文字，8px 圆角 |
| 次要按钮 | `.btn-cheers-secondary` | 透明背景，灰色边框，8px 圆角 |
| 图标按钮 | `.btn-cheers-icon` | 40×40px，8px 圆角 |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.2 输入控件
| 类型 | CSS 类 | 样式特征 |
|------|--------|----------|
| 文本输入框 | `.input-cheers` | 1px 边框，8px 圆角，focus 蓝色边框 + ring |
| 多行文本框 | `.textarea-cheers` | 最小高度 96px，不可调整大小 |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.3 徽章
| 类型 | CSS 类 | 背景色 | 文字色 |
|------|--------|--------|--------|
| 成功 | `.badge-cheers-success` | #d1fae5 | #065f46 |
| 警告 | `.badge-cheers-warning` | #fef3c7 | #92400e |
| 错误 | `.badge-cheers-error` | #fee2e2 | #991b1b |
| 信息 | `.badge-cheers-info` | #dbeafe | #1e40af |
| 主要 | `.badge-cheers-primary` | #3b82f6 | white |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.4 表格
| 元素 | CSS 类 | 样式特征 |
|------|--------|----------|
| 表格容器 | `.table-cheers` | 100% 宽度，边框合并 |
| 表头 | `.table-cheers th` | 11px 大写，灰色背景 |
| 单元格 | `.table-cheers td` | 14px，16px 24px padding |
| 行悬浮 | `.table-cheers tr:hover` | 浅灰背景 |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.5 导航菜单项
| 状态 | CSS 类 | 样式特征 |
|------|--------|----------|
| 基础 | `.nav-item-cheers` | 48px 高度，8px 圆角 |
| 悬浮 | `.nav-item-cheers:hover` | 半透明白色背景 |
| 激活 | `.nav-item-cheers.active` | 蓝色背景，白色文字 |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.6 统计卡片
| 元素 | CSS 类 | 样式特征 |
|------|--------|----------|
| 容器 | `.stat-card-cheers` | 白色背景，1px 边框，8px 圆角 |
| 数值 | `.stat-card-cheers .value` | 24px，粗体 |
| 标签 | `.stat-card-cheers .label` | 14px，灰色 |

**实施位置**：`web/themes/cheersai-theme.css`

#### 5.7 其他组件
- **消息气泡**：`.message-bubble-ai`, `.message-bubble-user`
- **文件上传区**：`.upload-area-cheers`
- **WORM 审计条**：`.worm-audit-bar`
- **进度条**：`.progress-cheers`, `.progress-cheers-bar`

**实施位置**：`web/themes/cheersai-theme.css`

---

## 📦 文件清单

### 核心文件
1. **`web/themes/cheersai-theme.css`** - 主题样式文件（新建）
   - 色彩变量定义
   - 组件样式类
   - 工具类

2. **`web/tailwind-common-config.ts`** - Tailwind 配置
   - 主色调配置
   - 扩展颜色定义

3. **`web/app/styles/globals.css`** - 全局样式
   - 导入 cheersai-theme.css

### Logo 文件
4. **`web/public/logo/`** - Logo 资源
   - `CheersAI.png` (1024×1024) - 原始 Logo
   - `logo.png` (28px) - 标准 Logo
   - `logo-monochrome-white.png` (28px) - 单色白色 Logo
   - `logo-embedded-chat-header.png` (24/48/72px) - 聊天头部 Logo
   - `logo-embedded-chat-avatar.png` (40×40) - 聊天头像
   - `logo-site.png` (32px) - 站点 Logo
   - `logo-site-dark.png` (32px) - 深色站点 Logo

5. **`web/scripts/convert-logo.js`** - Logo 转换脚本

### 组件文件
6. **`web/app/components/base/logo/dify-logo.tsx`** - Logo 组件
   - 已更新为使用 PNG
   - Alt 文本改为 "CheersAI logo"

7. **`web/app/components/header/index.tsx`** - Header 组件
   - 默认品牌名改为 "CheersAI"

### 翻译文件（英文）
8. **`web/i18n/en-US/`** - 英文翻译（9个文件已更新）
   - `login.json`
   - `workflow.json`
   - `tools.json`
   - `plugin.json`
   - `plugin-trigger.json`
   - `explore.json`
   - `oauth.json`
   - `education.json`

### 翻译文件（简体中文）
9. **`web/i18n/zh-Hans/`** - 简体中文翻译（15个文件已更新）
   - `login.json`
   - `workflow.json`
   - `tools.json`
   - `plugin.json`
   - `plugin-trigger.json`
   - `oauth.json`
   - `explore.json`
   - `education.json`
   - `dataset.json`
   - `dataset-settings.json`
   - `dataset-pipeline.json`
   - `dataset-creation.json`
   - `dataset-documents.json`
   - `custom.json`
   - `common.json`

### 元数据文件
10. **`web/public/manifest.json`** - PWA 清单
    - 应用名称改为 "CheersAI"

11. **`web/app/layout.tsx`** - 布局文件
    - Apple 移动端标题改为 "CheersAI"

### 文档文件
12. **`CHEERSAI_THEME_CHANGES.md`** - 主题变更说明
13. **`SETUP_COMPLETE.md`** - 设置完成文档
14. **`CHEERSAI_UI_IMPLEMENTATION.md`** - 本文档

---

## 🎯 使用指南

### 如何使用 CheersAI 主题样式

#### 1. 使用预定义的 CSS 类

```tsx
// 按钮
<button className="btn-cheers-primary">主要按钮</button>
<button className="btn-cheers-secondary">次要按钮</button>
<button className="btn-cheers-icon">
  <Icon />
</button>

// 输入框
<input className="input-cheers" placeholder="输入内容" />
<textarea className="textarea-cheers" placeholder="多行输入" />

// 徽章
<span className="badge-cheers-success">成功</span>
<span className="badge-cheers-warning">警告</span>
<span className="badge-cheers-error">错误</span>

// 表格
<table className="table-cheers">
  <thead>
    <tr>
      <th>列标题</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>单元格内容</td>
    </tr>
  </tbody>
</table>

// 卡片悬浮效果
<div className="card-hover-effect">
  卡片内容
</div>

// 导航菜单项
<button className="nav-item-cheers active">
  <Icon className="icon" />
  <span>菜单项</span>
</button>
```

#### 2. 使用 CSS 变量

```tsx
// 在组件中使用颜色变量
<div style={{ 
  background: 'var(--primary-blue)',
  color: 'white'
}}>
  使用主色
</div>

// 使用功能模块颜色
<div style={{ 
  background: 'var(--module-workflow-primary)'
}}>
  工作流模块
</div>
```

#### 3. 使用 Tailwind 类

```tsx
// 使用 Tailwind 配置的颜色
<div className="bg-cheers-primary text-white">
  主色背景
</div>

// 使用圆角
<div className="rounded-cheers-lg">
  8px 圆角
</div>

// 使用阴影
<div className="shadow-cheers-md">
  中等阴影
</div>
```

---

## ⚠️ 待实施项

以下规范项目尚未在代码中实施，需要在实际开发中应用：

### 1. 应用结构与页面布局
- 侧边栏固定宽度 256px
- 顶部栏固定高度 64px
- 主内容区 padding 32px

### 2. 业务页面模板
- 工作台（Dashboard）
- 脱敏沙箱（三栏布局）
- 对话应用（Chatbot）
- 知识库（Knowledge Base）
- 模型管理
- 审计日志
- 插件市场
- Prompt 工程
- 系统设置

### 3. 交互流程
- 文件上传流程
- 脱敏处理流程
- 对话流程
- 知识库导入流程

### 4. 图标规范
- 统一使用 Lucide Icons
- 图标尺寸规范

---

## ✅ 验收检查清单

### 色彩一致性
- [x] 主色调使用 #3b82f6
- [x] 功能色正确定义
- [x] 中性色系统完整
- [x] 渐变背景已定义
- [x] 功能模块颜色映射完整

### 排版一致性
- [x] 字体栈已定义
- [x] 字号与行高规范完整
- [x] 文本样式类已创建

### 间距与布局
- [x] 4px 基准间距系统
- [x] 圆角规范完整
- [x] 阴影系统完整

### 动效标准
- [x] 过渡时长定义
- [x] 缓动函数统一
- [x] 卡片悬浮效果

### 组件规范
- [x] 按钮样式完整
- [x] 输入控件样式完整
- [x] 徽章样式完整
- [x] 表格样式完整
- [x] 导航菜单项样式完整
- [x] 统计卡片样式完整

### 品牌替换
- [x] Logo 已替换
- [x] 应用名称已更新
- [x] 英文翻译已更新
- [x] 中文翻译已更新

---

## 📝 开发注意事项

### 1. CSS 优先级
- 优先使用 Tailwind 内置类
- 使用 CheersAI 主题类作为补充
- 避免内联样式（除非必要）

### 2. 颜色使用
- 使用 CSS 变量而非硬编码颜色值
- 遵循功能模块颜色映射
- 保持色彩一致性

### 3. 间距使用
- 严格遵循 4px 基准单位
- 使用预定义的间距类
- 避免随机间距值

### 4. 动效使用
- 使用预定义的过渡时长
- 保持缓动函数一致
- 避免过度动画

### 5. 可访问性
- 确保键盘可操作
- 保持焦点状态可见
- 状态不只依赖颜色

---

## 🔄 更新日志

### v1.0 (2026-02-04)
- ✅ 完成色彩体系实施
- ✅ 完成字体与排版规范
- ✅ 完成间距与布局度量
- ✅ 完成动效标准
- ✅ 完成组件规范
- ✅ 完成 Logo 替换
- ✅ 完成品牌文本替换（中英文）
- ✅ 创建主题样式文件
- ✅ 更新 Tailwind 配置
- ✅ 类型检查通过

---

## 📚 相关文档

- `CheersAI产品UI规范.md` - 原始 UI 规范文档
- `CHEERSAI_THEME_CHANGES.md` - 主题变更详细说明
- `SETUP_COMPLETE.md` - 项目设置完成文档
- `web/public/logo/README.md` - Logo 文件说明

---

**文档维护者**：开发团队  
**最后更新**：2026-02-04
