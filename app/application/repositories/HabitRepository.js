/**
 * HabitRepository
 * Interface for Habit persistence operations.
 *
 * Architecture: SYSTEM_ARCHITECTURE.md §16-17
 * ADR-004: Domain/application logic must not depend directly on storage technology.
 */

export class HabitRepository {
  /**
   * Find a Habit by ID.
   * @param {string} id
   * @returns {Promise<Habit|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Habits.
   * @returns {Promise<Habit[]>}
   */
  async findAll() {
    throw new Error("Not implemented");
  }

  /**
   * Find all active Habits.
   * @returns {Promise<Habit[]>}
   */
  async findActive() {
    throw new Error("Not implemented");
  }

  /**
   * Save a Habit (create or update).
   * @param {Habit} habit
   * @returns {Promise<Habit>}
   */
  async save(habit) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a Habit by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
