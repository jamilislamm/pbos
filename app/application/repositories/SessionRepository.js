/**
 * SessionRepository
 * Interface for Session persistence operations.
 */

export class SessionRepository {
  /**
   * Find a Session by ID.
   * @param {string} id
   * @returns {Promise<Session|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Sessions for a specific source.
   * @param {string} sourceType
   * @param {string} sourceId
   * @returns {Promise<Session[]>}
   */
  async findBySource(sourceType, sourceId) {
    throw new Error("Not implemented");
  }

  /**
   * Find the currently active Session (Running, Paused, or Interrupted).
   * @returns {Promise<Session|null>}
   */
  async findActive() {
    throw new Error("Not implemented");
  }

  /**
   * Find all Sessions within a date range.
   * @param {number} startDate
   * @param {number} endDate
   * @returns {Promise<Session[]>}
   */
  async findByDateRange(startDate, endDate) {
    throw new Error("Not implemented");
  }

  /**
   * Save a Session (create or update).
   * @param {Session} session
   * @returns {Promise<Session>}
   */
  async save(session) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a Session by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
