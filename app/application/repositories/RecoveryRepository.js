/**
 * RecoveryRepository
 * Interface for Recovery Record persistence operations.
 */

export class RecoveryRepository {
  /**
   * Find a RecoveryRecord by ID.
   * @param {string} id
   * @returns {Promise<RecoveryRecord|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all active (unresolved) Recovery Records.
   * @returns {Promise<RecoveryRecord[]>}
   */
  async findActive() {
    throw new Error("Not implemented");
  }

  /**
   * Find all Recovery Records.
   * @returns {Promise<RecoveryRecord[]>}
   */
  async findAll() {
    throw new Error("Not implemented");
  }

  /**
   * Save a RecoveryRecord (create or update).
   * @param {RecoveryRecord} recovery
   * @returns {Promise<RecoveryRecord>}
   */
  async save(recovery) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a RecoveryRecord by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
