/**
 * IndexedDBGoalRepository
 * Concrete implementation of GoalRepository using IndexedDB.
 */

import { GoalRepository } from "../../../application/repositories/GoalRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Goal } from "../../../domain/entities/Goal.js";

export class IndexedDBGoalRepository extends GoalRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.GOALS, id);
    return data ? Goal.fromJSON(data) : null;
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.GOALS);
    return items.map((data) => Goal.fromJSON(data));
  }

  async save(goal) {
    const data = goal.toJSON();
    await indexedDBAdapter.put(StoreNames.GOALS, data);
    return goal;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.GOALS, id);
  }
}
