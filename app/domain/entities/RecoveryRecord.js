/**
 * RecoveryRecord
 * Represents a response to disruption.
 *
 * Architecture: DOMAIN_MODEL.md §22
 * DATA_ARCHITECTURE.md §37
 * USER_FLOWS_STATE_MACHINES.md §6
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";

export class RecoveryRecord {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.trigger - What caused the disruption
   * @param {string} [data.context='']
   * @param {string} [data.selectedAction='']
   * @param {string} [data.status='active']
   * @param {number} data.createdAt
   * @param {number} [data.resolvedAt]
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const triggerCheck = validateNonEmptyString(data.trigger, "trigger");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!triggerCheck.valid) throw new Error(triggerCheck.error);

    this._id = data.id;
    this._trigger = data.trigger.trim();
    this._context = (data.context || "").trim();
    this._selectedAction = (data.selectedAction || "").trim();
    this._status = data.status || "active";
    this._createdAt = data.createdAt;
    this._resolvedAt = data.resolvedAt || null;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get trigger() {
    return this._trigger;
  }
  get context() {
    return this._context;
  }
  get selectedAction() {
    return this._selectedAction;
  }
  get status() {
    return this._status;
  }
  get createdAt() {
    return this._createdAt;
  }
  get resolvedAt() {
    return this._resolvedAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Select a recovery action.
   * @param {string} action
   * @param {number} [updatedAt=Date.now()]
   */
  selectAction(action, updatedAt = Date.now()) {
    const check = validateNonEmptyString(action, "action");
    if (!check.valid) throw new Error(check.error);
    this._selectedAction = action.trim();
    this._updatedAt = updatedAt;
  }

  /**
   * Mark recovery as resolved.
   * @param {number} [resolvedAt=Date.now()]
   */
  resolve(resolvedAt = Date.now()) {
    this._status = "resolved";
    this._resolvedAt = resolvedAt;
    this._updatedAt = resolvedAt;
  }

  /**
   * Mark recovery as abandoned.
   * @param {number} [updatedAt=Date.now()]
   */
  abandon(updatedAt = Date.now()) {
    this._status = "abandoned";
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      trigger: this._trigger,
      context: this._context,
      selectedAction: this._selectedAction,
      status: this._status,
      createdAt: this._createdAt,
      resolvedAt: this._resolvedAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new RecoveryRecord(data);
  }
}
