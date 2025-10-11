/*
#### Level 4
The database should be backed up from time to time. Introduce operations to support backing up and restoring the database state based on timestamps. When restoring, TTL expiration times should be recalculated accordingly.

- **BACKUP <timestamp>**  
  Should save the database state at the specified timestamp, including the remaining TTL for all records and fields. Remaining TTL is the difference between their initial TTL and their current lifespan (the duration between the timestamp of this operation and their initial timestamp). Returns a string representing the number of non-empty non-expired records in the database.

- **RESTORE <timestampToRestore>**  
  Should restore the database from the latest backup before or at timestampToRestore. It is guaranteed that a backup before or at timestampToRestore will exist.

Assumption: delete_at, set_at, set_at_with_ttl, etc., should not affect existing backups. For snapshots, use a deep copy of all states in the class. No need for optimization; brute force is acceptable if test cases pass.

*/

import { TTL } from './level3.js';

export class BackupRestore extends TTL {
  constructor() {
    super();
    // map: backupTimestamp -> { db: Map<key, recordObj>, ttlRemaining: Map<key, Map<field, remainingTTL|null>> }
    this.backups = new Map();
  }

  // Clean expired fields across all keys at a given timestamp
  cleanAllExpired(timestamp) {
    for (const key of Array.from(this.db.keys())) {
      this.cleanExpiredFields(timestamp, key);
    }
  }

  // Create a deep snapshot of current DB state at `timestamp`.
  // Returns string with number of non-empty non-expired records.
  backup(timestamp) {
    // ensure expired fields are removed for an accurate snapshot
    this.cleanAllExpired(timestamp);

    const snapshotDb = new Map();
    const ttlRemaining = new Map();

    for (const [key, record] of this.db.entries()) {
      // for every field of each record in db
      // make copy of the record, and its ttl remaining
      // if ttl is infinite, store null
      // if ttl expired, skip field
      // if all fields expired, skip record
      const recordCopy = {};
      const ttlRecordCopy = new Map();

      // for the fields present in record with key above
      for (const field of Object.keys(record)) {
        // compute remaining TTL if exists
        let remaining = null;
        // check if ttlData map has this entry for the key, and this field is still valid
        if (this.ttlData.has(key) && this.ttlData.get(key).has(field)) {
          const info = this.ttlData.get(key).get(field);
          remaining = info.expiresAt - timestamp;
          if (remaining <= 0) continue; // skip expired
        }
        recordCopy[field] = record[field];
        ttlRecordCopy.set(field, remaining); // null => infinite TTL
      }

      // only add non-empty records
      if (Object.keys(recordCopy).length > 0) {
        snapshotDb.set(key, recordCopy);
        ttlRemaining.set(key, ttlRecordCopy);
      }
    }

    this.backups.set(timestamp, { db: snapshotDb, ttlRemaining });
    return `${snapshotDb.size}`;
  }

  // Restore DB from the latest backup at or before timestampToRestore
  restore(timestampToRestore) {
    const times = Array.from(this.backups.keys()).filter(t => t <= timestampToRestore);
    if (times.length === 0) throw new Error('No available backup to restore');
    const latest = Math.max(...times);
    const snap = this.backups.get(latest);

    // restore deep copies
    this.db = new Map();
    this.ttlData = new Map();

    for (const [key, record] of snap.db.entries()) {
      // clone record object
      this.db.set(key, { ...record });

      const ttlMap = snap.ttlRemaining.get(key);
      if (!ttlMap) continue;
      for (const [field, remaining] of ttlMap.entries()) {
        if (remaining === null) {
          // infinite TTL -> no ttlData entry
          continue;
        }
        if (!this.ttlData.has(key)) this.ttlData.set(key, new Map());
        this.ttlData.get(key).set(field, {
          value: record[field],
          // recompute expiresAt relative to restore time
          expiresAt: timestampToRestore + remaining
        });
      }
    }
  }
}