class CloudStorage{
    constructor(){
        this.storage = new Map();
        this.users = new Map() // userid, capacity, fname
        // Initialize admin user with unlimited capacity
        this.users.set('admin', { capacity: Infinity, files: new Set() });
    }

    addFile(fname, size){
        if(this.storage.has(fname)) return "false";
        this.storage.set(fname, size);
        // Files added via ADD_FILE are owned by admin
        this.users.get('admin').files.add(fname);
        return "true";
    }

    getFSize(fname){
        if(!this.storage.has(fname)) return '';
        return `${this.storage.get(fname)}`;
    }

    deleteFile(fname){
        if(!this.storage.has(fname)) return '';
        const fsize = this.storage.get(fname);
        this.storage.delete(fname);
        
        // Remove from all users who own this file
        for(const [userid, user] of this.users){
            user.files.delete(fname);
        }
        
        return `${fsize}`;
    }

    listFiles(){
        return Array.from(this.storage.keys());
    }

    getNLargest(prefix, n){
        const result = [];
        for(let [fname, size] of this.storage){
            if(fname.startsWith(prefix)){
                result.push([fname, size])
            }
        }
        
        if(result.length === 0) return '';
    
        // sort by size desc, name lexicographically asc
        result.sort((f1, f2) => f2[1] - f1[1] || f1[0].localeCompare(f2[0]));        
        const topN = result.slice(0, n);
        
        //"‹name1›(<size1>), ..., <nameN> (<sizeN>)"
        return topN.map(([name, size]) => `${name}(${size})`).join(', ');
    }

    addUser(userid, capacity){
        if(this.users.has(userid)) return "false";
        this.users.set(userid, { capacity, files: new Set() });
        return "true";
    }

    addFileBy(userid, fname, size){
        if(!this.users.has(userid)) return '';
        if(this.storage.has(fname)) return '';

        const user = this.users.get(userid);
        
        // Calculate current capacity used
        let currCapacityUsed = 0;
        for(const f of user.files){
            currCapacityUsed += this.storage.get(f);
        }
        // Check if adding this file would exceed capacity
        if(currCapacityUsed + size > user.capacity) return '';

        this.storage.set(fname, size);
        
        // Add file ownership to user
        user.files.add(fname);

        return `${user.capacity - (currCapacityUsed + size)}`;
    }

    mergeUser(userid1, userid2){
        // Check if users are the same
        if(userid1 === userid2) return '';
        
        // Check if both users exist
        if(!this.users.has(userid1) || !this.users.has(userid2)) return '';

        const user1 = this.users.get(userid1);
        const user2 = this.users.get(userid2); 

        for(const f of user2.files){
            user1.files.add(f);
        }

        user1.capacity += user2.capacity;
        this.users.delete(userid2);

        // Calculate total size of all files owned by user1
        let totalUsed = 0;
        for(const f of user1.files){
            totalUsed += this.storage.get(f);
        }

        // Return remaining capacity of user1
        return `${user1.capacity - totalUsed}`;
    }


}