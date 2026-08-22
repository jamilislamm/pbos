/**
 * SystemClock
 * Provides timestamp generation for the domain layer.
 *
 * Architecture: SYSTEM_ARCHITECTURE.md §14-15
 * ADR-004: Active Session integrity has priority over immediate cloud sync.
 *
 * This abstraction allows testing with a frozen/mock clock.
 */

export class SystemClock {
  /**
   * Get current time as Unix timestamp in milliseconds.
   * @returns {number}
   */
  now() {
    return Date.now();
  }

  /**
   * Get current time as ISO string.
   * @returns {string}
   */
  nowISO() {
    return new Date().toISOString();
  }

  /**
   * Get today's date as YYYY-MM-DD string.
   * @returns {string}
   */
  todayDateString() {
    return new Date().toISOString().split("T")[0];
  }
}

// Singleton for application use
export const systemClock = new SystemClock();
