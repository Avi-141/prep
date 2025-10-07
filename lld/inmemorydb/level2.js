/*
#### Level 2
The database should support displaying data based on filters. Introduce an operation to support printing some fields of a record.

- **scan(self, timestamp: int, key: str) -> list[str]**  
  Should return a list of strings representing the fields of the record associated with key. The returned list should be in the following format ["<field_1>(<value_1>)", "<field_2>(<value_2>)", ...], where fields are sorted lexicographically. If the specified record does not exist, returns an empty list.

- **scan_by_prefix(self, timestamp: int, key: str, prefix: str) -> list[str]**  
  Should return a list of strings representing some fields of the record associated with key. Specifically, only fields that start with prefix should be included. The returned list should be in the same format as in the scan operation with fields sorted in lexicographical order.
*/

import { inMemDb } from "./level1.js";

export class Filter extends inMemDb{
    constructor(){
        super()
    }

    scan_fields(timestamp, key, prefix = null) {
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

}
