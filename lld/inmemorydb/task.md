### In-Memory Database

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

#### Level 2
The database should support displaying data based on filters. Introduce an operation to support printing some fields of a record.

- **scan(self, timestamp: int, key: str) -> list[str]**  
  Should return a list of strings representing the fields of the record associated with key. The returned list should be in the following format ["<field_1>(<value_1>)", "<field_2>(<value_2>)", ...], where fields are sorted lexicographically. If the specified record does not exist, returns an empty list.

- **scan_by_prefix(self, timestamp: int, key: str, prefix: str) -> list[str]**  
  Should return a list of strings representing some fields of the record associated with key. Specifically, only fields that start with prefix should be included. The returned list should be in the same format as in the scan operation with fields sorted in lexicographical order.

#### Level 3
Support the TTL (Time-To-Live) settings for records and fields. For each field-value pair in the database, the TTL determines how long that value will persist before being removed. Note: All relevant operations defined in previous levels are assumed to have an infinite TTL.

- **set_with_ttl(self, timestamp: int, key: str, field: str, value: int, ttl: int) -> None**  
  Should insert the specified value and set its Time-To-Live starting at timestamp. If the field in the record already exists, then update its value and TTL. The ttl parameter represents the number of time units that this field-value pair should exist in the database, meaning it will be available during this interval: 

- **compare_and_set_with_ttl(self, timestamp: int, key: str, field: str, expected_value: int, new_value: int, ttl: int) -> bool**  
  The same as compare_and_set, but should also update TTL of the new_value. This operation should return True if the field was updated and False otherwise. It is guaranteed that ttl is greater than 0.

For sets without TTL, set the expiration time to infinity (e.g., float('inf')) to simplify handling. If a previous set_with_ttl exists for the same key+field, a subsequent set without TTL should make the expiration permanent.

#### Level 4
The database should be backed up from time to time. Introduce operations to support backing up and restoring the database state based on timestamps. When restoring, TTL expiration times should be recalculated accordingly.

- **BACKUP <timestamp>**  
  Should save the database state at the specified timestamp, including the remaining TTL for all records and fields. Remaining TTL is the difference between their initial TTL and their current lifespan (the duration between the timestamp of this operation and their initial timestamp). Returns a string representing the number of non-empty non-expired records in the database.

- **RESTORE <timestampToRestore>**  
  Should restore the database from the latest backup before or at timestampToRestore. It is guaranteed that a backup before or at timestampToRestore will exist.

Assumption: delete_at, set_at, set_at_with_ttl, etc., should not affect existing backups. For snapshots, use a deep copy of all states in the class. No need for optimization; brute force is acceptable if test cases pass.