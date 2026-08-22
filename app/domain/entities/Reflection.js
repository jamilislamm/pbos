/**
 * Reflection
 * Represents user-generated interpretation of an experience.
 *
 * Architecture: DOMAIN_MODEL.md §21
 * DATA_ARCHITECTURE.md §36
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";

export class Reflection {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.contextType - 'session' | 'habit_execution' | 'project' | 'day'
   * @param {string} data.contextId
   * @param {string} data.content
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const contextIdCheck = validateId(data.contextId, "contextId");
    const contentCheck = validateNonEmptyString(data.content, "content");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!contextIdCheck.valid) throw new Error(contextIdCheck.error);
    if (!contentCheck.valid) throw new Error(contentCheck.error);

    const validContextTypes = ["session", "habit_execution", "project", "day"];
    if (!validContextTypes.includes(data.contextType)) {
      throw new Error(
        `Invalid contextType: ${data.contextType}. Must be one of: ${validContextTypes.join(", ")}`,
      );
    }

    this._id = data.id;
    this._contextType = data.contextType;
    this._contextId = data.contextId;
    this._content = data.content.trim();
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get contextType() {
    return this._contextType;
  }
  get contextId() {
    return this._contextId;
  }
  get content() {
    return this._content;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  updateContent(newContent, updatedAt = Date.now()) {
    const check = validateNonEmptyString(newContent, "content");
    if (!check.valid) throw new Error(check.error);
    this._content = newContent.trim();
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      contextType: this._contextType,
      contextId: this._contextId,
      content: this._content,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Reflection(data);
  }
}
