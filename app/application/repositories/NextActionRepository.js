/**
 * NextActionRepository
 * Interface for Next Action persistence operations.
 */

export class NextActionRepository {
  /**
   * Find a NextAction by ID.
   * @param {string} id
   * @returns {Promise<NextAction|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all NextActions for a Project.
   * @param {string} projectId
   * @returns {Promise<NextAction[]>}
   */
  async findByProjectId(projectId) {
    throw new Error("Not implemented");
  }

  /**
   * Find all executable NextActions (Available or Active).
   * @returns {Promise<NextAction[]>}
   */
  async findExecutable() {
    throw new Error("Not implemented");
  }

  /**
   * Find all blocked NextActions.
   * @returns {Promise<NextAction[]>}
   */
  async findBlocked() {
    throw new Error("Not implemented");
  }

  /**
   * Save a NextAction (create or update).
   * @param {NextAction} nextAction
   * @returns {Promise<NextAction>}
   */
  async save(nextAction) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a NextAction by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
