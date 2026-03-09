/**
 * Tauri 文件系统桥接工具
 * 在 Tauri 环境下使用 Rust 后端直接读写本地文件
 * 在浏览器环境下回退到 IndexedDB
 */

export interface LocalFileInfo {
  name: string
  size: number
  created_at: string
}

let _invoke: ((cmd: string, args?: Record<string, unknown>) => Promise<unknown>) | null = null

async function getInvoke() {
  if (_invoke) return _invoke
  try {
    const mod = await import('@tauri-apps/api/core')
    _invoke = mod.invoke
    return _invoke
  }
  catch {
    return null
  }
}

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

export async function writeFileToSandbox(dir: string, fileName: string, content: string): Promise<string> {
  const invoke = await getInvoke()
  if (!invoke) throw new Error('Tauri 环境不可用')
  return invoke('sandbox_write_file', { dir, fileName, content }) as Promise<string>
}

export async function readFileFromSandbox(path: string): Promise<string> {
  const invoke = await getInvoke()
  if (!invoke) throw new Error('Tauri 环境不可用')
  return invoke('sandbox_read_file', { path }) as Promise<string>
}

export async function listSandboxFiles(dir: string): Promise<LocalFileInfo[]> {
  const invoke = await getInvoke()
  if (!invoke) throw new Error('Tauri 环境不可用')
  return invoke('sandbox_list_files', { dir }) as Promise<LocalFileInfo[]>
}

export async function deleteSandboxFile(path: string): Promise<void> {
  const invoke = await getInvoke()
  if (!invoke) throw new Error('Tauri 环境不可用')
  await invoke('sandbox_delete_file', { path })
}

export async function ensureSandboxDir(dir: string): Promise<boolean> {
  const invoke = await getInvoke()
  if (!invoke) throw new Error('Tauri 环境不可用')
  return invoke('sandbox_ensure_dir', { dir }) as Promise<boolean>
}
