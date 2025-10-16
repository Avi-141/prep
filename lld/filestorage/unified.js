/*
## Unified File Storage System
Combines all functionality from Levels 1-4:

Level 1 - Basic Operations:
- FILE_UPLOAD(file_name, size)
- FILE_GET(file_name)
- FILE_COPY(source, dest)

Level 2 - Search:
- FILE_SEARCH(prefix) - Find top 10 files by size

Level 3 - TTL Support:
- FILE_UPLOAD_AT(timestamp, file_name, file_size, ttl?)
- FILE_GET_AT(timestamp, file_name)
- FILE_COPY_AT(timestamp, file_from, file_to)
- FILE_SEARCH_AT(timestamp, prefix)

Level 4 - Rollback:
- ROLLBACK(timestamp) - Restore state with recalculated TTLs
*/

export class UnifiedFileStorage {
    constructor() {
        this.files = new Map();        // filename -> size
        this.fileTTL = new Map();      // filename -> { ttl, timestamp }
        this.history = [];             // snapshots for rollback
    }

    // ========== Level 1: Basic Operations ==========
    upload(fname, size) {
        if (this.files.has(fname)) {
            throw new Error('File already exists');
        }
        this.files.set(fname, size);
    }

    getSize(fname) {
        return this.files.has(fname) ? this.files.get(fname) : null;
    }

    copy(source, dest) {
        if (!this.files.has(source)) {
            throw new Error('File does not exist');
        }
        this.files.set(dest, this.files.get(source));
    }

    // ========== Level 2: Search ==========

    search(prefix) {
        let result = [];
        for (const [fname, size] of this.files) {
            if (fname.startsWith(prefix)) {
                result.push([fname, size]);
            }
        }
        result.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        return result.slice(0, 10);
    }

    // ========== Level 3: TTL Support ==========

    uploadAt(timestamp, fname, size, ttl = null) {
        this.upload(fname, size);
        this.fileTTL.set(fname, { ttl, timestamp });
    }

    isAlive(currentTime, fname) {
        if (!this.fileTTL.has(fname)) return null;
        const file = this.fileTTL.get(fname);
        if (file.ttl === null) return true; // Infinite lifetime
        return (currentTime - file.timestamp) <= file.ttl;
    }

    getAt(timestamp, fname) {
        const size = this.getSize(fname);
        if (size === null) return null;
        if (!this.isAlive(timestamp, fname)) return null;
        return size;
    }


    copyAt(timestamp, source, dest) {
        if (!this.isAlive(timestamp, source)) {
            throw new Error('File does not exist or expired');
        }
        this.copy(source, dest);
        const fileMeta = this.fileTTL.get(source);
        this.fileTTL.set(dest, { ...fileMeta });
    }

    searchAt(timestamp, prefix) {
        const results = this.search(prefix);
        return results.filter(([fname]) => this.isAlive(timestamp, fname));
    }

    // ========== Level 4: Rollback ==========

    snapshot(timestamp) {
        const filesCopy = new Map(this.files);
        const ttlCopy = new Map(this.fileTTL);
        this.history.push({ timestamp, files: filesCopy, fileTTL: ttlCopy });
    }

    /**
     * Rollback to state at given timestamp
     * Recalculates all TTLs accordingly
     * @throws Error if no snapshot available
     */
    rollback(timestamp) {
        // Find the latest snapshot before or at the given timestamp
        let snapshot = null;
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].timestamp <= timestamp) {
                snapshot = this.history[i];
                break;
            }
        }

        if (!snapshot) {
            throw new Error('No snapshot available for the given timestamp');
        }

        // Restore state
        this.files = new Map(snapshot.files);
        this.fileTTL = new Map();

        // Recalculate TTLs based on the rollback timestamp
        for (const [fname, meta] of snapshot.fileTTL) {
            const { ttl, timestamp: createdAt } = meta;
            if (ttl === null) {
                // Infinite lifetime
                this.fileTTL.set(fname, { ttl: null, timestamp: createdAt });
            } else {
                const elapsed = timestamp - createdAt;
                const remainingTTL = ttl - elapsed;
                if (remainingTTL > 0) {
                    this.fileTTL.set(fname, { ttl: remainingTTL, timestamp: createdAt });
                }
            }
        }
    }

    // ========== Enhanced Methods with Auto-Snapshot ==========

    /**
     * Upload with automatic snapshot for rollback
     */
    uploadAtWithSnapshot(timestamp, fname, size, ttl = null) {
        this.uploadAt(timestamp, fname, size, ttl);
        this.snapshot(timestamp);
    }

    /**
     * Copy with automatic snapshot for rollback
     */
    copyAtWithSnapshot(timestamp, source, dest) {
        this.copyAt(timestamp, source, dest);
        this.snapshot(timestamp);
    }

    // ========== Utility Methods ==========

    /**
     * Get all files (for debugging/inspection)
     */
    getAllFiles() {
        return Array.from(this.files.entries());
    }

    /**
     * Get snapshot history
     */
    getHistory() {
        return this.history.map(h => ({ 
            timestamp: h.timestamp, 
            fileCount: h.files.size 
        }));
    }

    /**
     * Clear all data
     */
    clear() {
        this.files.clear();
        this.fileTTL.clear();
        this.history = [];
    }
}
