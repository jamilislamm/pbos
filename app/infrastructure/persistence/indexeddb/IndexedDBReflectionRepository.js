/**
 * IndexedDBReflectionRepository
 * Concrete implementation of ReflectionRepository using IndexedDB.
 */

import { ReflectionRepository } from "../../../application/repositories/ReflectionRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Reflection } from "../../../domain/entities/Reflection.js";

export class IndexedDBReflectionRepository extends ReflectionRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.REFLECTIONS, id);
    return data ? Reflection.fromJSON(data) : null;
  }

  async findByContext(contextType, contextId) {
    const items = await indexedDBAdapter.getByCompoundIndex(
      StoreNames.REFLECTIONS,
      "contextType_contextId",
      [contextType, contextId],
    );
    return items.map((data) => Reflection.fromJSON(data));
  }

  async findByDateRange(startDate, endDate) {
    const all = await indexedDBAdapter.getAll(StoreNames.REFLECTIONS);
    return all
      .filter(
        (data) => data.createdAt >= startDate && data.createdAt <= endDate,
      )
      .map((data) => Reflection.fromJSON(data));
  }

  async save(reflection) {
    const data = reflection.toJSON();
    await indexedDBAdapter.put(StoreNames.REFLECTIONS, data);
    return reflection;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.REFLECTIONS, id);
  }
}
