const fs = require('fs')
const path = require('path')

// 查找所有动态路由的 page.tsx 文件
function findDynamicRoutes(dir, routes = [], parentHasDynamic = false) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  // 检查当前目录是否是动态路由
  const isDynamic = path.basename(dir).includes('[') && path.basename(dir).includes(']')
  const hasDynamic = parentHasDynamic || isDynamic

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      // 递归搜索
      findDynamicRoutes(fullPath, routes, hasDynamic)
    } else if (file.name === 'page.tsx' && hasDynamic) {
      // 如果父路径中有动态路由，且当前是 page.tsx
      routes.push(fullPath)
    }
  }

  return routes
}

// 检查文件是否是客户端组件
function isClientComponent(content) {
  // 检查文件开头是否有 'use client' 指令
  const trimmed = content.trimStart()
  return trimmed.startsWith("'use client'") || trimmed.startsWith('"use client"')
}

// 将客户端页面包装为服务端页面 + _client-page.tsx
function wrapClientPage(filePath, content) {
  const dir = path.dirname(filePath)
  const clientPath = path.join(dir, '_client-page.tsx')

  // 如果内容中已有 generateStaticParams，先移除它（之前错误添加的）
  let cleanContent = content
  cleanContent = cleanContent.replace(/export\s+const\s+dynamicParams\s*=\s*false\s*;?\s*\n?/g, '')
  cleanContent = cleanContent.replace(/export\s+async\s+function\s+generateStaticParams\s*\(\s*\)\s*\{[^}]*\}\s*\n?/g, '')
  cleanContent = cleanContent.trim() + '\n'

  // 写入 _client-page.tsx
  fs.writeFileSync(clientPath, cleanContent, 'utf-8')

  // 找到默认导出的组件名
  const defaultExportMatch = cleanContent.match(/export\s+default\s+(?:function\s+)?(\w+)/)
  const componentName = defaultExportMatch ? defaultExportMatch[1] : 'ClientPage'

  // 创建服务端包装器 page.tsx
  const serverPage = [
    `import ${componentName} from './_client-page'`,
    '',
    'export const dynamicParams = false',
    '',
    'export async function generateStaticParams() {',
    '  return []',
    '}',
    '',
    `export default function Page(props: any) {`,
    `  return <${componentName} {...props} />`,
    '}',
    '',
  ].join('\n')

  fs.writeFileSync(filePath, serverPage, 'utf-8')
  console.log(`✅ 已包装 ${filePath} (客户端 → _client-page.tsx + 服务端包装器)`)
  return true
}

// 为页面添加 generateStaticParams
function addGenerateStaticParams(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')

  const hasGenerateStaticParams = content.includes('generateStaticParams')
  const clientComponent = isClientComponent(content)

  // Case 1: 已有 generateStaticParams 且是客户端组件 → 需要包装
  if (hasGenerateStaticParams && clientComponent) {
    console.log(`🔧 修复 ${filePath} (客户端组件不能有 generateStaticParams，需要包装)`)
    return wrapClientPage(filePath, content)
  }

  // Case 2: 已有 generateStaticParams 且不是客户端组件 → 跳过
  if (hasGenerateStaticParams && !clientComponent) {
    console.log(`⏭️  跳过 ${filePath} (已存在且是服务端组件)`)
    return false
  }

  // Case 3: 没有 generateStaticParams 且是客户端组件 → 包装
  if (!hasGenerateStaticParams && clientComponent) {
    return wrapClientPage(filePath, content)
  }

  // Case 4: 没有 generateStaticParams 且不是客户端组件 → 直接添加
  const lines = content.split('\n')
  let insertIndex = 0

  // 找到第一个非空行
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      insertIndex = i
      break
    }
  }

  const newLines = [
    ...lines.slice(0, insertIndex),
    'export const dynamicParams = false',
    '',
    'export async function generateStaticParams() {',
    '  return []',
    '}',
    '',
    ...lines.slice(insertIndex),
  ]

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8')
  console.log(`✅ 已添加到 ${filePath}`)
  return true
}

// 主函数
function main() {
  const appDir = path.join(__dirname, '../app')
  const routes = findDynamicRoutes(appDir)

  console.log(`\n找到 ${routes.length} 个动态路由页面:\n`)

  let modified = 0
  for (const route of routes) {
    if (addGenerateStaticParams(route)) {
      modified++
    }
  }

  console.log(`\n✅ 完成！修改了 ${modified} 个文件`)
}

main()
