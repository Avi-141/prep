/*
#### In-Memory Database - Unified Implementation (Levels 1, 2, 3)

This unified class combines all three levels of functionality:
- Level 1: Basic CRUD operations (set, get, compare_and_set, compare_and_delete)
- Level 2: Filtering operations (scan, scan_by_prefix)
- Level 3: TTL (Time-To-Live) support (set_with_ttl, compare_and_set_with_ttl)

All operations have a timestamp parameter in milliseconds. Timestamps are guaranteed to be unique 
and in the range from 1 to 10^9, given in strictly increasing order.
*/

export class InMemoryDB {
    constructor() {
        // Main database storage: key -> { field: value }
        this.db = new Map();
        // TTL storage: key -> field -> { value, expiresAt }
        this.ttlData = new Map();
    }

    // ==================== LEVEL 1: Basic Operations ====================

    set(timestamp, key, field, value) {
        if (this.db.has(key)) {
            const entryDetails = this.db.get(key);
            this.db.set(key, { ...entryDetails, [field]: value });
        } else {
            this.db.set(key, { [field]: value });
        }
        
        // Remove any TTL data for this field (infinite TTL)
        if (this.ttlData.has(key)) {
            this.ttlData.get(key).delete(field);
            if (this.ttlData.get(key).size === 0) {
                this.ttlData.delete(key);
            }
        }
    }

    compare_and_set(timestamp, key, field, expected_value, new_value) {
        if (!this.db.has(key)) return false;
        
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        
        this.db.set(key, {
            ...this.db.get(key),
            [field]: new_value
        });
        
        return true;
    }

    compare_and_delete(timestamp, key, field, expected_value) {
        if (!this.db.has(key)) return false;
        
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        
        delete record[field];
        
        // Clean up TTL data if exists
        if (this.ttlData.has(key)) {
            this.ttlData.get(key).delete(field);
            if (this.ttlData.get(key).size === 0) {
                this.ttlData.delete(key);
            }
        }
        
        return true;
    }

    get(timestamp, key, field) {
        this.cleanExpiredFields(timestamp, key);
        
        if (!this.db.has(key)) return null;
        
        const record = this.db.get(key);
        if (!(field in record)) return null;
        
        return record[field];
    }

    // ==================== LEVEL 2: Filtering Operations ===================
    scan_fields(timestamp, key, prefix = null) {
        this.cleanExpiredFields(timestamp, key);
        
        const record = this.db.get(key);
        if (!record) return [];
        
        const result = [];
        const fields = Object.keys(record).sort();
        
        for (const field of fields) {
            if (!prefix || field.startsWith(prefix)) {
                result.push(`${field}(${record[field]})`);
            }
        }
        
        return result;
    }

    scan(timestamp, key) {
        return this.scan_fields(timestamp, key);
    }

    scan_by_prefix(timestamp, key, prefix) {
        return this.scan_fields(timestamp, key, prefix);
    }

    isExpired(timestamp, key, field) {
        if (!this.ttlData.has(key)) return false;
        
        const fieldData = this.ttlData.get(key).get(field);
        if (!fieldData) return false;
        
        return timestamp >= fieldData.expiresAt;
    }

    cleanExpiredFields(timestamp, key) {
        if (!this.ttlData.has(key) || !this.db.has(key)) return;
        
        const record = this.db.get(key);
        const ttlRecord = this.ttlData.get(key);
        
        // Delete fields if TTL expired
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

    add_ttl_info(timestamp, key, field, value, ttl) {
        this.ttlData.get(key).set(field, {
            value: value,
            expiresAt: timestamp + ttl
        });
    }

    set_with_ttl(timestamp, key, field, value, ttl) {
        // First set the value in the database
        if (this.db.has(key)) {
            const entryDetails = this.db.get(key);
            this.db.set(key, { ...entryDetails, [field]: value });
        } else {
            this.db.set(key, { [field]: value });
        }
        
        // Then set TTL info
        if (!this.ttlData.has(key)) {
            this.ttlData.set(key, new Map());
        }
        this.add_ttl_info(timestamp, key, field, value, ttl);
    }

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
        this.add_ttl_info(timestamp, key, field, new_value, ttl);
        
        return true;
    }
}
