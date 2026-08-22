/**
 * Project
 * Represents a meaningful body of work that contributes to a Goal.
 *
 * Architecture: DOMAIN_MODEL.md §5
 * DATA_ARCHITECTURE.md §13, §14
 * USER_FLOWS_STATE_MACHINES.md §19
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";
import {
  ProjectStatus,
  isValidProjectStatusTransition,
} from "../value-objects/ProjectStatus.js";

export class Project {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.title
   * @param {string} [data.description='']
   * @param {string} [data.status='planned']
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
    this._status = data.status || ProjectStatus.PLANNED;
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
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Transition to a new status.
   * Architecture: USER_FLOWS_STATE_MACHINES.md §19
   * @param {string} newStatus
   * @param {number} [updatedAt=Date.now()]
   */
  transitionStatus(newStatus, updatedAt = Date.now()) {
    if (!isValidProjectStatusTransition(this._status, newStatus)) {
      throw new Error(
        `Invalid Project status transition: ${this._status} → ${newStatus}`,
      );
    }
    this._status = newStatus;
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
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Project(data);
  }
}
