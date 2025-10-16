import { InMemoryDatabase } from './unified.js';
import { BackupRestore } from './level4.js';

console.log("=" .repeat(60));
console.log("COMPARISON: Inheritance Chain vs Unified Class");
console.log("=" .repeat(60));

function testUnified() {
    console.log("\n🔹 Testing Unified Class Approach");
    console.log("-" .repeat(60));
    
    const db = new InMemoryDatabase();
    
    // Level 1: Basic operations
    console.log("\n✅ Level 1: Basic Operations");
    db.set(100, "user1", "name", 42);
    db.set(101, "user1", "age", 25);
    console.log("  get('user1', 'name'):", db.get(102, "user1", "name")); // 42
    console.log("  compare_and_set(age, 25→26):", db.compare_and_set(105, "user1", "age", 25, 26)); // true
    console.log("  get('user1', 'age'):", db.get(106, "user1", "age")); // 26
    
    // Level 2: Scan operations
    console.log("\n✅ Level 2: Scan Operations");
    db.set(200, "user2", "zebra", 1);
    db.set(201, "user2", "apple", 2);
    db.set(202, "user2", "banana", 3);
    db.set(203, "user2", "apricot", 4);
    console.log("  scan('user2'):", db.scan(204, "user2"));
    console.log("  scan_by_prefix('user2', 'a'):", db.scan_by_prefix(205, "user2", "a"));
    
    // Level 3: TTL operations
    console.log("\n✅ Level 3: TTL Operations");
    db.set_with_ttl(300, "session", "token", 12345, 50); // expires at 350
    db.set(301, "session", "permanent", 67890);
    console.log("  get(310, 'session', 'token'):", db.get(310, "session", "token")); // 12345
    console.log("  get(360, 'session', 'token'):", db.get(360, "session", "token")); // null (expired)
    console.log("  get(361, 'session', 'permanent'):", db.get(361, "session", "permanent")); // 67890
    
    // Level 4: Backup & Restore
    console.log("\n✅ Level 4: Backup & Restore");
    db.set(400, "data", "value1", 100);
    db.set_with_ttl(401, "data", "value2", 200, 100); // expires at 501
    console.log("  backup(410):", db.backup(410)); // "1"
    db.set(420, "data", "value3", 300);
    console.log("  get(425, 'data', 'value3'):", db.get(425, "data", "value3")); // 300
    db.restore(410);
    console.log("  After restore(410), get('data', 'value3'):", db.get(430, "data", "value3")); // null
    console.log("  After restore, get('data', 'value1'):", db.get(431, "data", "value1")); // 100
}

function testInheritance() {
    console.log("\n\n🔹 Testing Inheritance Chain Approach");
    console.log("-" .repeat(60));
    
    const db = new BackupRestore();
    
    // Level 1: Basic operations
    console.log("\n✅ Level 1: Basic Operations");
    db.set(100, "user1", "name", 42);
    db.set(101, "user1", "age", 25);
    console.log("  get('user1', 'name'):", db.get(102, "user1", "name")); // 42
    console.log("  compare_and_set(age, 25→26):", db.compare_and_set(105, "user1", "age", 25, 26)); // true
    console.log("  get('user1', 'age'):", db.get(106, "user1", "age")); // 26
    
    // Level 2: Scan operations
    console.log("\n✅ Level 2: Scan Operations");
    db.set(200, "user2", "zebra", 1);
    db.set(201, "user2", "apple", 2);
    db.set(202, "user2", "banana", 3);
    db.set(203, "user2", "apricot", 4);
    console.log("  scan('user2'):", db.scan(204, "user2"));
    console.log("  scan_by_prefix('user2', 'a'):", db.scan_by_prefix(205, "user2", "a"));
    
    // Level 3: TTL operations
    console.log("\n✅ Level 3: TTL Operations");
    db.set_with_ttl(300, "session", "token", 12345, 50); // expires at 350
    db.set(301, "session", "permanent", 67890);
    console.log("  get(310, 'session', 'token'):", db.get(310, "session", "token")); // 12345
    console.log("  get(360, 'session', 'token'):", db.get(360, "session", "token")); // null (expired)
    console.log("  get(361, 'session', 'permanent'):", db.get(361, "session", "permanent")); // 67890
    
    // Level 4: Backup & Restore
    console.log("\n✅ Level 4: Backup & Restore");
    db.set(400, "data", "value1", 100);
    db.set_with_ttl(401, "data", "value2", 200, 100); // expires at 501
    console.log("  backup(410):", db.backup(410)); // "1"
    db.set(420, "data", "value3", 300);
    console.log("  get(425, 'data', 'value3'):", db.get(425, "data", "value3")); // 300
    db.restore(410);
    console.log("  After restore(410), get('data', 'value3'):", db.get(430, "data", "value3")); // null
    console.log("  After restore, get('data', 'value1'):", db.get(431, "data", "value1")); // 100
}

function compareApproaches() {
    console.log("\n\n" + "=" .repeat(60));
    console.log("COMPARISON SUMMARY");
    console.log("=" .repeat(60));
    
    console.log("\n📊 Inheritance Chain (Level1 → Level2 → Level3 → Level4):");
    console.log("  ✅ Pros:");
    console.log("     • Follows single responsibility principle");
    console.log("     • Each level adds one feature incrementally");
    console.log("     • Easy to understand progression");
    console.log("     • Good for interview demonstrations");
    console.log("     • Can test each level independently");
    console.log("\n  ❌ Cons:");
    console.log("     • Deep inheritance chain (4 levels)");
    console.log("     • Method overriding can be confusing");
    console.log("     • Harder to navigate codebase");
    console.log("     • More files to manage");
    console.log("     • Performance overhead from inheritance");
    
    console.log("\n📊 Unified Class:");
    console.log("  ✅ Pros:");
    console.log("     • All functionality in one place");
    console.log("     • No inheritance complexity");
    console.log("     • Easier to understand data flow");
    console.log("     • Better for production code");
    console.log("     • Easier refactoring");
    console.log("     • No method resolution ambiguity");
    console.log("\n  ❌ Cons:");
    console.log("     • Larger single file");
    console.log("     • Can't test levels independently");
    console.log("     • Less clear feature progression");
    console.log("     • May violate single responsibility if too large");
    
    console.log("\n💡 Recommendation:");
    console.log("  • Use INHERITANCE for: Interviews, learning, demonstrations");
    console.log("  • Use UNIFIED for: Production code, real projects, simplicity");
}

// Run all tests
testUnified();
testInheritance();
compareApproaches();
