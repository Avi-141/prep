/*


FILE_UPLOAD(file_name, size)
Upload the file to the remote storage server.
If a file with the same name already exists on the server, it throws a runtime exception.
FILE_GET(file_name)
Returns the size of the file, or nothing if the file doesn’t exist.
FILE_COPY(source, dest)
Copy the source file to a new location.
If the source file doesn’t exist, it throws a runtime exception.
If the destination file already exists, it overwrites the existing file.

*/


export class FileStorage{
    constructor(){
        this.files = new Map();
    }

    upload(fname, size){
       if(this.files.has(fname)){
        throw new Error('File already exists');
       }
       this.files.set(fname, size)
    }

    getSize(fname){
        return this.files.has(fname) ? this.files.get(fname) : null
    }

    copy(source, dest){
        if(!this.files.has(source)) throw new Error('File does not exist');
        this.files.set(dest, this.files.get(source));
        
    }

}