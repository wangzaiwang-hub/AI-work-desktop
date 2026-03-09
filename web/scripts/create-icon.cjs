const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function createIcon() {
  const inputFile = path.join(__dirname, '../public/logo/CheersAI.png')
  const outputDir = path.join(__dirname, '../electron')
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log('🎨 正在生成 Windows 图标文件...')

  try {
    await sharp(inputFile)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon.png'))

    console.log('✅ 图标文件已生成: electron/icon.png')
  } catch (error) {
    console.error('❌ 生成图标失败:', error.message)
    process.exit(1)
  }
}

createIcon()
