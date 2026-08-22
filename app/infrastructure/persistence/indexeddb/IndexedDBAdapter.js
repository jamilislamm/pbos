/**
 * IndexedDBAdapter
 * Low-level IndexedDB wrapper providing Promise-based CRUD operations.
 *
 * Architecture: ADR-004 — IndexedDB local persistence
 * SYSTEM_ARCHITECTURE.md §16-20 — Persistence layer behind boundary
 * DATA_ARCHITECTURE.md §3 — Persistent data categories
 *
 * This adapter contains NO business logic. It is a generic storage utility.
 */

// ===== Store Names =====
export const StoreNames = Object.freeze({
  HABITS: "habits",
  HABIT_EXECUTIONS: "habitExecutions",
  SESSIONS: "sessions",
  NEXT_ACTIONS: "nextActions",
  PROJECTS: "projects",
  GOALS: "goals",
  LIFE_DOMAINS: "lifeDomains",
  ROADMAPS: "roadmaps",
  NODES: "nodes",
  REFLECTIONS: "reflections",
  RECOVERY_RECORDS: "recoveryRecords",
});

// ===== Database Configuration =====
const DB_NAME = "pbos_db";
const DB_VERSION = 1;

/**
 * IndexedDBAdapter singleton.
 * Manages database connection and provides generic CRUD operations.
 */
class IndexedDBAdapter {
  constructor() {
    this._db = null;
    this._initPromise = null;
  }

  /**
   * Initialize the database connection.
   * Creates object stores and indexes on first run or version upgrade.
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this._db) return this._db;
    if (this._initPromise) return this._initPromise;

    this._initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this._db = request.result;
        resolve(this._db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Habit store
        if (!db.objectStoreNames.contains(StoreNames.HABITS)) {
          const store = db.createObjectStore(StoreNames.HABITS, {
            keyPath: "id",
          });
          store.createIndex("status", "status", { unique: false });
        }

        // HabitExecution store
        if (!db.objectStoreNames.contains(StoreNames.HABIT_EXECUTIONS)) {
          const store = db.createObjectStore(StoreNames.HABIT_EXECUTIONS, {
            keyPath: "id",
          });
          store.createIndex("habitId", "habitId", { unique: false });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("habitId_date", ["habitId", "date"], {
            unique: true,
          });
          store.createIndex("status", "status", { unique: false });
        }

        // Session store
        if (!db.objectStoreNames.contains(StoreNames.SESSIONS)) {
          const store = db.createObjectStore(StoreNames.SESSIONS, {
            keyPath: "id",
          });
          store.createIndex("sourceType_sourceId", ["sourceType", "sourceId"], {
            unique: false,
          });
          store.createIndex("state", "state", { unique: false });
          store.createIndex("startedAt", "startedAt", { unique: false });
        }

        // NextAction store
        if (!db.objectStoreNames.contains(StoreNames.NEXT_ACTIONS)) {
          const store = db.createObjectStore(StoreNames.NEXT_ACTIONS, {
            keyPath: "id",
          });
          store.createIndex("projectId", "projectId", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("nodeId", "nodeId", { unique: false });
        }

        // Project store
        if (!db.objectStoreNames.contains(StoreNames.PROJECTS)) {
          const store = db.createObjectStore(StoreNames.PROJECTS, {
            keyPath: "id",
          });
          store.createIndex("status", "status", { unique: false });
        }

        // Goal store
        if (!db.objectStoreNames.contains(StoreNames.GOALS)) {
          db.createObjectStore(StoreNames.GOALS, { keyPath: "id" });
        }

        // LifeDomain store
        if (!db.objectStoreNames.contains(StoreNames.LIFE_DOMAINS)) {
          db.createObjectStore(StoreNames.LIFE_DOMAINS, { keyPath: "id" });
        }

        // Roadmap store
        if (!db.objectStoreNames.contains(StoreNames.ROADMAPS)) {
          const store = db.createObjectStore(StoreNames.ROADMAPS, {
            keyPath: "id",
          });
          store.createIndex("projectId", "projectId", { unique: false });
        }

        // Node store
        if (!db.objectStoreNames.contains(StoreNames.NODES)) {
          const store = db.createObjectStore(StoreNames.NODES, {
            keyPath: "id",
          });
          store.createIndex("roadmapId", "roadmapId", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("parentId", "parentId", { unique: false });
        }

        // Reflection store
        if (!db.objectStoreNames.contains(StoreNames.REFLECTIONS)) {
          const store = db.createObjectStore(StoreNames.REFLECTIONS, {
            keyPath: "id",
          });
          store.createIndex(
            "contextType_contextId",
            ["contextType", "contextId"],
            { unique: false },
          );
          store.createIndex("createdAt", "createdAt", { unique: false });
        }

        // RecoveryRecord store
        if (!db.objectStoreNames.contains(StoreNames.RECOVERY_RECORDS)) {
          const store = db.createObjectStore(StoreNames.RECOVERY_RECORDS, {
            keyPath: "id",
          });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    });

    return this._initPromise;
  }

  /**
   * Ensure database is initialized before any operation.
   * @private
   */
  async _ensureDb() {
    if (!this._db) await this.init();
  }

  /**
   * Get a transaction for a store.
   * @param {string} storeName
   * @param {IDBTransactionMode} [mode='readonly']
   * @returns {Promise<IDBObjectStore>}
   */
  async _getStore(storeName, mode = "readonly") {
    await this._ensureDb();
    const transaction = this._db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // ===== CRUD Operations =====

  /**
   * Put (create or update) a record.
   * @param {string} storeName
   * @param {Object} record
   * @returns {Promise<Object>} The saved record
   */
  async put(storeName, record) {
    const store = await this._getStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a record by ID.
   * @param {string} storeName
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async get(storeName, id) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all records from a store.
   * @param {string} storeName
   * @returns {Promise<Object[]>}
   */
  async getAll(storeName) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a record by ID.
   * @param {string} storeName
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(storeName, id) {
    const store = await this._getStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all records from a store.
   * @param {string} storeName
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    const store = await this._getStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ===== Index Queries =====

  /**
   * Get records by index value.
   * @param {string} storeName
   * @param {string} indexName
   * @param {*} value
   * @returns {Promise<Object[]>}
   */
  async getByIndex(storeName, indexName, value) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single record by index value.
   * @param {string} storeName
   * @param {string} indexName
   * @param {*} value
   * @returns {Promise<Object|null>}
   */
  async getOneByIndex(storeName, indexName, value) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index(indexName);
      const request = index.get(value);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get records by compound index value.
   * @param {string} storeName
   * @param {string} indexName
   * @param {Array} values
   * @returns {Promise<Object[]>}
   */
  async getByCompoundIndex(storeName, indexName, values) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index(indexName);
      const request = index.getAll(values);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single record by compound index value.
   * @param {string} storeName
   * @param {string} indexName
   * @param {Array} values
   * @returns {Promise<Object|null>}
   */
  async getOneByCompoundIndex(storeName, indexName, values) {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index(indexName);
      const request = index.get(values);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Open a cursor for iterating records.
   * @param {string} storeName
   * @param {IDBKeyRange} [range]
   * @param {string} [direction='next']
   * @returns {Promise<IDBCursorWithValue[]>}
   */
  async getCursor(storeName, range, direction = "next") {
    const store = await this._getStore(storeName, "readonly");
    return new Promise((resolve, reject) => {
      const results = [];
      const request = store.openCursor(range, direction);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ===== Utility =====

  /**
   * Check if IndexedDB is available in this environment.
   * @returns {boolean}
   */
  isAvailable() {
    return typeof indexedDB !== "undefined";
  }

  /**
   * Close the database connection.
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
      this._initPromise = null;
    }
  }

  /**
   * Delete the entire database (use with caution — mainly for testing).
   * @returns {Promise<void>}
   */
  async deleteDatabase() {
    this.close();
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Database deletion blocked"));
    });
  }
}

// Singleton instance
export const indexedDBAdapter = new IndexedDBAdapter();
export default IndexedDBAdapter;
