/**
 * Habit
 * Represents a recurring behavior definition.
 *
 * Architecture: DOMAIN_MODEL.md §14
 * DATA_ARCHITECTURE.md §21, §22, §23
 * USER_FLOWS_STATE_MACHINES.md §7
 */

import {
  validateId,
  validateNonEmptyString,
  validatePositiveInteger,
} from "../validators/DomainValidator.js";
import {
  HabitStatus,
  isValidHabitStatusTransition,
} from "../value-objects/HabitStatus.js";
import { Duration } from "../value-objects/Duration.js";

/**
 * Habit execution configuration for a single level.
 * Architecture: DATA_ARCHITECTURE.md §22
 */
export class HabitLevelConfig {
  /**
   * @param {Object} data
   * @param {Duration} data.duration
   * @param {string} [data.description='']
   */
  constructor(data) {
    if (!data.duration || !(data.duration instanceof Duration)) {
      throw new Error("HabitLevelConfig requires a Duration");
    }
    this.duration = data.duration;
    this.description = (data.description || "").trim();
    Object.freeze(this);
  }

  toJSON() {
    return {
      durationMs: this.duration.milliseconds,
      description: this.description,
    };
  }

  static fromJSON(data) {
    return new HabitLevelConfig({
      duration: new Duration(data.durationMs),
      description: data.description,
    });
  }
}

export class Habit {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.title
   * @param {string} [data.description='']
   * @param {string} [data.status='active']
   * @param {Object} data.schedule - e.g., { type: 'daily', days: [1,2,3,4,5] }
   * @param {HabitLevelConfig} data.targetConfig
   * @param {HabitLevelConfig} data.reducedConfig
   * @param {HabitLevelConfig} data.minimumConfig
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const titleCheck = validateNonEmptyString(data.title, "title");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!titleCheck.valid) throw new Error(titleCheck.error);

    this._id = data.id;
    this._title = data.title.trim();
    this._description = (data.description || "").trim();
    this._status = data.status || HabitStatus.ACTIVE;
    this._schedule = data.schedule || { type: "daily" };
    this._targetConfig = data.targetConfig;
    this._reducedConfig = data.reducedConfig;
    this._minimumConfig = data.minimumConfig;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get status() {
    return this._status;
  }
  get schedule() {
    return this._schedule;
  }
  get targetConfig() {
    return this._targetConfig;
  }
  get reducedConfig() {
    return this._reducedConfig;
  }
  get minimumConfig() {
    return this._minimumConfig;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Check if this Habit can be executed.
   * @returns {boolean}
   */
  isExecutable() {
    return this._status === HabitStatus.ACTIVE;
  }

  /**
   * Transition status.
   * Architecture: USER_FLOWS_STATE_MACHINES.md §7.1
   * @param {string} newStatus
   * @param {number} [updatedAt=Date.now()]
   */
  transitionStatus(newStatus, updatedAt = Date.now()) {
    if (!isValidHabitStatusTransition(this._status, newStatus)) {
      throw new Error(
        `Invalid Habit status transition: ${this._status} → ${newStatus}`,
      );
    }
    this._status = newStatus;
    this._updatedAt = updatedAt;
  }

  /**
   * Update execution configuration.
   * Architecture: DATA_ARCHITECTURE.md §23 — configuration changes must not affect historical executions.
   * @param {Object} config
   * @param {HabitLevelConfig} [config.targetConfig]
   * @param {HabitLevelConfig} [config.reducedConfig]
   * @param {HabitLevelConfig} [config.minimumConfig]
   * @param {number} [updatedAt=Date.now()]
   */
  updateConfig(config, updatedAt = Date.now()) {
    if (config.targetConfig) this._targetConfig = config.targetConfig;
    if (config.reducedConfig) this._reducedConfig = config.reducedConfig;
    if (config.minimumConfig) this._minimumConfig = config.minimumConfig;
    this._updatedAt = updatedAt;
  }

  rename(newTitle, updatedAt = Date.now()) {
    const check = validateNonEmptyString(newTitle, "title");
    if (!check.valid) throw new Error(check.error);
    this._title = newTitle.trim();
    this._updatedAt = updatedAt;
  }

  updateDescription(description, updatedAt = Date.now()) {
    this._description = (description || "").trim();
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      status: this._status,
      schedule: this._schedule,
      targetConfig: this._targetConfig ? this._targetConfig.toJSON() : null,
      reducedConfig: this._reducedConfig ? this._reducedConfig.toJSON() : null,
      minimumConfig: this._minimumConfig ? this._minimumConfig.toJSON() : null,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Habit({
      ...data,
      targetConfig: data.targetConfig
        ? HabitLevelConfig.fromJSON(data.targetConfig)
        : null,
      reducedConfig: data.reducedConfig
        ? HabitLevelConfig.fromJSON(data.reducedConfig)
        : null,
      minimumConfig: data.minimumConfig
        ? HabitLevelConfig.fromJSON(data.minimumConfig)
        : null,
    });
  }
}
