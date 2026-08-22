/**
 * UUIDGenerator
 * Generates unique identifiers for entities.
 *
 * Architecture: DATA_ARCHITECTURE.md §7
 * "IDs must remain stable throughout the entity's lifetime."
 */

export class UUIDGenerator {
  /**
   * Generate a UUID v4 string.
   * Uses crypto.randomUUID() if available, falls back to manual generation.
   * @returns {string}
   */
  generate() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate a short ID (for testing or when brevity matters).
   * Not recommended for persistent entities.
   * @param {number} [length=12]
   * @returns {string}
   */
  generateShort(length = 12) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Singleton for application use
export const uuidGenerator = new UUIDGenerator();
