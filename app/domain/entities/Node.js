/**
 * Node
 * Represents a meaningful unit of progress within a Roadmap.
 *
 * Architecture: DOMAIN_MODEL.md §7
 * DATA_ARCHITECTURE.md §16, §17, §18
 * USER_FLOWS_STATE_MACHINES.md §18
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";
import {
  NodeState,
  isValidNodeTransition,
} from "../value-objects/NodeState.js";

export class Node {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.roadmapId
   * @param {string} data.title
   * @param {string} [data.description='']
   * @param {string} [data.status='planned']
   * @param {string} [data.parentId=null]
   * @param {number} [data.position=0]
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const roadmapIdCheck = validateId(data.roadmapId, "roadmapId");
    const titleCheck = validateNonEmptyString(data.title, "title");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!roadmapIdCheck.valid) throw new Error(roadmapIdCheck.error);
    if (!titleCheck.valid) throw new Error(titleCheck.error);

    this._id = data.id;
    this._roadmapId = data.roadmapId;
    this._title = data.title.trim();
    this._description = (data.description || "").trim();
    this._status = data.status || NodeState.PLANNED;
    this._parentId = data.parentId || null;
    this._position = data.position || 0;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get roadmapId() {
    return this._roadmapId;
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
  get parentId() {
    return this._parentId;
  }
  get position() {
    return this._position;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Transition to a new status.
   * Architecture: USER_FLOWS_STATE_MACHINES.md §18
   * @param {string} newStatus
   * @param {number} [updatedAt=Date.now()]
   */
  transitionStatus(newStatus, updatedAt = Date.now()) {
    if (!isValidNodeTransition(this._status, newStatus)) {
      throw new Error(
        `Invalid Node transition: ${this._status} → ${newStatus}`,
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

  updatePosition(position, updatedAt = Date.now()) {
    this._position = position;
    this._updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      roadmapId: this._roadmapId,
      title: this._title,
      description: this._description,
      status: this._status,
      parentId: this._parentId,
      position: this._position,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new Node(data);
  }
}
