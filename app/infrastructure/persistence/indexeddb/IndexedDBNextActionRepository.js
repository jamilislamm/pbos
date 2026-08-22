/**
 * IndexedDBNextActionRepository
 * Concrete implementation of NextActionRepository using IndexedDB.
 */

import { NextActionRepository } from "../../../application/repositories/NextActionRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { NextAction } from "../../../domain/entities/NextAction.js";

export class IndexedDBNextActionRepository extends NextActionRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.NEXT_ACTIONS, id);
    return data ? NextAction.fromJSON(data) : null;
  }

  async findByProjectId(projectId) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.NEXT_ACTIONS,
      "projectId",
      projectId,
    );
    return items.map((data) => NextAction.fromJSON(data));
  }

  async findExecutable() {
    const all = await indexedDBAdapter.getAll(StoreNames.NEXT_ACTIONS);
    const executableStates = ["available", "active"];
    return all
      .filter((data) => executableStates.includes(data.status))
      .map((data) => NextAction.fromJSON(data));
  }

  async findBlocked() {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.NEXT_ACTIONS,
      "status",
      "blocked",
    );
    return items.map((data) => NextAction.fromJSON(data));
  }

  async save(nextAction) {
    const data = nextAction.toJSON();
    await indexedDBAdapter.put(StoreNames.NEXT_ACTIONS, data);
    return nextAction;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.NEXT_ACTIONS, id);
  }
}
