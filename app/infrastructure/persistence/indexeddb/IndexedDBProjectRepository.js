/**
 * IndexedDBProjectRepository
 * Concrete implementation of ProjectRepository using IndexedDB.
 */

import { ProjectRepository } from "../../../application/repositories/ProjectRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Project } from "../../../domain/entities/Project.js";

export class IndexedDBProjectRepository extends ProjectRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.PROJECTS, id);
    return data ? Project.fromJSON(data) : null;
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.PROJECTS);
    return items.map((data) => Project.fromJSON(data));
  }

  async findActive() {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.PROJECTS,
      "status",
      "active",
    );
    return items.map((data) => Project.fromJSON(data));
  }

  async save(project) {
    const data = project.toJSON();
    await indexedDBAdapter.put(StoreNames.PROJECTS, data);
    return project;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.PROJECTS, id);
  }
}
