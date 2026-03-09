# CheersAI 主题修改说明

## 修改日期
2026-02-03

## 修改概述
根据 `CheersAI产品UI规范.md` 对 Dify 项目进行主题定制，使其符合 CheersAI 的品牌视觉规范。

## 已完成的修改

### 1. Logo 替换 ✅
- **位置**: `web/public/logo/`
- **源文件**: `CheersAI.png` (1024x1024px)
- **生成文件**:
  - `logo.png` (28px 高) - 主 Logo
  - `logo-monochrome-white.png` (28px 高) - 暗色主题 Logo
  - `logo-embedded-chat-header.png` (24px/48px/72px) - 聊天头部 Logo
  - `logo-embedded-chat-avatar.png` (40x40px) - 聊天头像
  - `logo-site.png` / `logo-site-dark.png` (32px 高) - 网站图标

- **代码修改**:
  - `web/app/components/base/logo/dify-logo.tsx` - 将 SVG 引用改为 PNG

- **工具脚本**:
  - `web/scripts/convert-logo.js` - Logo 自动转换脚本

### 2. 主题颜色系统 ✅
- **新增文件**: `web/themes/cheersai-theme.css`
- **修改文件**: 
  - `web/app/styles/globals.css` - 引入 CheersAI 主题
  - `web/tailwind-common-config.ts` - 添加 CheersAI 颜色变量

#### 主色调（品牌色）
```css
--primary-blue: #3b82f6;       /* 主蓝色 */
--primary-blue-dark: #2563eb;  /* 深蓝色 */
--primary-blue-light: #60a5fa; /* 浅蓝色 */
```

#### 功能色
```css
--success-green: #10b981; /* 成功/在线 */
--warning-yellow: #f59e0b; /* 警告 */
--error-red: #ef4444;      /* 错误 */
--info-purple: #8b5cf6;    /* 信息/智能体 */
```

#### 中性色
```css
--gray-50: #f9fafb;   /* 背景色 */
--gray-100: #f3f4f6;  /* 次级背景 */
--gray-200: #e5e7eb;  /* 边框 */
--gray-600: #4b5563;  /* 次要文字 */
--gray-900: #111827;  /* 主要文字 */
```

### 3. 组件样式覆盖 ✅

#### 按钮
- 主按钮背景：`#3b82f6`
- 主按钮悬浮：`#2563eb`
- 主按钮禁用：`rgba(59, 130, 246, 0.14)`

#### 表单控件
- 复选框选中：`#3b82f6`
- 单选框选中：`#3b82f6`
- 开关激活：`#3b82f6`
- 输入框激活边框：`#3b82f6`

#### 菜单项
- 激活背景：`rgba(59, 130, 246, 0.08)`
- 激活文字：`#3b82f6`

### 4. 功能模块颜色映射 ✅
根据 CheersAI 规范定义的模块颜色：

| 功能模块 | 主色 | 辅色 |
|---------|------|------|
| 脱敏沙箱 | #3b82f6 | #2563eb |
| 工作流 | #8b5cf6 | #7c3aed |
| 智能体 | #10b981 | #059669 |
| 知识库 | #f59e0b | #d97706 |

### 5. 渐变背景 ✅
```css
/* 侧边栏/导航栏 */
background: linear-gradient(180deg, #111827 0%, #1f2937 100%);

/* 功能卡片 */
.feature-card-blue: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
.feature-card-purple: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
.feature-card-green: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### 6. 高亮标注（脱敏沙箱）✅
```css
.highlight-person: #fef3c7;  /* 人名 - 黄色 */
.highlight-account: #dbeafe; /* 账号 - 蓝色 */
.highlight-amount: #fed7aa;  /* 金额 - 橙色 */
```

### 7. 设计系统工具类 ✅

#### 圆角
- `.rounded-cheers-sm` - 2px
- `.rounded-cheers` - 4px
- `.rounded-cheers-lg` - 8px
- `.rounded-cheers-xl` - 12px
- `.rounded-cheers-2xl` - 16px

#### 阴影
- `.shadow-cheers-sm` - 轻量阴影
- `.shadow-cheers` - 标准阴影
- `.shadow-cheers-md` - 中等阴影
- `.shadow-cheers-lg` - 大阴影
- `.shadow-cheers-xl` - 超大阴影

#### 过渡动画
- `.transition-cheers-fast` - 150ms
- `.transition-cheers-base` - 200ms
- `.transition-cheers-slow` - 300ms

#### 卡片悬浮效果
- `.card-hover-effect` - 上移 2px + 阴影增强

#### 字体规范
- `.text-cheers-page-title` - 24px / bold
- `.text-cheers-section-title` - 20px / semibold
- `.text-cheers-card-title` - 18px / semibold
- `.text-cheers-body` - 14px / normal
- `.text-cheers-caption` - 12px / normal
- `.text-cheers-small` - 10px / normal

## Tailwind 配置更新

### 新增颜色变量
```typescript
'cheers-primary': {
  DEFAULT: '#3b82f6',
  dark: '#2563eb',
  light: '#60a5fa',
},
'cheers-success': '#10b981',
'cheers-warning': '#f59e0b',
'cheers-error': '#ef4444',
'cheers-info': '#8b5cf6',
```

### Primary 颜色更新
```typescript
primary: {
  400: '#60a5fa',  // CheersAI light blue
  500: '#3b82f6',  // CheersAI primary blue
  600: '#2563eb',  // CheersAI dark blue
}
```

## 使用方法

### 在组件中使用 CheersAI 颜色
```tsx
// Tailwind 类名
<button className="bg-cheers-primary hover:bg-cheers-primary-dark">
  按钮
</button>

// CSS 变量
<div style={{ backgroundColor: 'var(--primary-blue)' }}>
  内容
</div>

// 工具类
<div className="rounded-cheers-lg shadow-cheers-md transition-cheers-base">
  卡片
</div>
```

### 功能模块颜色
```tsx
// 脱敏沙箱
<div style={{ backgroundColor: 'var(--module-desensitization-primary)' }}>

// 工作流
<div style={{ backgroundColor: 'var(--module-workflow-primary)' }}>

// 智能体
<div style={{ backgroundColor: 'var(--module-agent-primary)' }}>

// 知识库
<div style={{ backgroundColor: 'var(--module-knowledge-primary)' }}>
```

## 查看效果

1. 确保前端服务正在运行：
   ```bash
   cd web
   $env:PORT=3500; npx pnpm dev
   ```

2. 访问：http://localhost:3500

3. 刷新浏览器查看新的 Logo 和颜色主题

## 后续优化建议

### 1. 侧边栏渐变背景
需要找到侧边栏组件并应用渐变：
```tsx
className="sidebar-gradient"
// 或
style={{ background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)' }}
```

### 2. 功能卡片
为不同功能模块的卡片应用对应的渐变类：
- 脱敏沙箱：`.feature-card-blue`
- 工作流：`.feature-card-purple`
- 智能体：`.feature-card-green`

### 3. 徽章颜色
更新状态徽章使用 CheersAI 的功能色系统

### 4. 图标颜色
确保图标颜色与 CheersAI 规范一致

## 注意事项

1. **主题文件优先级**：`cheersai-theme.css` 在所有主题文件之后导入，确保覆盖默认样式

2. **CSS 变量作用域**：所有 CSS 变量在 `html[data-theme="light"]` 和 `html[data-theme="dark"]` 下都有定义

3. **Tailwind 配置**：修改 `tailwind-common-config.ts` 后需要重启开发服务器

4. **Logo 更新**：如需更新 Logo，运行 `node web/scripts/convert-logo.js`

## 相关文件

- `CheersAI产品UI规范.md` - UI 规范文档
- `web/themes/cheersai-theme.css` - CheersAI 主题样式
- `web/app/styles/globals.css` - 全局样式入口
- `web/tailwind-common-config.ts` - Tailwind 配置
- `web/scripts/convert-logo.js` - Logo 转换脚本
- `web/public/logo/README.md` - Logo 文件说明

## 版本信息

- CheersAI UI 规范版本：v1.0
- 修改日期：2026-02-03
- 修改人：AI Assistant
