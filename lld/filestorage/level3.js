/*
## Level 3 – Refactoring & Encapsulation

Files now might have a specified time to live on the server.
Implement extensions of existing methods which inherit all functionality but also with an additional parameter to include a timestamp for the operation, and new files might specify the time to live - no ttl means lifetime being infinite.

FILE_UPLOAD_AT(timestamp, file_name, file_size)
FILE_UPLOAD_AT(timestamp, file_name, file_size, ttl)
The uploaded file is available for ttl seconds.
FILE_GET_AT(timestamp, file_name)
FILE_COPY_AT(timestamp, file_from, file_to)
FILE_SEARCH_AT(timestamp, prefix)
Results should only include files that are still "alive".
*/

import { FileSearch } from "./level2.js";

class FileStorageWithTTL extends FileSearch {
    constructor(){
        super();
        this.fileTTL = new Map(); // ttl for files
    }

    uploadAt(timestamp, fname, size, ttl = null){
       super.upload(fname, size)
        this.fileTTL.set(fname, { ttl, timestamp });
    }

    isAlive(currentTime, fname){
        if(!this.fileTTL.has(fname)) return null;
        const file = this.fileTTL.get(fname);
        if(file.ttl === null) return true; // Infinity.. older files
        return (currentTime - file.timestamp) <= file.ttl;
    }

    getAt(timestamp, fname){
        const size = super.getSize(fname);
        if(size === null) return null;
        if(!this.isAlive(timestamp,fname)) return null;
        return size;
    }

    copyAt(timestamp, fileTo, fileFrom){
        if(!this.isAlive(timestamp, fileFrom)) throw new Error('File does not exist or expired');
        super.copy(fileFrom, fileTo);
        const fileMeta = this.fileTTL.get(fileFrom);
        this.fileTTL.set(fileTo, { ...fileMeta }); // copy ttl info as well

    }

    searchAt(timestamp, prefix){
        const results = super.search(prefix); 
        // Filter out expired files
        return results.filter(([fname]) => this.isAlive(timestamp, fname));
    }
}

export { FileStorageWithTTL };