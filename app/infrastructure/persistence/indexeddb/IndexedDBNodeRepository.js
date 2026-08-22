/**
 * IndexedDBNodeRepository
 * Concrete repository for Node persistence (no interface — direct implementation).
 */

import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Node } from "../../../domain/entities/Node.js";

export class IndexedDBNodeRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.NODES, id);
    return data ? Node.fromJSON(data) : null;
  }

  async findByRoadmapId(roadmapId) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.NODES,
      "roadmapId",
      roadmapId,
    );
    return items.map((data) => Node.fromJSON(data));
  }

  async findByStatus(status) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.NODES,
      "status",
      status,
    );
    return items.map((data) => Node.fromJSON(data));
  }

  async findByParentId(parentId) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.NODES,
      "parentId",
      parentId,
    );
    return items.map((data) => Node.fromJSON(data));
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.NODES);
    return items.map((data) => Node.fromJSON(data));
  }

  async save(node) {
    const data = node.toJSON();
    await indexedDBAdapter.put(StoreNames.NODES, data);
    return node;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.NODES, id);
  }
}
