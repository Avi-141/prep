import { inMemDb } from './level1.js';
import { Filter } from './level2.js';
import { TTL } from './level3.js';

function testAll() {
    console.log("=== Testing Level 1 - Basic Operations ===");
    const db1 = new inMemDb();
    
    // Level 1 tests
    db1.set(100, "user1", "name", 42);
    db1.set(101, "user1", "age", 25);
    console.log("Get user1.name:", db1.get(102, "user1", "name")); // 42
    console.log("Get user1.age:", db1.get(103, "user1", "age")); // 25
    console.log("Compare and set (valid):", db1.compare_and_set(105, "user1", "age", 25, 26)); // true
    console.log("Compare and delete (valid):", db1.compare_and_delete(109, "user1", "age", 26)); // true
    
    console.log("\n=== Testing Level 2 - Scan Operations ===");
    const db2 = new Filter();
    
    // Level 2 tests
    db2.set(200, "user1", "zebra", 1);
    db2.set(201, "user1", "apple", 2);
    db2.set(202, "user1", "banana", 3);
    db2.set(202, "user2", "aaaa", 1);
    console.log("Scan user1:", db2.scan(204, "user1")); 
    console.log("Scan with prefix 'a':", db2.scan_by_prefix(205, "user1", "a")); 
    
    console.log("\n=== Testing Level 3 - TTL Operations ===");
    const db3 = new TTL();
    
    // Level 3 tests
    db3.set_with_ttl(300, "user1", "temp_score", 100, 50); // expires at 350
    db3.set(301, "user1", "permanent_score", 200);
    console.log("Get temp_score before expiry:", db3.get(310, "user1", "temp_score")); // 100
    console.log("Get temp_score after expiry:", db3.get(360, "user1", "temp_score")); // null
    console.log("Get permanent_score after expiry:", db3.get(361, "user1", "permanent_score")); // 200
    
}

// Export for external use or run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testAll();
}

export { testAll };

// Quick backup/restore smoke test
import { BackupRestore } from './level4.js';

function testBackupRestore() {
    console.log('\n=== Testing Level 4 - Backup/Restore ===');
    const db = new BackupRestore();
    db.set_with_ttl(1000, 'u1', 'a', 1, 100); // expires at 1100
    db.set(1001, 'u1', 'b', 2); // infinite
    const snapCount = db.backup(1050);
    console.log('Backup count:', snapCount); // should be 1

    // mutate after backup
    db.set_with_ttl(1060, 'u1', 'c', 3, 10); // expires at 1070
    db.cleanAllExpired(1080);
    console.log('Before restore scan:', db.scan(1080, 'u1'));

    db.restore(1050);
    console.log('After restore scan:', db.scan(1080, 'u1'));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    testBackupRestore();
}