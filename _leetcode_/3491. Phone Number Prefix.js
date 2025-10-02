/**
 * @param {string[]} numbers
 * @return {boolean}
 */

// direct sort and compare - O(n log n) time, O(1) space
var phonePrefix = function (numbers) {
    numbers.sort();
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i + 1].startsWith(numbers[i])) return false;
    }
    return true;
};

/**
 * Trie approach for phone prefix problem
 * Time Complexity: O(N*L) where N = number of phone numbers, L = average length of numbers
 * - Creating the trie: O(N*L) - we insert N numbers, each taking O(L) time
 * - Each insertion: O(L) - we traverse L characters for each number
 * Space Complexity: O(N*L) - in worst case, we store all characters of all numbers
 * 
 * @param {string[]} numbers
 * @return {boolean}
 */


// Trie approach - O(n * m) time where n = number of phone numbers, m = average length
var phonePrefix = function (numbers) {
    const trie = new Trie();
    for (const num of numbers) {
        if (!trie.insert(num)) {
            return false; // Found prefix conflict
        }
    }
    return true; // No conflicts found
};


class TrieNode {
    constructor() {
        this.children = {}; // Map of character to TrieNode
        this.endOfWord = false; // True if node represents end of a word
        this.count = 0; // Number of words sharing this prefix
        this.wordCount = 0; // Number of times a word ends here
    }
}


class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Modified insert that detects prefix conflicts
    insert(word) {
        let node = this.root;

        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];

            // If we encounter an end of word before finishing current word,
            // it means current word has a prefix that's already a complete word
            if (node.endOfWord) {
                return false; // Found prefix conflict
            }

            node.count += 1;
        }

        // If current node has children, it means there are words that have
        // current word as prefix
        if (Object.keys(node.children).length > 0) {
            return false; // Current word is prefix of existing word
        }

        node.endOfWord = true;
        node.wordCount = 1;
        return true; // No conflict
    }

    /*
    During traversal: If node.endOfWord is true before we finish inserting, it means we found a shorter number that's a prefix of our current number
    After traversal: If the final node has children, it means our current number is a prefix of some longer number
    */


    // check if any word in the trie starts with the given prefix
    /*
    search(prefix){
        let node = this.root;
        for(const char of prefix){
            if(!node.children[char]) return false;
            node = node.children[char];
        }
        return true;
    }
    */
}

// Trie better when
// Multiple queries
// autocomplete search siggestions
// scrabble
// ip routing
// spell checkers
/*
Multiple queries on same data
Need prefix-based operations (autocomplete, suggestions)
Dynamic insertions/deletions
Building word games or text processing tools
Very long strings with relatively few items*/

