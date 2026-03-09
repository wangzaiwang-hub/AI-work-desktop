#!/usr/bin/env python3
"""
Patch script to add global passphrase configuration to sandbox-config.tsx
"""

import re

# Read the original file
with open('web/app/components/data-masking/sandbox-config.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
content = content.replace(
    'import { useSandboxSecurity } from "@/context/sandbox-security-context"',
    'import { useSandboxSecurity } from "@/context/sandbox-security-context"\nimport { generatePassphrase } from "@/lib/data-masking/crypto-utils"'
)

# 2. Add state variables (before configLoaded)
content = content.replace(
    '  const [encryptionEnabled, setEncryptionEnabled] = useState(true)\n  const [configLoaded, setConfigLoaded] = useState(false)',
    '  const [encryptionEnabled, setEncryptionEnabled] = useState(true)\n  const [encryptionPassphrase, setEncryptionPassphrase] = useState("")\n  const [showPassphrase, setShowPassphrase] = useState(false)\n  const [passphraseSaved, setPassphraseSaved] = useState(false)\n  const [configLoaded, setConfigLoaded] = useState(false)'
)

# 3. Add passphrase loading in useEffect
content = content.replace(
    '      const enc = remote.mapping_encryption_enabled\n      if (enc !== undefined) { setEncryptionEnabled(enc !== "false"); localStorage.setItem("mapping_encryption_enabled", enc) }\n      else { const l = localStorage.getItem("mapping_encryption_enabled"); if (l !== null) setEncryptionEnabled(l !== "false"); else setEncryptionEnabled(true) }\n      const sec = remote.sandbox_security_enabled',
    '      const enc = remote.mapping_encryption_enabled\n      if (enc !== undefined) { setEncryptionEnabled(enc !== "false"); localStorage.setItem("mapping_encryption_enabled", enc) }\n      else { const l = localStorage.getItem("mapping_encryption_enabled"); if (l !== null) setEncryptionEnabled(l !== "false"); else setEncryptionEnabled(true) }\n      const pass = remote.mapping_encryption_passphrase || localStorage.getItem("mapping_encryption_passphrase") || ""\n      if (pass) { setEncryptionPassphrase(pass); localStorage.setItem("mapping_encryption_passphrase", pass) }\n      const sec = remote.sandbox_security_enabled'
)

# 4. Add passphrase persistence
content = content.replace(
    '        const lp = localStorage.getItem("sandbox_export_pin"); if (lp) m.sandbox_export_pin = lp\n        if (Object.keys(m).length > 0) saveUserConfig(m)',
    '        const lp = localStorage.getItem("sandbox_export_pin"); if (lp) m.sandbox_export_pin = lp\n        const lpass = localStorage.getItem("mapping_encryption_passphrase"); if (lpass) m.mapping_encryption_passphrase = lpass\n        if (Object.keys(m).length > 0) saveUserConfig(m)'
)

# 5. Replace encryption UI section
old_ui = '''        {encryptionEnabled && (
          <div className="mt-3 rounded-md bg-state-accent-hover border border-state-accent-hover-alt px-3 py-2">
            <p className="text-xs text-text-accent">✓ 映射文件将使用AES-256-GCM加密，需要口令才能解密还原</p>
          </div>
        )}'''

new_ui = '''        {encryptionEnabled && (
          <>
            <div className="mt-3 rounded-md bg-state-accent-hover border border-state-accent-hover-alt px-3 py-2">
              <p className="text-xs text-text-accent">✓ 映射文件将使用AES-256-GCM加密，需要口令才能解密还原</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">全局加密口令</label>
                <button
                  type="button"
                  onClick={() => {
                    const newPassphrase = generatePassphrase(32)
                    setEncryptionPassphrase(newPassphrase)
                    setShowPassphrase(true)
                  }}
                  className="text-xs text-text-accent hover:underline"
                >
                  生成32位口令
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    value={encryptionPassphrase}
                    onChange={(e) => setEncryptionPassphrase(e.target.value)}
                    placeholder="至少32位字符"
                    className="w-full rounded-md border border-components-input-border-active bg-components-input-bg-normal px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-state-accent-solid font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="px-3 py-2 text-sm text-text-accent hover:underline whitespace-nowrap"
                >
                  {showPassphrase ? "隐藏" : "显示"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (encryptionPassphrase) {
                      navigator.clipboard.writeText(encryptionPassphrase)
                    }
                  }}
                  disabled={!encryptionPassphrase}
                  className="px-3 py-2 text-sm text-text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  复制
                </button>
              </div>
              {encryptionPassphrase && encryptionPassphrase.length < 32 && (
                <p className="text-xs text-text-warning">
                  口令长度不足，需要至少32位字符（当前: {encryptionPassphrase.length}）
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  if (encryptionPassphrase.length >= 32) {
                    persistSetting("mapping_encryption_passphrase", encryptionPassphrase)
                    setPassphraseSaved(true)
                    setTimeout(() => setPassphraseSaved(false), 2000)
                  }
                }}
                disabled={encryptionPassphrase.length < 32}
                className="inline-flex items-center rounded-md bg-components-button-primary-bg px-4 py-2 text-sm font-medium text-components-button-primary-text hover:bg-components-button-primary-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passphraseSaved ? "已保存 ✓" : "保存口令"}
              </button>
              {encryptionPassphrase.length >= 32 && (
                <div className="rounded-md bg-state-warning-hover border border-state-warning-hover-alt px-3 py-2">
                  <p className="text-xs text-text-warning">
                    ⚠️ 请妥善保管此口令，反脱敏时需要使用，丢失后无法恢复原始数据
                  </p>
                </div>
              )}
            </div>
          </>
        )}'''

content = content.replace(old_ui, new_ui)

# Write the modified content
with open('web/app/components/data-masking/sandbox-config.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully patched sandbox-config.tsx")
print("📝 Added:")
print("  - Import for generatePassphrase")
print("  - 3 state variables (encryptionPassphrase, showPassphrase, passphraseSaved)")
print("  - Passphrase loading in useEffect")
print("  - Passphrase persistence")
print("  - Complete passphrase configuration UI")
