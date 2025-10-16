/*
## Level 2 – Data Structures & Data Processing
FILE_SEARCH(prefix)
Find top 10 files starting with the provided prefix. Order results by their size in descending order, and in case of a tie by file name.

*/

import { FileStorage } from "./level1.js";

export class FileSearch extends FileStorage {
    constructor(){
        super();
    }

    search(prefix){
        let result = [];
        for(const [fname, size] of this.files){
            if(fname.startsWith(prefix)){
                result.push([fname, size])
            }
        }
        result.sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        return result.slice(0, 10);
    }
}