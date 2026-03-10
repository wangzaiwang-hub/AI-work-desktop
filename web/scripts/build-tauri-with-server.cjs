#!/usr/bin/env node

/**
 * Tauri 完整打包脚本（包含 Next.js 服务器）
 * 
 * 步骤：
 * 1. 构建 Next.js 应用
 * 2. 打包 Next.js 服务器
 * 3. 下载 Node.js 运行时（可选）
 * 4. 构建 Tauri 应用
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🚀 开始 Tauri 完整打包流程...\n');

const isDebug = process.argv.includes('--debug');
const skipNodeDownload = process.argv.includes('--skip-node-download');

// 步骤 1: 备份和修改 layout.tsx
console.log('📦 步骤 1: 准备前端代码...');
const layoutPath = path.join(__dirname, '../app/layout.tsx');
const layoutBackupPath = path.join(__dirname, '../app/layout.tsx.backup');

if (fs.existsSync(layoutPath)) {
  fs.copyFileSync(layoutPath, layoutBackupPath);
  
  let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  layoutContent = layoutContent.replace(
    /import { Instrument_Serif } from 'next\/font\/google'/,
    '// import { Instrument_Serif } from \'next/font/google\''
  );
  layoutContent = layoutContent.replace(
    /const instrumentSerif = Instrument_Serif\({[\s\S]*?}\)/,
    '// const instrumentSerif = Instrument_Serif({ weight: [\'400\'], style: [\'normal\', \'italic\'], subsets: [\'latin\'], display: \'swap\', })'
  );
  layoutContent = layoutContent.replace(
    /className={cn\(instrumentSerif\.className,/g,
    'className={cn('
  );
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('✅ 前端代码准备完成\n');
}

try {
  // 步骤 2: 构建 Next.js
  console.log('🔨 步骤 2: 构建 Next.js 应用...');
  execSync('pnpm build:docker', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Next.js 构建完成\n');

  // 步骤 3: 准备服务器文件
  console.log('📋 步骤 3: 准备服务器文件...');
  const serverDir = path.join(__dirname, '../dist-server');
  const standaloneDir = path.join(__dirname, '../.next/standalone');
  
  // 清理旧文件
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
  }
  fs.mkdirSync(serverDir, { recursive: true });

  // 创建服务器入口
  const serverEntry = `
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

console.log('Starting Next.js server...');

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(\`> Next.js server ready on http://\${hostname}:\${port}\`);
    });
});
`;

  fs.writeFileSync(path.join(serverDir, 'server.js'), serverEntry);

  // 复制 standalone 构建（包括 node_modules，这是必需的）
  if (fs.existsSync(standaloneDir)) {
    console.log('  📁 复制 standalone 文件...');
    copyRecursiveSync(standaloneDir, serverDir);
  }

  // 复制 static 文件
  const staticDir = path.join(__dirname, '../.next/static');
  const targetStaticDir = path.join(serverDir, '.next/static');
  if (fs.existsSync(staticDir)) {
    console.log('  📁 复制 static 文件...');
    fs.mkdirSync(path.dirname(targetStaticDir), { recursive: true });
    copyRecursiveSync(staticDir, targetStaticDir);
  }

  // 复制 public 文件
  const publicDir = path.join(__dirname, '../public');
  const targetPublicDir = path.join(serverDir, 'public');
  if (fs.existsSync(publicDir)) {
    console.log('  📁 复制 public 文件...');
    copyRecursiveSync(publicDir, targetPublicDir);
  }

  console.log('✅ 服务器文件准备完成\n');

  // 步骤 4: 下载 Node.js 运行时（可选）
  if (!skipNodeDownload) {
    console.log('📥 步骤 4: 下载 Node.js 运行时...');
    console.log('⚠️  此步骤需要较长时间，可以使用 --skip-node-download 跳过');
    console.log('💡 跳过后需要用户系统安装 Node.js\n');
    
    // TODO: 实现 Node.js 下载逻辑
    console.log('⏭️  暂时跳过 Node.js 下载，使用系统 Node.js\n');
  }

  // 步骤 5: 构建 Tauri
  console.log('🔨 步骤 5: 构建 Tauri 应用...');
  const buildCommand = isDebug ? 'tauri build --debug' : 'tauri build';
  
  execSync(`pnpm ${buildCommand}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('\\n✅ Tauri 打包完成！');
  console.log('\\n📦 输出位置:');
  console.log('  Windows: src-tauri/target/release/bundle/');
  console.log('  macOS: src-tauri/target/release/bundle/');
  console.log('  Linux: src-tauri/target/release/bundle/');

} catch (error) {
  console.error('\\n❌ 打包失败:', error.message);
  process.exit(1);
} finally {
  // 恢复 layout.tsx
  if (fs.existsSync(layoutBackupPath)) {
    console.log('\\n🔄 恢复 layout.tsx...');
    fs.copyFileSync(layoutBackupPath, layoutPath);
    fs.unlinkSync(layoutBackupPath);
    console.log('✅ 文件已恢复');
  }
}

// 辅助函数：递归复制目录
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
