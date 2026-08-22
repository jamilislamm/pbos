/**
 * IndexedDBLifeDomainRepository
 * Concrete implementation of LifeDomainRepository using IndexedDB.
 */

import { LifeDomainRepository } from "../../../application/repositories/LifeDomainRepository.js";
import { indexedDBAdapter, StoreNames } from "./IndexedDBAdapter.js";
import { LifeDomain } from "../../../domain/entities/LifeDomain.js";

export class IndexedDBLifeDomainRepository extends LifeDomainRepository {
  async findById(id) {
    const data = await indexedDBAdapter.get(StoreNames.LIFE_DOMAINS, id);
    return data ? LifeDomain.fromJSON(data) : null;
  }

  async findAll() {
    const items = await indexedDBAdapter.getAll(StoreNames.LIFE_DOMAINS);
    return items.map((data) => LifeDomain.fromJSON(data));
  }

  async save(lifeDomain) {
    const data = lifeDomain.toJSON();
    await indexedDBAdapter.put(StoreNames.LIFE_DOMAINS, data);
    return lifeDomain;
  }

  async delete(id) {
    await indexedDBAdapter.delete(StoreNames.LIFE_DOMAINS, id);
  }
}
