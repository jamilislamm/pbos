/**
 * LifeDomainRepository
 * Interface for Life Domain persistence operations.
 */

export class LifeDomainRepository {
  /**
   * Find a LifeDomain by ID.
   * @param {string} id
   * @returns {Promise<LifeDomain|null>}
   */
  async findById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Find all LifeDomains.
   * @returns {Promise<LifeDomain[]>}
   */
  async findAll() {
    throw new Error("Not implemented");
  }

  /**
   * Save a LifeDomain (create or update).
   * @param {LifeDomain} lifeDomain
   * @returns {Promise<LifeDomain>}
   */
  async save(lifeDomain) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a LifeDomain by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }
}
