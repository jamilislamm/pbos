/**
 * LifeDomain
 * Represents a broad area of the user's life.
 *
 * Architecture: DOMAIN_MODEL.md §3
 * DATA_ARCHITECTURE.md §11
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";

export class LifeDomain {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} [data.description='']
   * @param {string} [data.status='active']
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const nameCheck = validateNonEmptyString(data.name, "name");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!nameCheck.valid) throw new Error(nameCheck.error);

    this._id = data.id;
    this._name = data.name.trim();
    this._description = (data.description || "").trim();
    this._status = data.status || "active";
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
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
   * Rename the domain.
   * @param {string} newName
   * @param {number} [updatedAt=Date.now()]
   */
  rename(newName, updatedAt = Date.now()) {
    const check = validateNonEmptyString(newName, "name");
    if (!check.valid) throw new Error(check.error);
    this._name = newName.trim();
    this._updatedAt = updatedAt;
  }

  /**
   * Update description.
   */
  updateDescription(description, updatedAt = Date.now()) {
    this._description = (description || "").trim();
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new LifeDomain(data);
  }
}
