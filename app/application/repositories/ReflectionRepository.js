/**
 * ReflectionRepository
 * Interface for Reflection persistence operations.
 */

export class ReflectionRepository {
  /**
   * Find a Reflection by ID.
   * @param {string} id
   * @returns {Promise<Reflection|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Reflections for a specific context.
   * @param {string} contextType
   * @param {string} contextId
   * @returns {Promise<Reflection[]>}
   */
  async findByContext(contextType, contextId) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Reflections within a date range.
   * @param {number} startDate
   * @param {number} endDate
   * @returns {Promise<Reflection[]>}
   */
  async findByDateRange(startDate, endDate) {
    throw new Error("Not implemented");
  }

  /**
   * Save a Reflection (create or update).
   * @param {Reflection} reflection
   * @returns {Promise<Reflection>}
   */
  async save(reflection) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a Reflection by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
