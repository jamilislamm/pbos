/**
 * SessionTimer
 * Calculates active execution duration from timestamp-based segments.
 *
 * Architecture: DATA_ARCHITECTURE.md §32, §33 (Session Duration, Session Segments)
 * APPLICATION_LOGIC.md §33 (Timer Accuracy)
 * DOMAIN_MODEL.md §15.2, §16, §17 (Session Model, Target vs Actual, Overtime)
 *
 * Principle: Active Duration = Sum of active execution intervals.
 * The timer does NOT simply increment elapsed += 1 second.
 */

import { Duration } from "../value-objects/Duration.js";

/**
 * Represents a single continuous execution segment.
 * Architecture: DATA_ARCHITECTURE.md §33
 */
export class SessionSegment {
  /**
   * @param {number} startedAt - Unix timestamp (ms)
   * @param {number|null} endedAt - Unix timestamp (ms), null if still active
   */
  constructor(startedAt, endedAt = null) {
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    Object.freeze(this);
  }

  /**
   * Calculate the duration of this segment.
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {Duration}
   */
  getDuration(now = Date.now()) {
    const end = this.endedAt ?? now;
    return new Duration(Math.max(0, end - this.startedAt));
  }

  /**
   * Check if this segment is still active.
   * @returns {boolean}
   */
  isActive() {
    return this.endedAt === null;
  }
}

/**
 * SessionTimer manages the timing of a Session.
 * It tracks execution segments to accurately compute active duration.
 */
export class SessionTimer {
  /**
   * @param {number|null} startedAt - When the Session first started
   * @param {Array<SessionSegment>} [segments=[]] - Previous execution segments
   */
  constructor(startedAt = null, segments = []) {
    this._startedAt = startedAt;
    this._segments = [...segments]; // Copy to maintain immutability boundary
  }

  // ===== State Queries =====

  /**
   * Get when the Session was first started.
   * @returns {number|null}
   */
  get startedAt() {
    return this._startedAt;
  }

  /**
   * Get all segments.
   * @returns {SessionSegment[]}
   */
  get segments() {
    return [...this._segments];
  }

  /**
   * Check if there is an active (unclosed) segment.
   * @returns {boolean}
   */
  hasActiveSegment() {
    return (
      this._segments.length > 0 &&
      this._segments[this._segments.length - 1].isActive()
    );
  }

  // ===== Timing Operations =====

  /**
   * Start or resume timing.
   * Architecture: APPLICATION_LOGIC.md §25
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   */
  start(now = Date.now()) {
    if (this.hasActiveSegment()) {
      throw new Error("Timer is already running. Cannot start a new segment.");
    }
    if (this._startedAt === null) {
      this._startedAt = now;
    }
    this._segments.push(new SessionSegment(now));
  }

  /**
   * Pause timing, closing the current active segment.
   * Architecture: APPLICATION_LOGIC.md §26
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   */
  pause(now = Date.now()) {
    if (!this.hasActiveSegment()) {
      throw new Error("Timer is not running. Cannot pause.");
    }
    const activeSegment = this._segments[this._segments.length - 1];
    this._segments[this._segments.length - 1] = new SessionSegment(
      activeSegment.startedAt,
      now,
    );
  }

  /**
   * Mark an interruption.
   * Architecture: APPLICATION_LOGIC.md §30
   * Same as pause from a timing perspective, but semantically different.
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   */
  interrupt(now = Date.now()) {
    // Interruption closes the current segment same as pause
    // The semantic difference is handled at the Session state level
    this.pause(now);
  }

  // ===== Duration Calculations =====

  /**
   * Calculate total active execution duration.
   * Architecture: DATA_ARCHITECTURE.md §32
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {Duration}
   */
  getActiveDuration(now = Date.now()) {
    let totalMs = 0;
    for (const segment of this._segments) {
      totalMs += segment.getDuration(now).milliseconds;
    }
    return new Duration(totalMs);
  }

  /**
   * Calculate wall-clock duration from first start.
   * Architecture: DATA_ARCHITECTURE.md §32
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {Duration}
   */
  getWallClockDuration(now = Date.now()) {
    if (this._startedAt === null) {
      return Duration.zero();
    }
    return new Duration(now - this._startedAt);
  }

  /**
   * Calculate total pause/interruption time.
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {Duration}
   */
  getPausedDuration(now = Date.now()) {
    const wallClock = this.getWallClockDuration(now).milliseconds;
    const active = this.getActiveDuration(now).milliseconds;
    return new Duration(Math.max(0, wallClock - active));
  }

  /**
   * Calculate overtime beyond a target duration.
   * Architecture: DOMAIN_MODEL.md §17
   * @param {Duration} targetDuration
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {Duration}
   */
  getOvertime(targetDuration, now = Date.now()) {
    const active = this.getActiveDuration(now).milliseconds;
    const targetMs = targetDuration.milliseconds;
    if (active <= targetMs) {
      return Duration.zero();
    }
    return new Duration(active - targetMs);
  }

  /**
   * Check if the target duration has been reached or exceeded.
   * @param {Duration} targetDuration
   * @param {number} [now] - Current timestamp (defaults to Date.now())
   * @returns {boolean}
   */
  hasReachedTarget(targetDuration, now = Date.now()) {
    return this.getActiveDuration(now).isGreaterThanOrEqual(targetDuration);
  }

  // ===== Serialization =====

  /**
   * Serialize to a plain object for persistence.
   * @returns {{startedAt: number|null, segments: Array<{startedAt: number, endedAt: number|null}>}}
   */
  toJSON() {
    return {
      startedAt: this._startedAt,
      segments: this._segments.map((s) => ({
        startedAt: s.startedAt,
        endedAt: s.endedAt,
      })),
    };
  }

  /**
   * Reconstruct from a serialized object.
   * @param {{startedAt: number|null, segments: Array<{startedAt: number, endedAt: number|null}>}} data
   * @returns {SessionTimer}
   */
  static fromJSON(data) {
    const segments = (data.segments || []).map(
      (s) => new SessionSegment(s.startedAt, s.endedAt),
    );
    return new SessionTimer(data.startedAt, segments);
  }
}
