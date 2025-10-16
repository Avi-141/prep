import { FileStorage } from "./level1.js";
import { FileSearch } from "./level2.js";
import { FileStorageWithTTL } from "./level3.js";

// Helper function to convert timestamp string to milliseconds
function parseTimestamp(timestampStr) {
    return new Date(timestampStr).getTime();
}

// Helper function to convert size string to number (e.g., "200kb" -> 200)
function parseSize(sizeStr) {
    return parseInt(sizeStr);
}

console.log("=== Testing Level 1: FileStorage ===\n");

const test_data_1 = [
    ["FILE_UPLOAD", "Cars.txt", "200kb"],
    ["FILE_GET", "Cars.txt"],
    ["FILE_COPY", "Cars.txt", "Cars2.txt"],
    ["FILE_GET", "Cars2.txt"]
];

const fileStorage = new FileStorage();

test_data_1.forEach((command, index) => {
    const [operation, ...args] = command;
    console.log(`Test ${index + 1}: ${operation}(${args.join(", ")})`);
    
    try {
        let result;
        switch(operation) {
            case "FILE_UPLOAD":
                fileStorage.upload(args[0], parseSize(args[1]));
                result = "File uploaded successfully";
                break;
            case "FILE_GET":
                result = fileStorage.getSize(args[0]);
                break;
            case "FILE_COPY":
                fileStorage.copy(args[0], args[1]);
                result = "File copied successfully";
                break;
        }
        console.log(`Result: ${result}\n`);
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
    }
});

console.log("=== Testing Level 2: FileSearch ===\n");

const test_data_2 = [
    ["FILE_UPLOAD", "Foo.txt", "100kb"],
    ["FILE_UPLOAD", "Bar.csv", "200kb"],
    ["FILE_UPLOAD", "Baz.pdf", "300kb"],
    ["FILE_SEARCH", "Ba"]
];

const fileSearch = new FileSearch();

test_data_2.forEach((command, index) => {
    const [operation, ...args] = command;
    console.log(`Test ${index + 1}: ${operation}(${args.join(", ")})`);
    
    try {
        let result;
        switch(operation) {
            case "FILE_UPLOAD":
                fileSearch.upload(args[0], parseSize(args[1]));
                result = "File uploaded successfully";
                break;
            case "FILE_SEARCH":
                result = fileSearch.search(args[0]);
                result = JSON.stringify(result);
                break;
        }
        console.log(`Result: ${result}\n`);
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
    }
});

console.log("=== Testing Level 3: FileStorageWithTTL ===\n");

const test_data_3 = [
    ["FILE_UPLOAD_AT", "2021-07-01T12:00:00", "Python.txt", "150kb"],
    ["FILE_UPLOAD_AT", "2021-07-01T12:00:00", "CodeSignal.txt", "150kb", 3600],
    ["FILE_GET_AT", "2021-07-01T13:00:01", "Python.txt"],
    ["FILE_COPY_AT", "2021-07-01T12:00:00", "Python.txt", "PythonCopy.txt"],
    ["FILE_SEARCH_AT", "2021-07-01T12:00:00", "Py"],
    ["FILE_UPLOAD_AT", "2021-07-01T12:00:00", "Expired.txt", "100kb", 1],
    ["FILE_GET_AT", "2021-07-01T12:00:02", "Expired.txt"],
    ["FILE_COPY_AT", "2021-07-01T12:00:00", "CodeSignal.txt", "CodeSignalCopy.txt"],
    ["FILE_SEARCH_AT", "2021-07-01T12:00:00", "Code"]
];

const fileStorageWithTTL = new FileStorageWithTTL();

test_data_3.forEach((command, index) => {
    const [operation, ...args] = command;
    console.log(`Test ${index + 1}: ${operation}(${args.join(", ")})`);
    
    try {
        let result;
        switch(operation) {
            case "FILE_UPLOAD_AT":
                const timestamp = parseTimestamp(args[0]);
                const filename = args[1];
                const size = parseSize(args[2]);
                const ttl = args[3] ? parseInt(args[3]) : null;
                fileStorageWithTTL.uploadAt(timestamp, filename, size, ttl);
                result = "File uploaded successfully";
                break;
            case "FILE_GET_AT":
                result = fileStorageWithTTL.getAt(parseTimestamp(args[0]), args[1]);
                break;
            case "FILE_COPY_AT":
                fileStorageWithTTL.copyAt(parseTimestamp(args[0]), args[2], args[1]);
                result = "File copied successfully";
                break;
            case "FILE_SEARCH_AT":
                result = fileStorageWithTTL.searchAt(parseTimestamp(args[0]), args[1]);
                result = JSON.stringify(result);
                break;
        }
        console.log(`Result: ${result}\n`);
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
    }
});

console.log("=== All Tests Completed ===");
