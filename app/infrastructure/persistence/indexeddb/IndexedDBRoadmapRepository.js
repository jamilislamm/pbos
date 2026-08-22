/**
 * IndexedDBRoadmapRepository
 * Concrete repository for Roadmap persistence (no interface — direct implementation).
 */

import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Roadmap } from "../../../domain/entities/Roadmap.js";

export class IndexedDBRoadmapRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.ROADMAPS, id);
    return data ? Roadmap.fromJSON(data) : null;
  }

  async findByProjectId(projectId) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.ROADMAPS,
      "projectId",
      projectId,
    );
    return items.map((data) => Roadmap.fromJSON(data));
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.ROADMAPS);
    return items.map((data) => Roadmap.fromJSON(data));
  }

  async save(roadmap) {
    const data = roadmap.toJSON();
    await indexedDBAdapter.put(StoreNames.ROADMAPS, data);
    return roadmap;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.ROADMAPS, id);
  }
}
