
/*

#### Level 3
Support the TTL (Time-To-Live) settings for records and fields. For each field-value pair in the database, the TTL determines how long that value will persist before being removed. 

Note: All relevant operations defined in previous levels are assumed to have an infinite TTL.

- **set_with_ttl(self, timestamp: int, key: str, field: str, value: int, ttl: int) -> None**  
  Should insert the specified value and set its Time-To-Live starting at timestamp. If the field in the record already exists, then update its value and TTL. The ttl parameter represents the number of time units that this field-value pair should exist in the database, meaning it will be available during this interval: 

- **compare_and_set_with_ttl(self, timestamp: int, key: str, field: str, expected_value: int, new_value: int, ttl: int) -> bool**  
  The same as compare_and_set, but should also update TTL of the new_value. This operation should return True if the field was updated and False otherwise. It is guaranteed that ttl is greater than 0.

For sets without TTL, set the expiration time to infinity (e.g., float('inf')) to simplify handling. If a previous set_with_ttl exists for the same key+field, a subsequent set without TTL should make the expiration permanent.
*/

import { Filter } from "./level2.js";


export class TTL extends Filter{
    constructor(){
        super()
        // key -> field -> {value, expiresAt}
        this.ttlData = new Map();
    }

    // Helper to check if a field is expired
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
        
        // delete4 record if ttl expired 
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

    // Override get to check TTL
    get(timestamp, key, field) {
        this.cleanExpiredFields(timestamp, key);
        return super.get(timestamp, key, field);
    }

    // Override set to maintain infinite TTL behavior for previous queries.
    set(timestamp, key, field, value) {
        super.set(timestamp, key, field, value);
        // Remove any TTL data for this field
        if (this.ttlData.has(key)) {
            this.ttlData.get(key).delete(field);
            if (this.ttlData.get(key).size === 0) {
                this.ttlData.delete(key);
            }
        }
    }

    add_ttl_info(timestamp, key, field, value, ttl){
         this.ttlData.get(key).set(field, {
            value: value,
            expiresAt: timestamp + ttl
        });
    }

    set_with_ttl(timestamp, key, field, value, ttl) {
        // First set the value normally
        super.set(timestamp, key, field, value);
        // Then set TTL info
        if (!this.ttlData.has(key)) {
            this.ttlData.set(key, new Map());
        }
        this.add_ttl_info(timestamp, key, field, value, ttl)
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
        this.add_ttl_info(timestamp, key, field, value, ttl)
        return true;
    }

    // Override scan methods to clean expired fields first
    // important shit..
    scan(timestamp, key) {
        this.cleanExpiredFields(timestamp, key);
        return super.scan(timestamp, key);
    }

    scan_by_prefix(timestamp, key, prefix) {
        this.cleanExpiredFields(timestamp, key);
        return super.scan_by_prefix(timestamp, key, prefix);
    }
}