/**
 * NextAction
 * Represents a context-aware executable unit of progress.
 *
 * Architecture: DOMAIN_MODEL.md §10
 * DATA_ARCHITECTURE.md §19, §20
 * USER_FLOWS_STATE_MACHINES.md §4
 */

import {
  validateId,
  validateNonEmptyString,
} from "../validators/DomainValidator.js";
import {
  NextActionState,
  isValidNextActionTransition,
} from "../value-objects/NextActionState.js";

export class NextAction {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.projectId
   * @param {string} [data.nodeId=null]
   * @param {string} data.title
   * @param {string} [data.description='']
   * @param {string} [data.status='available']
   * @param {number} data.createdAt
   * @param {number} [data.updatedAt]
   */
  constructor(data) {
    const idCheck = validateId(data.id, "id");
    const projectIdCheck = validateId(data.projectId, "projectId");
    const titleCheck = validateNonEmptyString(data.title, "title");
    if (!idCheck.valid) throw new Error(idCheck.error);
    if (!projectIdCheck.valid) throw new Error(projectIdCheck.error);
    if (!titleCheck.valid) throw new Error(titleCheck.error);

    this._id = data.id;
    this._projectId = data.projectId;
    this._nodeId = data.nodeId || null;
    this._title = data.title.trim();
    this._description = (data.description || "").trim();
    this._status = data.status || NextActionState.AVAILABLE;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt || data.createdAt;
  }

  get id() {
    return this._id;
  }
  get projectId() {
    return this._projectId;
  }
  get nodeId() {
    return this._nodeId;
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
   * Check if this Next Action can be executed.
   * Architecture: APPLICATION_LOGIC.md §21
   * @returns {boolean}
   */
  isExecutable() {
    return (
      this._status === NextActionState.AVAILABLE ||
      this._status === NextActionState.ACTIVE
    );
  }

  /**
   * Transition to a new status.
   * Architecture: USER_FLOWS_STATE_MACHINES.md §4
   * @param {string} newStatus
   * @param {number} [updatedAt=Date.now()]
   */
  transitionStatus(newStatus, updatedAt = Date.now()) {
    if (!isValidNextActionTransition(this._status, newStatus)) {
      throw new Error(
        `Invalid NextAction transition: ${this._status} → ${newStatus}`,
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
      projectId: this._projectId,
      nodeId: this._nodeId,
      title: this._title,
      description: this._description,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data) {
    return new NextAction(data);
  }
}
