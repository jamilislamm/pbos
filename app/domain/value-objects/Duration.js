/**
 * Duration
 * Immutable value object representing a time duration.
 *
 * Architecture: DATA_ARCHITECTURE.md §32, §33
 * APPLICATION_LOGIC.md §33
 *
 * Internal representation: milliseconds (for precision).
 * Display formatting belongs to the presentation layer.
 */

export class Duration {
  /**
   * @param {number} milliseconds - Must be non-negative integer
   */
  constructor(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
      throw new Error(
        "Duration must be a non-negative finite number of milliseconds",
      );
    }
    this._ms = Math.floor(milliseconds);
    Object.freeze(this);
  }

  // ===== Factory Methods =====

  static fromMinutes(minutes) {
    return new Duration(minutes * 60 * 1000);
  }

  static fromSeconds(seconds) {
    return new Duration(seconds * 1000);
  }

  static fromHours(hours) {
    return new Duration(hours * 60 * 60 * 1000);
  }

  static zero() {
    return new Duration(0);
  }

  // ===== Accessors =====

  get milliseconds() {
    return this._ms;
  }

  get seconds() {
    return Math.floor(this._ms / 1000);
  }

  get minutes() {
    return Math.floor(this._ms / (60 * 1000));
  }

  get hours() {
    return Math.floor(this._ms / (60 * 60 * 1000));
  }

  /**
   * Total minutes as a float (e.g., 90 seconds = 1.5 minutes).
   */
  get totalMinutes() {
    return this._ms / (60 * 1000);
  }

  // ===== Arithmetic (returns new Duration, immutable) =====

  add(other) {
    return new Duration(this._ms + other._ms);
  }

  subtract(other) {
    return new Duration(Math.max(0, this._ms - other._ms));
  }

  multiply(factor) {
    return new Duration(this._ms * factor);
  }

  // ===== Comparison =====

  isZero() {
    return this._ms === 0;
  }

  isGreaterThan(other) {
    return this._ms > other._ms;
  }

  isGreaterThanOrEqual(other) {
    return this._ms >= other._ms;
  }

  isLessThan(other) {
    return this._ms < other._ms;
  }

  isLessThanOrEqual(other) {
    return this._ms <= other._ms;
  }

  equals(other) {
    return this._ms === other._ms;
  }

  // ===== Formatting (domain-level, presentation may override) =====

  /**
   * Format as MM:SS.
   * Example: 45 minutes 30 seconds → "45:30"
   */
  toMMSS() {
    const totalSeconds = this.seconds;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  /**
   * Format as H:MM:SS.
   * Example: 1 hour 5 minutes 30 seconds → "1:05:30"
   */
  toHMMSS() {
    const totalSeconds = this.seconds;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h === 0)
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  toString() {
    return `Duration(${this._ms}ms)`;
  }

  toJSON() {
    return this._ms;
  }
}
