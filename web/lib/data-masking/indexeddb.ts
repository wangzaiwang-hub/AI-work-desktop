/**
 * 浏览器环境的 IndexedDB 实现
 * IndexedDB Implementation for Browser Environment
 */

const DB_NAME = 'DataMaskingDB'
const DB_VERSION = 1

/**
 * 对象存储名称
 */
export const STORES = {
  MASKING_RULES: 'masking_rules',
  MAPPINGS: 'mappings',
  MAPPING_ENTRIES: 'mapping_entries',
  SANDBOX_CONFIG: 'sandbox_config',
  MASKING_LOGS: 'masking_logs',
} as const

/**
 * 初始化 IndexedDB
 */
export function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // 创建脱敏规则存储
      if (!db.objectStoreNames.contains(STORES.MASKING_RULES)) {
        const ruleStore = db.createObjectStore(STORES.MASKING_RULES, { keyPath: 'id' })
        ruleStore.createIndex('enabled', 'enabled', { unique: false })
        ruleStore.createIndex('priority', 'priority', { unique: false })
      }

      // 创建映射存储
      if (!db.objectStoreNames.contains(STORES.MAPPINGS)) {
        const mappingStore = db.createObjectStore(STORES.MAPPINGS, { keyPath: 'id' })
        mappingStore.createIndex('file_hash', 'file_hash', { unique: false })
        mappingStore.createIndex('created_at', 'created_at', { unique: false })
      }

      // 创建映射条目存储
      if (!db.objectStoreNames.contains(STORES.MAPPING_ENTRIES)) {
        const entryStore = db.createObjectStore(STORES.MAPPING_ENTRIES, {
          keyPath: 'id',
          autoIncrement: true,
        })
        entryStore.createIndex('mapping_id', 'mapping_id', { unique: false })
        entryStore.createIndex('masked_value', 'masked_value', { unique: false })
      }

      // 创建沙箱配置存储
      if (!db.objectStoreNames.contains(STORES.SANDBOX_CONFIG)) {
        db.createObjectStore(STORES.SANDBOX_CONFIG, { keyPath: 'id' })
      }

      // 创建日志存储
      if (!db.objectStoreNames.contains(STORES.MASKING_LOGS)) {
        const logStore = db.createObjectStore(STORES.MASKING_LOGS, { keyPath: 'id' })
        logStore.createIndex('timestamp', 'timestamp', { unique: false })
        logStore.createIndex('operation', 'operation', { unique: false })
      }
    }
  })
}

/**
 * 获取 IndexedDB 实例
 */
export async function getIndexedDB(): Promise<IDBDatabase> {
  return initIndexedDB()
}

/**
 * 关闭 IndexedDB 连接
 */
export function closeIndexedDB(db: IDBDatabase): void {
  db.close()
}

/**
 * IndexedDB 辅助函数：添加记录
 */
export function addRecord<T>(
  db: IDBDatabase,
  storeName: string,
  record: T,
): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.add(record)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：更新记录
 */
export function updateRecord<T>(
  db: IDBDatabase,
  storeName: string,
  record: T,
): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(record)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：获取记录
 */
export function getRecord<T>(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：获取所有记录
 */
export function getAllRecords<T>(
  db: IDBDatabase,
  storeName: string,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：删除记录
 */
export function deleteRecord(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：通过索引查询
 */
export function getByIndex<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  value: IDBValidKey,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * IndexedDB 辅助函数：清空存储
 */
export function clearStore(
  db: IDBDatabase,
  storeName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
