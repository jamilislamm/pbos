/**
 * IndexedDBHabitRepository
 * Concrete implementation of HabitRepository using IndexedDB.
 *
 * Architecture: SYSTEM_ARCHITECTURE.md §16-17
 * ADR-004: Persistence adapters behind the boundary.
 */

import { HabitRepository } from "../../../application/repositories/HabitRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Habit } from "../../../domain/entities/Habit.js";

export class IndexedDBHabitRepository extends HabitRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.HABITS, id);
    return data ? Habit.fromJSON(data) : null;
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.HABITS);
    return items.map((data) => Habit.fromJSON(data));
  }

  async findActive() {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.HABITS,
      "status",
      "active",
    );
    return items.map((data) => Habit.fromJSON(data));
  }

  async save(habit) {
    const data = habit.toJSON();
    await indexedDBAdapter.put(StoreNames.HABITS, data);
    return habit;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.HABITS, id);
  }
}
