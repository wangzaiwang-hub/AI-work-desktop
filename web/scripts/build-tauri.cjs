#!/usr/bin/env node

/**
 * Tauri 打包脚本
 * 处理 Google Fonts 网络问题和其他打包相关配置
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Tauri 打包流程...\n');

// 1. 备份 layout.tsx
const layoutPath = path.join(__dirname, '../app/layout.tsx');
const layoutBackupPath = path.join(__dirname, '../app/layout.tsx.backup');

console.log('📦 备份 layout.tsx...');
fs.copyFileSync(layoutPath, layoutBackupPath);

try {
  // 2. 临时移除 Google Fonts
  console.log('🔧 临时移除 Google Fonts...');
  let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  // 注释掉 Google Fonts 导入
  layoutContent = layoutContent.replace(
    /import { Instrument_Serif } from 'next\/font\/google'/,
    '// import { Instrument_Serif } from \'next/font/google\' // Temporarily disabled for build'
  );
  
  // 注释掉 font 初始化
  layoutContent = layoutContent.replace(
    /const instrumentSerif = Instrument_Serif\({[\s\S]*?}\)/,
    '// const instrumentSerif = Instrument_Serif({ weight: [\'400\'], style: [\'normal\', \'italic\'], subsets: [\'latin\'], display: \'swap\', }) // Temporarily disabled for build'
  );
  
  // 移除 className 中的 font 引用
  layoutContent = layoutContent.replace(
    /className={cn\(instrumentSerif\.className,/g,
    'className={cn('
  );
  
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('✅ Google Fonts 已临时移除\n');

  // 3. 执行 Tauri 打包
  console.log('🔨 开始构建 Tauri 应用...\n');
  const buildCommand = process.argv[2] === 'debug' ? 'tauri build --debug' : 'tauri build';
  
  execSync(`pnpm ${buildCommand}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  console.log('\n✅ Tauri 打包完成！');
  
} catch (error) {
  console.error('\n❌ 打包失败:', error.message);
  process.exit(1);
} finally {
  // 4. 恢复 layout.tsx
  console.log('\n🔄 恢复 layout.tsx...');
  fs.copyFileSync(layoutBackupPath, layoutPath);
  fs.unlinkSync(layoutBackupPath);
  console.log('✅ 文件已恢复');
}
