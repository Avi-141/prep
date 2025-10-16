/*
Unified In-Memory Database Implementation
Combines all levels (1-4) into a single class:
- Level 1: Basic CRUD operations (set, get, compare_and_set, compare_and_delete)
- Level 2: Scan operations (scan, scan_by_prefix)
- Level 3: TTL support (set_with_ttl, compare_and_set_with_ttl)
- Level 4: Backup and restore functionality
*/

export class InMemoryDatabase {
    constructor() {
        // Main database: key -> { field: value }
        this.db = new Map();
        
        // TTL tracking: key -> field -> { value, expiresAt }
        this.ttlData = new Map();
        
        // Backups: timestamp -> { db: Map, ttlRemaining: Map }
        this.backups = new Map();
    }

    // ==================== Level 1: Basic Operations ====================

    /**
     * Insert or update a field-value pair in a record
     */
    set(timestamp, key, field, value) {
        if (this.db.has(key)) {
            const record = this.db.get(key);
            record[field] = value;
        } else {
            this.db.set(key, { [field]: value });
        }
        
        // Remove any TTL data for this field (set without TTL = infinite)
        if (this.ttlData.has(key)) {
            this.ttlData.get(key).delete(field);
            if (this.ttlData.get(key).size === 0) {
                this.ttlData.delete(key);
            }
        }
    }

    /**
     * Update value if current value matches expected_value
     */
    compare_and_set(timestamp, key, field, expected_value, new_value) {
        if (!this.db.has(key)) return false;
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        
        record[field] = new_value;
        return true;
    }

    /**
     * Delete field if current value matches expected_value
     */
    compare_and_delete(timestamp, key, field, expected_value) {
        if (!this.db.has(key)) return false;
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        
        delete record[field];
        
        // Clean up TTL data
        if (this.ttlData.has(key)) {
            this.ttlData.get(key).delete(field);
            if (this.ttlData.get(key).size === 0) {
                this.ttlData.delete(key);
            }
        }
        
        // Optional: remove empty records
        if (Object.keys(record).length === 0) {
            this.db.delete(key);
        }
        
        return true;
    }

    /**
     * Get the value of a field in a record
     */
    get(timestamp, key, field) {
        this.cleanExpiredFields(timestamp, key);
        
        if (!this.db.has(key)) return null;
        const record = this.db.get(key);
        if (!(field in record)) return null;
        return record[field];
    }

    // ==================== Level 2: Scan Operations ====================

    /**
     * Return all fields of a record in lexicographical order
     */
    scan(timestamp, key) {
        this.cleanExpiredFields(timestamp, key);
        return this._scan_fields(key, null);
    }

    /**
     * Return fields matching a prefix in lexicographical order
     */
    scan_by_prefix(timestamp, key, prefix) {
        this.cleanExpiredFields(timestamp, key);
        return this._scan_fields(key, prefix);
    }

    /**
     * Helper method for scan operations
     */
    _scan_fields(key, prefix = null) {
        if (!this.db.has(key)) return [];
        
        const record = this.db.get(key);
        const fields = Object.keys(record).sort();
        const result = [];
        
        for (const field of fields) {
            if (!prefix || field.startsWith(prefix)) {
                result.push(`${field}(${record[field]})`);
            }
        }
        
        return result;
    }

    // ==================== Level 3: TTL Operations ====================

    /**
     * Check if a field has expired
     */
    isExpired(timestamp, key, field) {
        if (!this.ttlData.has(key)) return false;
        const fieldData = this.ttlData.get(key).get(field);
        if (!fieldData) return false;
        return timestamp >= fieldData.expiresAt;
    }

    /**
     * Remove expired fields from a record
     */
    cleanExpiredFields(timestamp, key) {
        if (!this.ttlData.has(key) || !this.db.has(key)) return;
        
        const record = this.db.get(key);
        const ttlRecord = this.ttlData.get(key);
        
        // Delete fields with expired TTL
        for (const [field, ttlInfo] of ttlRecord.entries()) {
            if (timestamp >= ttlInfo.expiresAt) {
                delete record[field];
                ttlRecord.delete(field);
            }
        }
        
        // Clean up empty maps
        if (ttlRecord.size === 0) {
            this.ttlData.delete(key);
        }
        
        if (Object.keys(record).length === 0) {
            this.db.delete(key);
        }
    }

    /**
     * Set a field with TTL (Time-To-Live)
     */
    set_with_ttl(timestamp, key, field, value, ttl) {
        // Set the value
        if (this.db.has(key)) {
            this.db.get(key)[field] = value;
        } else {
            this.db.set(key, { [field]: value });
        }
        
        // Set TTL info
        if (!this.ttlData.has(key)) {
            this.ttlData.set(key, new Map());
        }
        
        this.ttlData.get(key).set(field, {
            value: value,
            expiresAt: timestamp + ttl
        });
    }

    /**
     * Compare and set with TTL
     */
    compare_and_set_with_ttl(timestamp, key, field, expected_value, new_value, ttl) {
        this.cleanExpiredFields(timestamp, key);
        
        if (!this.db.has(key)) return false;
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        
        // Update the value
        record[field] = new_value;
        
        // Set TTL info
        if (!this.ttlData.has(key)) {
            this.ttlData.set(key, new Map());
        }
        
        this.ttlData.get(key).set(field, {
            value: new_value,
            expiresAt: timestamp + ttl
        });
        
        return true;
    }

    // ==================== Level 4: Backup & Restore ====================

    /**
     * Clean expired fields across all keys
     */
    cleanAllExpired(timestamp) {
        for (const key of Array.from(this.db.keys())) {
            this.cleanExpiredFields(timestamp, key);
        }
    }

    /**
     * Create a backup snapshot at the given timestamp
     * Returns the number of non-empty, non-expired records
     */
    backup(timestamp) {
        // Ensure expired fields are removed for an accurate snapshot
        this.cleanAllExpired(timestamp);

        const snapshotDb = new Map();
        const ttlRemaining = new Map();

        for (const [key, record] of this.db.entries()) {
            const recordCopy = {};
            const ttlRecordCopy = new Map();

            for (const field of Object.keys(record)) {
                // Compute remaining TTL if exists
                let remaining = null;
                
                if (this.ttlData.has(key) && this.ttlData.get(key).has(field)) {
                    const info = this.ttlData.get(key).get(field);
                    remaining = info.expiresAt - timestamp;
                    if (remaining <= 0) continue; // Skip expired
                }
                
                recordCopy[field] = record[field];
                ttlRecordCopy.set(field, remaining); // null => infinite TTL
            }

            // Only add non-empty records
            if (Object.keys(recordCopy).length > 0) {
                snapshotDb.set(key, recordCopy);
                ttlRemaining.set(key, ttlRecordCopy);
            }
        }

        this.backups.set(timestamp, { db: snapshotDb, ttlRemaining });
        return `${snapshotDb.size}`;
    }

    /**
     * Restore from the latest backup at or before the given timestamp
     */
    restore(timestampToRestore) {
        const times = Array.from(this.backups.keys()).filter(t => t <= timestampToRestore);
        if (times.length === 0) {
            throw new Error('No available backup to restore');
        }
        
        const latest = Math.max(...times);
        const snap = this.backups.get(latest);

        // Restore deep copies
        this.db = new Map();
        this.ttlData = new Map();

        for (const [key, record] of snap.db.entries()) {
            // Clone record object
            this.db.set(key, { ...record });

            const ttlMap = snap.ttlRemaining.get(key);
            if (!ttlMap) continue;
            
            for (const [field, remaining] of ttlMap.entries()) {
                if (remaining === null) {
                    // Infinite TTL -> no ttlData entry
                    continue;
                }
                
                if (!this.ttlData.has(key)) {
                    this.ttlData.set(key, new Map());
                }
                
                this.ttlData.get(key).set(field, {
                    value: record[field],
                    // Recompute expiresAt relative to restore time
                    expiresAt: timestampToRestore + remaining
                });
            }
        }
    }

    // ==================== Utility Methods ====================

    /**
     * Get the current state of the database (for debugging)
     */
    getState() {
        return {
            db: Array.from(this.db.entries()),
            ttlData: Array.from(this.ttlData.entries()).map(([key, fieldMap]) => [
                key,
                Array.from(fieldMap.entries())
            ]),
            backupCount: this.backups.size
        };
    }

    /**
     * Clear all data (for testing)
     */
    clear() {
        this.db.clear();
        this.ttlData.clear();
        this.backups.clear();
    }
}
