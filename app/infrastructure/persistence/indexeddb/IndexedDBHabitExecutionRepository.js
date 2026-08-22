/**
 * IndexedDBHabitExecutionRepository
 * Concrete implementation of HabitExecutionRepository using IndexedDB.
 */

import { HabitExecutionRepository } from "../../../application/repositories/HabitExecutionRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { HabitExecution } from "../../../domain/entities/HabitExecution.js";

export class IndexedDBHabitExecutionRepository extends HabitExecutionRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.HABIT_EXECUTIONS, id);
    return data ? HabitExecution.fromJSON(data) : null;
  }

  async findByHabitId(habitId) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.HABIT_EXECUTIONS,
      "habitId",
      habitId,
    );
    return items.map((data) => HabitExecution.fromJSON(data));
  }

  async findByHabitIdAndDate(habitId, date) {
    const data = await indexedDBAdapter.getOneByCompoundIndex(
      StoreNames.HABIT_EXECUTIONS,
      "habitId_date",
      [habitId, date],
    );
    return data ? HabitExecution.fromJSON(data) : null;
  }

  async findByDate(date) {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.HABIT_EXECUTIONS,
      "date",
      date,
    );
    return items.map((data) => HabitExecution.fromJSON(data));
  }

  async save(execution) {
    const data = execution.toJSON();
    await indexedDBAdapter.put(StoreNames.HABIT_EXECUTIONS, data);
    return execution;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.HABIT_EXECUTIONS, id);
  }
}
