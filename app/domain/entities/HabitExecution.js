/**
 * HabitExecution
 * Represents one occurrence of a Habit on a particular day.
 *
 * Architecture: DOMAIN_MODEL.md §14.5, §14.6, §14.7, §14.8
 * DATA_ARCHITECTURE.md §24, §25, §26, §27
 * USER_FLOWS_STATE_MACHINES.md §8
 */

import { validateId } from "../validators/DomainValidator.js";
import {
  DailyHabitExecutionStatus,
  isValidDailyHabitExecutionTransition,
} from "../value-objects/DailyHabitExecutionStatus.js";
import { ExecutionLevel } from "../value-objects/ExecutionLevel.js";
import { Duration } from "../value-objects/Duration.js";

export class HabitExecution {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.habitId
   * @param {string} data.date - ISO date string (YYYY-MM-DD)
   * @param {string} [data.status='scheduled']
   * @param {string} [data.selectedLevel='target']
   * @param {number} [data.targetAtExecutionMs] - Snapshot of target duration at creation
   * @param {number} [data.reducedAtExecutionMs] - Snapshot of reduced duration at creation
   * @param {number} [data.minimumAtExecutionMs] - Snapshot of minimum duration at creation
   * @param {number} [data.actualDurationMs=0]
   * @param {number} data.createdAt
   * @param {number} [data.completedAt]
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const habitIdCheck = validateId(data.habitId, "habitId");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!habitIdCheck.valid) throw new Error(habitIdCheck.error);

    this._id = data.id;
    this._habitId = data.habitId;
    this._date = data.date;
    this._status = data.status || DailyHabitExecutionStatus.SCHEDULED;
    this._selectedLevel = data.selectedLevel || ExecutionLevel.TARGET;
    this._targetAtExecutionMs = data.targetAtExecutionMs || 0;
    this._reducedAtExecutionMs = data.reducedAtExecutionMs || 0;
    this._minimumAtExecutionMs = data.minimumAtExecutionMs || 0;
    this._actualDurationMs = data.actualDurationMs || 0;
    this._createdAt = data.createdAt;
    this._completedAt = data.completedAt || null;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get habitId() {
    return this._habitId;
  }
  get date() {
    return this._date;
  }
  get status() {
    return this._status;
  }
  get selectedLevel() {
    return this._selectedLevel;
  }
  get targetAtExecutionMs() {
    return this._targetAtExecutionMs;
  }
  get reducedAtExecutionMs() {
    return this._reducedAtExecutionMs;
  }
  get minimumAtExecutionMs() {
    return this._minimumAtExecutionMs;
  }
  get actualDurationMs() {
    return this._actualDurationMs;
  }
  get completedAt() {
    return this._completedAt;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Get the execution config as it existed when this execution was created.
   * Architecture: DATA_ARCHITECTURE.md §23 — historical accuracy.
   * @returns {{target: Duration, reduced: Duration, minimum: Duration}}
   */
  getExecutionConfig() {
    return {
      target: new Duration(this._targetAtExecutionMs),
      reduced: new Duration(this._reducedAtExecutionMs),
      minimum: new Duration(this._minimumAtExecutionMs),
    };
  }

  /**
   * Get actual duration as a Duration value object.
   * @returns {Duration}
   */
  getActualDuration() {
    return new Duration(this._actualDurationMs);
  }

  /**
   * Transition status.
   * Architecture: USER_FLOWS_STATE_MACHINES.md §8.1, §8.2
   * @param {string} newStatus
   * @param {number} [updatedAt=Date.now()]
   */
  transitionStatus(newStatus, updatedAt = Date.now()) {
    if (!isValidDailyHabitExecutionTransition(this._status, newStatus)) {
      throw new Error(
        `Invalid HabitExecution transition: ${this._status} → ${newStatus}`,
      );
    }
    this._status = newStatus;
    this._updatedAt = updatedAt;
  }

  /**
   * Select execution level.
   * Architecture: APPLICATION_LOGIC.md §36
   * @param {string} level
   * @param {number} [updatedAt=Date.now()]
   */
  selectLevel(level, updatedAt = Date.now()) {
    if (!Object.values(ExecutionLevel).includes(level)) {
      throw new Error(`Invalid execution level: ${level}`);
    }
    this._selectedLevel = level;
    this._updatedAt = updatedAt;
  }

  /**
   * Add to actual duration (from a completed Session).
   * Architecture: DATA_ARCHITECTURE.md §27 — actual vs intended.
   * @param {Duration} duration
   * @param {number} [updatedAt=Date.now()]
   */
  addActualDuration(duration, updatedAt = Date.now()) {
    this._actualDurationMs += duration.milliseconds;
    this._updatedAt = updatedAt;
  }

  /**
   * Mark as completed.
   * @param {number} [completedAt=Date.now()]
   */
  markCompleted(completedAt = Date.now()) {
    this._completedAt = completedAt;
    this._updatedAt = completedAt;
  }

  toJSON() {
    return {
      id: this._id,
      habitId: this._habitId,
      date: this._date,
      status: this._status,
      selectedLevel: this._selectedLevel,
      targetAtExecutionMs: this._targetAtExecutionMs,
      reducedAtExecutionMs: this._reducedAtExecutionMs,
      minimumAtExecutionMs: this._minimumAtExecutionMs,
      actualDurationMs: this._actualDurationMs,
      createdAt: this._createdAt,
      completedAt: this._completedAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new HabitExecution(data);
  }
}
