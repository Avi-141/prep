import { UnifiedFileStorage } from './unified.js';

console.log('=== Testing Unified File Storage System ===\n');

const storage = new UnifiedFileStorage();

// ========== Level 1 Tests ==========
console.log('--- Level 1: Basic Operations ---');
try {
    storage.upload('file1.txt', 100);
    storage.upload('file2.txt', 200);
    storage.upload('file3.txt', 150);
    console.log('✓ Uploaded 3 files');
    
    console.log('✓ file1.txt size:', storage.getSize('file1.txt'));
    console.log('✓ file2.txt size:', storage.getSize('file2.txt'));
    console.log('✓ non-existent file:', storage.getSize('nope.txt'));
    
    storage.copy('file1.txt', 'file1_copy.txt');
    console.log('✓ Copied file1.txt to file1_copy.txt');
    console.log('✓ file1_copy.txt size:', storage.getSize('file1_copy.txt'));
    
    try {
        storage.upload('file1.txt', 50);
        console.log('✗ Should have thrown error for duplicate upload');
    } catch (e) {
        console.log('✓ Correctly threw error:', e.message);
    }
} catch (e) {
    console.log('✗ Level 1 error:', e.message);
}

// ========== Level 2 Tests ==========
console.log('\n--- Level 2: Search ---');
try {
    storage.upload('app_config.json', 500);
    storage.upload('app_data.json', 300);
    storage.upload('app_test.json', 400);
    storage.upload('data.txt', 250);
    
    const searchResults = storage.search('app');
    console.log('✓ Search results for "app":', 
        searchResults.map(([name, size]) => `${name}(${size})`).join(', '));
    
    const fileResults = storage.search('file');
    console.log('✓ Search results for "file" (top 10):', 
        fileResults.map(([name, size]) => `${name}(${size})`).join(', '));
} catch (e) {
    console.log('✗ Level 2 error:', e.message);
}

// ========== Level 3 Tests ==========
console.log('\n--- Level 3: TTL Support ---');
const storage3 = new UnifiedFileStorage();
try {
    storage3.uploadAt(1000, 'temp_file.txt', 100, 500); // TTL = 500s
    storage3.uploadAt(1000, 'permanent.txt', 200); // No TTL
    
    console.log('✓ Uploaded temp_file.txt at t=1000 with TTL=500');
    console.log('✓ Uploaded permanent.txt at t=1000 with no TTL');
    
    console.log('✓ temp_file.txt at t=1200:', storage3.getAt(1200, 'temp_file.txt'));
    console.log('✓ temp_file.txt at t=1600 (expired):', storage3.getAt(1600, 'temp_file.txt'));
    console.log('✓ permanent.txt at t=1600:', storage3.getAt(1600, 'permanent.txt'));
    
    storage3.uploadAt(2000, 'search1.txt', 300, 1000);
    storage3.uploadAt(2000, 'search2.txt', 400, 500);
    
    const search2500 = storage3.searchAt(2500, 'search');
    console.log('✓ Search at t=2500:', search2500.map(([n, s]) => n).join(', '));
    
    const search3000 = storage3.searchAt(3000, 'search');
    console.log('✓ Search at t=3000 (search2 expired):', search3000.map(([n, s]) => n).join(', '));
    
} catch (e) {
    console.log('✗ Level 3 error:', e.message);
}

// ========== Level 4 Tests ==========
console.log('\n--- Level 4: Rollback ---');
const storage4 = new UnifiedFileStorage();
try {
    storage4.uploadAtWithSnapshot(1000, 'v1.txt', 100);
    console.log('✓ Snapshot 1: Uploaded v1.txt at t=1000');
    
    storage4.uploadAtWithSnapshot(2000, 'v2.txt', 200);
    console.log('✓ Snapshot 2: Uploaded v2.txt at t=2000');
    
    storage4.uploadAtWithSnapshot(3000, 'v3.txt', 300, 2000);
    console.log('✓ Snapshot 3: Uploaded v3.txt at t=3000 with TTL=2000');
    
    console.log('✓ Files before rollback:', storage4.getAllFiles().map(([n]) => n).join(', '));
    console.log('✓ History:', storage4.getHistory());
    
    storage4.rollback(2000);
    console.log('✓ Rolled back to t=2000');
    console.log('✓ Files after rollback:', storage4.getAllFiles().map(([n]) => n).join(', '));
    
} catch (e) {
    console.log('✗ Level 4 error:', e.message);
}

// ========== Integration Test ==========
console.log('\n--- Integration Test: All Features ---');
const integratedStorage = new UnifiedFileStorage();
try {
    // Mix basic and TTL operations
    integratedStorage.uploadAtWithSnapshot(1000, 'doc1.pdf', 1000, 3000);
    integratedStorage.uploadAtWithSnapshot(1500, 'doc2.pdf', 500);
    integratedStorage.copyAtWithSnapshot(2000, 'doc1.pdf', 'doc1_backup.pdf');
    
    console.log('✓ Created files with mixed TTLs');
    
    const searchDocs = integratedStorage.searchAt(2500, 'doc');
    console.log('✓ Search "doc" at t=2500:', searchDocs.map(([n, s]) => `${n}(${s})`).join(', '));
    
    integratedStorage.rollback(1500);
    console.log('✓ Rolled back to t=1500');
    const afterRollback = integratedStorage.getAllFiles();
    console.log('✓ Files after rollback:', afterRollback.map(([n]) => n).join(', '));
    
} catch (e) {
    console.log('✗ Integration error:', e.message);
}

console.log('\n=== All Tests Complete ===');
