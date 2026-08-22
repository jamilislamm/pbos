/**
 * Roadmap
 * Represents the structure of progress through a Project.
 *
 * Architecture: DOMAIN_MODEL.md §6
 * DATA_ARCHITECTURE.md §15
 */

import { validateId } from "../validators/DomainValidator.js";

export class Roadmap {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.projectId
   * @param {string} [data.title='']
   * @param {string} [data.description='']
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const projectIdCheck = validateId(data.projectId, "projectId");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!projectIdCheck.valid) throw new Error(projectIdCheck.error);

    this._id = data.id;
    this._projectId = data.projectId;
    this._title = (data.title || "").trim();
    this._description = (data.description || "").trim();
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get projectId() {
    return this._projectId;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  updateTitle(title, updatedAt = Date.now()) {
    this._title = (title || "").trim();
    this._updatedAt = updatedAt;
  }

  updateDescription(description, updatedAt = Date.now()) {
    this._description = (description || "").trim();
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      projectId: this._projectId,
      title: this._title,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Roadmap(data);
  }
}
