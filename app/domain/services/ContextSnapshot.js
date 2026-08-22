/**
 * ContextSnapshot
 * Preserves the minimum context needed to resume interrupted work.
 *
 * Architecture: DOMAIN_MODEL.md §20 (Context Snapshot)
 * USER_FLOWS_STATE_MACHINES.md §25
 *
 * Purpose: Answer these questions after interruption:
 * 1. Where was I?
 * 2. What was I doing?
 * 3. What had I already done?
 * 4. What was I about to do?
 * 5. What should I do next?
 */

/**
 * @typedef {Object} ContextSnapshotData
 * @property {string} sourceType - 'habit_execution' | 'next_action'
 * @property {string} sourceId - ID of the interrupted work item
 * @property {string} sourceTitle - Human-readable title
 * @property {string} [projectTitle] - Project context (if applicable)
 * @property {string} [goalTitle] - Goal context (if applicable)
 * @property {string} [nodeTitle] - Roadmap node context (if applicable)
 * @property {string} [sessionState] - Session state at interruption
 * @property {number} [activeDurationMs] - How much time had been spent
 * @property {string} [nextStep] - What to do next
 * @property {string} [notes] - Any additional context
 * @property {number} capturedAt - Timestamp when snapshot was taken
 */

export class ContextSnapshot {
  /**
   * @param {ContextSnapshotData} data
   */
  constructor(data) {
    this._data = { ...data };
    Object.freeze(this._data);
    Object.freeze(this);
  }

  // ===== Accessors =====

  get sourceType() {
    return this._data.sourceType;
  }
  get sourceId() {
    return this._data.sourceId;
  }
  get sourceTitle() {
    return this._data.sourceTitle;
  }
  get projectTitle() {
    return this._data.projectTitle;
  }
  get goalTitle() {
    return this._data.goalTitle;
  }
  get nodeTitle() {
    return this._data.nodeTitle;
  }
  get sessionState() {
    return this._data.sessionState;
  }
  get activeDurationMs() {
    return this._data.activeDurationMs;
  }
  get nextStep() {
    return this._data.nextStep;
  }
  get notes() {
    return this._data.notes;
  }
  get capturedAt() {
    return this._data.capturedAt;
  }

  // ===== Display Helpers =====

  /**
   * Generate a human-readable summary for recovery display.
   * Architecture: DOMAIN_MODEL.md §20.2
   * "You were here → You were doing this → Continue with this next action."
   * @returns {string}
   */
  toRecoverySummary() {
    const parts = [];

    // Where was I?
    const location = this._buildLocationString();
    if (location) parts.push(`You were working on: ${location}`);

    // What was I doing?
    if (this.sourceTitle) {
      parts.push(`Task: ${this.sourceTitle}`);
    }

    // What had I already done?
    if (this.activeDurationMs !== undefined && this.activeDurationMs > 0) {
      const minutes = Math.floor(this.activeDurationMs / 60000);
      parts.push(`Time spent: ${minutes} min`);
    }

    // What should I do next?
    if (this.nextStep) {
      parts.push(`Next: ${this.nextStep}`);
    }

    return parts.join("\n");
  }

  /**
   * Build the location/context hierarchy string.
   * @returns {string|null}
   */
  _buildLocationString() {
    const contexts = [];
    if (this.goalTitle) contexts.push(this.goalTitle);
    if (this.projectTitle) contexts.push(this.projectTitle);
    if (this.nodeTitle) contexts.push(this.nodeTitle);

    if (contexts.length === 0) return null;
    return contexts.join(" → ");
  }

  // ===== Serialization =====

  /**
   * @returns {ContextSnapshotData}
   */
  toJSON() {
    return { ...this._data };
  }

  /**
   * @param {ContextSnapshotData} data
   * @returns {ContextSnapshot}
   */
  static fromJSON(data) {
    return new ContextSnapshot(data);
  }

  /**
   * Create a snapshot from a Session and its source.
   * Factory method for convenience.
   *
   * @param {Object} session - The Session being interrupted
   * @param {Object} source - The executable source (HabitExecution or NextAction)
   * @param {Object} [context] - Additional context (Project, Goal, Node)
   * @returns {ContextSnapshot}
   */
  static fromSession(session, source, context = {}) {
    return new ContextSnapshot({
      sourceType: session.sourceType,
      sourceId: session.sourceId,
      sourceTitle: source.title,
      projectTitle: context.projectTitle,
      goalTitle: context.goalTitle,
      nodeTitle: context.nodeTitle,
      sessionState: session.state,
      activeDurationMs: session.timer
        ? session.timer.getActiveDuration().milliseconds
        : 0,
      nextStep: context.nextStep || `Continue ${source.title}`,
      notes: context.notes || "",
      capturedAt: Date.now(),
    });
  }
}
