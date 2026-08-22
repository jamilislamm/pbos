/**
 * Goal
 * Represents a meaningful direction or desired outcome within a Life Domain.
 *
 * Architecture: DOMAIN_MODEL.md §4
 * DATA_ARCHITECTURE.md §10, §12
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";

export class Goal {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.title
   * @param {string} [data.description='']
   * @param {string} [data.status='active']
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
    this._status = data.status || "active";
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
    return new Goal(data);
  }
}
