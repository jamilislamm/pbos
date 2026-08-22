/**
 * IndexedDBRecoveryRepository
 * Concrete implementation of RecoveryRepository using IndexedDB.
 */

import { RecoveryRepository } from "../../../application/repositories/RecoveryRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { RecoveryRecord } from "../../../domain/entities/RecoveryRecord.js";

export class IndexedDBRecoveryRepository extends RecoveryRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.RECOVERY_RECORDS, id);
    return data ? RecoveryRecord.fromJSON(data) : null;
  }

  async findActive() {
    const items = await indexedDBAdapter.getByIndex(
      StoreNames.RECOVERY_RECORDS,
      "status",
      "active",
    );
    return items.map((data) => RecoveryRecord.fromJSON(data));
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.RECOVERY_RECORDS);
    return items.map((data) => RecoveryRecord.fromJSON(data));
  }

  async save(recovery) {
    const data = recovery.toJSON();
    await indexedDBAdapter.put(StoreNames.RECOVERY_RECORDS, data);
    return recovery;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.RECOVERY_RECORDS, id);
  }
}
