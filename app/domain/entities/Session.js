/**
 * Session
 * Represents a focused execution period.
 *
 * Architecture: DOMAIN_MODEL.md §15, §16, §17, §18, §19, §20
 * DATA_ARCHITECTURE.md §28-35
 * USER_FLOWS_STATE_MACHINES.md §5
 * APPLICATION_LOGIC.md §21-33
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";
import { SessionState } from "../value-objects/SessionState.js";
import { Duration } from "../value-objects/Duration.js";
import { SessionTimer } from "../services/SessionTimer.js";
import {
  validateSessionTransition,
  validateSessionStart,
  validateSessionPause,
  validateSessionResume,
  validateSessionComplete,
  validateSessionAbandon,
  validateSessionInterrupt,
} from "../validators/SessionValidator.js";

export class Session {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.sourceType - 'habit_execution' | 'next_action'
   * @param {string} data.sourceId
   * @param {string} [data.state='ready']
   * @param {number} [data.startedAt]
   * @param {number} [data.endedAt]
   * @param {number} [data.activeDurationMs=0]
   * @param {Object} [data.timerData] - Serialized SessionTimer data
   * @param {string} [data.outcome='']
   * @param {Object} [data.interruptionContext]
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const sourceIdCheck = validateId(data.sourceId, "sourceId");
    const sourceTypeCheck = validateNonEmptyString(
      data.sourceType,
      "sourceType",
    );
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!sourceIdCheck.valid) throw new Error(sourceIdCheck.error);
    if (!sourceTypeCheck.valid) throw new Error(sourceTypeCheck.error);

    if (!["habit_execution", "next_action"].includes(data.sourceType)) {
      throw new Error(
        `Invalid sourceType: ${data.sourceType}. Must be 'habit_execution' or 'next_action'.`,
      );
    }

    this._id = data.id;
    this._sourceType = data.sourceType;
    this._sourceId = data.sourceId;
    this._state = data.state || SessionState.READY;
    this._startedAt = data.startedAt || null;
    this._endedAt = data.endedAt || null;
    this._activeDurationMs = data.activeDurationMs || 0;
    this._timer = data.timerData
      ? SessionTimer.fromJSON(data.timerData)
      : new SessionTimer();
    this._outcome = data.outcome || "";
    this._interruptionContext = data.interruptionContext || null;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get sourceType() {
    return this._sourceType;
  }
  get sourceId() {
    return this._sourceId;
  }
  get state() {
    return this._state;
  }
  get startedAt() {
    return this._startedAt;
  }
  get endedAt() {
    return this._endedAt;
  }
  get timer() {
    return this._timer;
  }
  get outcome() {
    return this._outcome;
  }
  get interruptionContext() {
    return this._interruptionContext;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Get active duration from timer.
   * @param {number} [now]
   * @returns {Duration}
   */
  getActiveDuration(now) {
    return this._timer.getActiveDuration(now);
  }

  /**
   * Get wall-clock duration.
   * @param {number} [now]
   * @returns {Duration}
   */
  getWallClockDuration(now) {
    return this._timer.getWallClockDuration(now);
  }

  // ===== State Transitions =====

  /**
   * Start the Session.
   * Architecture: APPLICATION_LOGIC.md §21, §25
   * @param {number} [now=Date.now()]
   */
  start(now = Date.now()) {
    const check = validateSessionStart(this._state);
    if (!check.valid) throw new Error(check.error);

    this._state = SessionState.RUNNING;
    this._startedAt = now;
    this._timer.start(now);
    this._updatedAt = now;
  }

  /**
   * Pause the Session.
   * Architecture: APPLICATION_LOGIC.md §26
   * @param {number} [now=Date.now()]
   */
  pause(now = Date.now()) {
    const check = validateSessionPause(this._state);
    if (!check.valid) throw new Error(check.error);

    this._state = SessionState.PAUSED;
    this._timer.pause(now);
    this._updatedAt = now;
  }

  /**
   * Resume the Session.
   * Architecture: APPLICATION_LOGIC.md §27
   * @param {number} [now=Date.now()]
   */
  resume(now = Date.now()) {
    const check = validateSessionResume(this._state);
    if (!check.valid) throw new Error(check.error);

    this._state = SessionState.RUNNING;
    this._timer.start(now);
    this._updatedAt = now;
  }

  /**
   * Interrupt the Session.
   * Architecture: APPLICATION_LOGIC.md §30
   * @param {Object} [contextSnapshot] - ContextSnapshot data
   * @param {number} [now=Date.now()]
   */
  interrupt(contextSnapshot = null, now = Date.now()) {
    const check = validateSessionInterrupt(this._state);
    if (!check.valid) throw new Error(check.error);

    this._state = SessionState.INTERRUPTED;
    this._interruptionContext = contextSnapshot;
    this._timer.interrupt(now);
    this._updatedAt = now;
  }

  /**
   * Complete the Session.
   * Architecture: APPLICATION_LOGIC.md §28
   * @param {string} [outcome='']
   * @param {number} [now=Date.now()]
   */
  complete(outcome = "", now = Date.now()) {
    const check = validateSessionComplete(this._state);
    if (!check.valid) throw new Error(check.error);

    // Close any active timer segment
    if (this._timer.hasActiveSegment()) {
      this._timer.pause(now);
    }

    this._state = SessionState.COMPLETED;
    this._endedAt = now;
    this._activeDurationMs = this._timer.getActiveDuration(now).milliseconds;
    this._outcome = outcome;
    this._updatedAt = now;
  }

  /**
   * Abandon the Session.
   * Architecture: APPLICATION_LOGIC.md §29
   * @param {string} [reason='']
   * @param {number} [now=Date.now()]
   */
  abandon(reason = "", now = Date.now()) {
    const check = validateSessionAbandon(this._state);
    if (!check.valid) throw new Error(check.error);

    // Close any active timer segment
    if (this._timer.hasActiveSegment()) {
      this._timer.pause(now);
    }

    this._state = SessionState.ABANDONED;
    this._endedAt = now;
    this._activeDurationMs = this._timer.getActiveDuration(now).milliseconds;
    this._outcome = reason;
    this._updatedAt = now;
  }

  toJSON() {
    return {
      id: this._id,
      sourceType: this._sourceType,
      sourceId: this._sourceId,
      state: this._state,
      startedAt: this._startedAt,
      endedAt: this._endedAt,
      activeDurationMs: this._activeDurationMs,
      timerData: this._timer.toJSON(),
      outcome: this._outcome,
      interruptionContext: this._interruptionContext,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Session(data);
  }
}
