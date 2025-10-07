/*
#### Level 1
The basic level of the in-memory database contains records. Each record can be accessed with a unique identifier key, which is of string type. A record contains several field-value pairs, with field as string type and value as integer type. All operations have a timestamp parameter—a string field timestamp in milliseconds. It is guaranteed that all timestamps are unique and are in a range from 1 to 10^9. Operations will be given in order of strictly increasing timestamps. Timestamps will be needed starting from Level 3.

- **set(self, timestamp: int, key: str, field: str, value: int) -> None**  
  Should insert a field-value pair to the record associated with key. If the field in the record already exists, replace the existing value with the specified value. If the record does not exist, a new one is created.

- **compare_and_set(self, timestamp: int, key: str, field: str, expected_value: int, new_value: int) -> bool**  
  Should update the value of field in the record associated with key to new_value if the current value equals expected value. If expected value does not match the current value, or either key or field does not exist, this operation is ignored. This operation should return True if the field was updated and False otherwise.

- **compare_and_delete(self, timestamp: int, key: str, field: str, expected_value: int) -> bool**  
  Should remove the field in the record associated with key if the previous value equals expected_value. If expected_value does not match the current value, or either key or field does not exist, this operation is ignored. This operation should return True if the field was removed and False otherwise.

- **get(self, timestamp: int, key: str, field: str) -> int | None**  
  Should return the value contained within field of the record associated with key. If the record or the field does not exist, should return None.

Other notes:  
- Implement with timestamp: set, get, delete, set_with_ttl. Cannot get if TTL expires.  
- Implement scan and scan_with_prefix.  
- Implement backup and restore. Backup is taking a snapshot; restore is recovering the snapshot from a specified time.
*/


export class inMemDb {
    constructor() {
        this.db = new Map();
    }

    set(timestamp, key, field, value) {
        if (this.db.has(key)) {
            const entryDetails = this.db.get(key);
            this.db.set(key, { ...entryDetails, [field]: value });
        } else {
            this.db.set(key, { [field]: value });
        }
    }

    compare_and_set(timestamp, key, field, expected_value, new_value) {
        const entry = this.db.has(key)
        if (!entry) return false;
        const value = this.db.get(key)[field]
        if (value !== expected_value) return false;
        this.db.set(key, {
            ...this.db.get(key),
            [field]: new_value
        })
        return true
    }

    compare_and_delete(timestamp, key, field, expected_value) {
        if (!this.db.has(key)) return false;
        const record = this.db.get(key);
        if (!(field in record)) return false;
        if (record[field] !== expected_value) return false;
        delete record[field];
        // If record is now empty, optionally remove the key entirely
        // if (Object.keys(record).length === 0) this.db.delete(key);
        return true;
    }

    get(timestamp, key, field) {
        if (!this.db.has(key)) return null
        const record = this.db.get(key)
        if(!(field in record)) return null
        return record[field]
    }
}