/**
 * HabitExecutionRepository
 * Interface for Daily Habit Execution persistence operations.
 */

export class HabitExecutionRepository {
  /**
   * Find a HabitExecution by ID.
   * @param {string} id
   * @returns {Promise<HabitExecution|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all executions for a specific Habit.
   * @param {string} habitId
   * @returns {Promise<HabitExecution[]>}
   */
  async findByHabitId(habitId) {
    throw new Error("Not implemented");
  }

  /**
   * Find execution for a specific Habit on a specific date.
   * @param {string} habitId
   * @param {string} date - ISO date string (YYYY-MM-DD)
   * @returns {Promise<HabitExecution|null>}
   */
  async findByHabitIdAndDate(habitId, date) {
    throw new Error("Not implemented");
  }

  /**
   * Find all executions for a specific date.
   * @param {string} date - ISO date string (YYYY-MM-DD)
   * @returns {Promise<HabitExecution[]>}
   */
  async findByDate(date) {
    throw new Error("Not implemented");
  }

  /**
   * Save a HabitExecution (create or update).
   * @param {HabitExecution} execution
   * @returns {Promise<HabitExecution>}
   */
  async save(execution) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a HabitExecution by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
