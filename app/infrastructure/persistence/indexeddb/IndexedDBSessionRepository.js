/**
 * IndexedDBSessionRepository
 * Concrete implementation of SessionRepository using IndexedDB.
 */

import { SessionRepository } from "../../../application/repositories/SessionRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { Session } from "../../../domain/entities/Session.js";

export class IndexedDBSessionRepository extends SessionRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.SESSIONS, id);
    return data ? Session.fromJSON(data) : null;
  }

  async findBySource(sourceType, sourceId) {
    const items = await indexedDBAdapter.getByCompoundIndex(
      StoreNames.SESSIONS,
      "sourceType_sourceId",
      [sourceType, sourceId],
    );
    return items.map((data) => Session.fromJSON(data));
  }

  async findActive() {
    // Active states: running, paused, interrupted
    const all = await indexedDBAdapter.getAll(StoreNames.SESSIONS);
    const activeStates = ["running", "paused", "interrupted"];
    return all
      .filter((data) => activeStates.includes(data.state))
      .map((data) => Session.fromJSON(data));
  }

  async findByDateRange(startDate, endDate) {
    const all = await indexedDBAdapter.getAll(StoreNames.SESSIONS);
    return all
      .filter(
        (data) => data.startedAt >= startDate && data.startedAt <= endDate,
      )
      .map((data) => Session.fromJSON(data));
  }

  async save(session) {
    const data = session.toJSON();
    await indexedDBAdapter.put(StoreNames.SESSIONS, data);
    return session;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.SESSIONS, id);
  }
}
