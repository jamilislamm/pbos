/**
 * ProjectRepository
 * Interface for Project persistence operations.
 */

export class ProjectRepository {
  /**
   * Find a Project by ID.
   * @param {string} id
   * @returns {Promise<Project|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all Projects.
   * @returns {Promise<Project[]>}
   */
  async findAll() {
    throw new Error("Not implemented");
  }

  /**
   * Find all active Projects.
   * @returns {Promise<Project[]>}
   */
  async findActive() {
    throw new Error("Not implemented");
  }

  /**
   * Save a Project (create or update).
   * @param {Project} project
   * @returns {Promise<Project>}
   */
  async save(project) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a Project by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
