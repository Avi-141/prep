/*

## Level 4 – Extending Design & Functionality
ROLLBACK(timestamp)
Rollback the state of the file storage to the state specified in the timestamp.
All ttls should be recalculated accordingly.
*/

import { FileStorageWithTTL } from "./level3.js";

class FileStorageWithRollback extends FileStorageWithTTL {
    constructor(){
        super();
        this.history = []; // To store snapshots of the state
    }

    snapshot(timestamp) {
        // Create a deep copy of current state
        const filesCopy = new Map(this.files);
        const ttlCopy = new Map(this.fileTTL);
        this.history.push({ timestamp, files: filesCopy, fileTTL: ttlCopy });
    }

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

    // Override uploadAt to take snapshot
    uploadAt(timestamp, fname, size, ttl = null){
        super.uploadAt(timestamp, fname, size, ttl);
        this.snapshot(timestamp);
    }

    // Override copyAt to take snapshot
    copyAt(timestamp, fileTo, fileFrom){
        super.copyAt(timestamp, fileTo, fileFrom);
        this.snapshot(timestamp);
    }
}