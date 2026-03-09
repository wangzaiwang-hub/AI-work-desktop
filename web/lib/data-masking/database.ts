/**
 * 数据脱敏功能数据库管理
 * Data Masking Database Management
 */

export type Database = {
  exec: (sql: string) => unknown
  close: () => void
}

/**
 * 数据库初始化 SQL
 */
export const INIT_SQL = `
-- 脱敏规则表
CREATE TABLE IF NOT EXISTS masking_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  pattern TEXT NOT NULL,
  strategy_type TEXT NOT NULL,
  strategy_config TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 映射表
CREATE TABLE IF NOT EXISTS mappings (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_mappings_file_hash ON mappings(file_hash);

-- 映射条目表
CREATE TABLE IF NOT EXISTS mapping_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mapping_id TEXT NOT NULL,
  original_value_encrypted TEXT NOT NULL,
  masked_value TEXT NOT NULL,
  position INTEGER NOT NULL,
  rule_id TEXT NOT NULL,
  context TEXT,
  FOREIGN KEY (mapping_id) REFERENCES mappings(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mapping_entries_mapping_id ON mapping_entries(mapping_id);
CREATE INDEX IF NOT EXISTS idx_mapping_entries_masked_value ON mapping_entries(masked_value);

-- 沙箱配置表
CREATE TABLE IF NOT EXISTS sandbox_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_modified TEXT NOT NULL,
  max_size INTEGER,
  auto_cleanup INTEGER NOT NULL DEFAULT 0,
  cleanup_days INTEGER
);

-- 脱敏日志表
CREATE TABLE IF NOT EXISTS masking_logs (
  id TEXT PRIMARY KEY,
  operation TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mapping_id TEXT,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  details TEXT
);

CREATE INDEX IF NOT EXISTS idx_masking_logs_timestamp ON masking_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_masking_logs_operation ON masking_logs(operation);
`

/**
 * 初始化数据库
 */
export function initDatabase(db: Database): void {
  // 执行初始化 SQL
  db.exec(INIT_SQL)
}

/**
 * 获取数据库实例
 * 注意：在浏览器环境中，我们需要使用 IndexedDB 或其他浏览器兼容的存储方案
 * 这里提供的是 Node.js 环境的实现（用于 Electron/Tauri）
 */
export async function getDatabase(): Promise<Database> {
  // 检查是否在 Electron 环境
  if (typeof window !== 'undefined' && (window as unknown as { electron?: unknown }).electron) {
    // Electron 环境：使用 better-sqlite3
    const DatabaseCtor = (await import('better-sqlite3')).default as unknown as new (path: string) => Database
    const path = await import('node:path')
    const { app } = await import('electron')

    const dbPath = path.join(app.getPath('userData'), 'data-masking.db')
    const db = new DatabaseCtor(dbPath)

    // 初始化数据库
    initDatabase(db)

    return db
  }

  // 浏览器环境：抛出错误，需要使用 IndexedDB
  throw new Error('Browser environment detected. Please use IndexedDB implementation.')
}

/**
 * 关闭数据库连接
 */
export function closeDatabase(db: Database): void {
  db.close()
}
