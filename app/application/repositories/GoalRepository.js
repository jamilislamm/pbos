/**
 * GoalRepository
 * Interface for Goal persistence operations.
 */

export class GoalRepository {
  /**
   * Find a Goal by ID.
   * @param {string} id
   * @returns {Promise<Goal|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Goals.
   * @returns {Promise<Goal[]>}
   */
  async findAll() {
    throw new Error("Not implemented");
  }

  /**
   * Save a Goal (create or update).
   * @param {Goal} goal
   * @returns {Promise<Goal>}
   */
  async save(goal) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a Goal by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
