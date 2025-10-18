/**
 * Trie Node class
 */
class TrieNode {
    constructor() {
        this.children = {}; // Map of character -> TrieNode
        this.isEndOfWord = false; // Marks end of a word
        this.count = 0; // Number of words that pass through this node (useful for prefix counting)
        this.wordCount = 0; // Number of times this exact word was inserted (for duplicate handling)
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Insert a word into the trie
     * @param {string} word - The word to insert
     * @return {boolean} - True if word was successfully inserted, false if it already existed
     */
    insert(word) {
        let node = this.root;
        
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            // move to next node.
            node = node.children[char];
            node.count++; // Increment count for prefix operations
        }
        
        if (node.isEndOfWord) {
            node.wordCount++;
            return false; // Word already existed
        }
    
        // word inserted for the first time
        node.isEndOfWord = true;
        node.wordCount = 1;
        return true;
    }

    /**
     * Search for a word in the trie
     * @param {string} word - The word to search for
     * @return {boolean} - True if word exists, false otherwise
     */
    search(word) {
        let node = this.root;
        
        for (const char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        
        return node.isEndOfWord;
    }

    /**
     * Check if any word in the trie starts with the given prefix
     * @param {string} prefix - The prefix to search for
     * @return {boolean} - True if prefix exists, false otherwise
     */
    startsWith(prefix) {
        let node = this.root;
        
        for (const char of prefix) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        
        return true;
    }

    /**
     * Delete a word from the trie
     * @param {string} word - The word to delete
     * @return {boolean} - True if word was deleted, false if it didn't exist
     */
    delete(word) {
        const deleteHelper = (node, word, index) => {
            if (index === word.length) {
                if (!node.isEndOfWord) return false;
                node.isEndOfWord = false;
                node.wordCount = 0;
                
                // Decrease count for all nodes in the path
                let tempNode = this.root;
                for (let i = 0; i < word.length; i++) {
                    tempNode = tempNode.children[word[i]];
                    tempNode.count--;
                }
                
                return Object.keys(node.children).length === 0;
            }
            
            const char = word[index];
            const childNode = node.children[char];
            
            if (!childNode) return false;
            
            const shouldDeleteChild = deleteHelper(childNode, word, index + 1);
            
            if (shouldDeleteChild) {
                delete node.children[char];
                return !node.isEndOfWord && Object.keys(node.children).length === 0;
            }
            
            return false;
        };
        
        return deleteHelper(this.root, word, 0);
    }

    /**
     * Get all words with the given prefix
     * @param {string} prefix - The prefix to search for
     * @return {string[]} - Array of all words with the given prefix
     */
    getWordsWithPrefix(prefix) {
        let node = this.root;
        
        // Navigate to the prefix node
        for (const char of prefix) {
            if (!node.children[char]) {
                // there is no word with given prefix
                return [];
            }
            node = node.children[char];
        }
        
        const result = [];
        
        const dfs = (node, currentWord) => {
            if (node.isEndOfWord) {
                result.push(currentWord);
            }
            
            // children has the character and the corresponding child node
            for (const [char, childNode] of Object.entries(node.children)) {
                dfs(childNode, currentWord + char);
            }
        };
        
        dfs(node, prefix);
        return result;
    }

    /**
     * Count how many words start with the given prefix
     * @param {string} prefix - The prefix to count
     * @return {number} - Number of words with the given prefix
     */
    countWordsWithPrefix(prefix) {
        let node = this.root;
        
        for (const char of prefix) {
            if (!node.children[char]) {
                return 0;
            }
            node = node.children[char];
        }
        
        return node.count;
    }

    /**
     * Find the longest common prefix of all words in the trie
     * @return {string} - The longest common prefix
     */
    longestCommonPrefix() {
        let node = this.root;
        let prefix = '';
        
        while (Object.keys(node.children).length === 1 && !node.isEndOfWord) {
            const char = Object.keys(node.children)[0];
            prefix += char;
            node = node.children[char];
        }
        
        return prefix;
    }

    /**
     * Check if the trie is empty
     * @return {boolean} - True if trie is empty, false otherwise
     */
    isEmpty() {
        return Object.keys(this.root.children).length === 0;
    }

    /**
     * Get all words in the trie
     * @return {string[]} - Array of all words in the trie
     */
    getAllWords() {
        return this.getWordsWithPrefix('');
    }

    /**
     * Find if there's any word that is a prefix of another word
     * Used for problems like "Phone Directory" where no number should be prefix of another
     * @param {string[]} words - Array of words to check
     * @return {boolean} - True if any word is prefix of another, false otherwise
     */

    /*
        Static Methods (hasPrefix)
        Called on the class itself, not on an instance
        Don't access instance data .. they can't use this
        Often utility functions that are related to the class but don't need existing data
        Syntax: Trie.hasPrefix(words) - notice we call it on Trie, not trie
        It creates its own Trie internally - it doesn't need an existing Trie instance
        It's a utility function - it solves a specific problem (checking if any word is a prefix of another)
        It's self-contained - it takes input, processes it, and returns a result without needing external state
    */
    static hasPrefix(words) {
        const trie = new Trie();
        
        for (const word of words) {
            let node = trie.root;
            
            for (const char of word) {
                if (!node.children[char]) {
                    node.children[char] = new TrieNode();
                }
                node = node.children[char];
                
                // If we encounter an end of word before finishing current word,
                // it means current word has a prefix that's already a complete word
                if (node.isEndOfWord) {
                    return true;
                }
            }
            
            // If current node has children, it means there are words that have
            // current word as prefix
            if (Object.keys(node.children).length > 0) {
                return true;
            }
            
            node.isEndOfWord = true;
        }
        
        return false;
    }

    /**
     * Wildcard search - search for words matching pattern with '.' as wildcard
     * @param {string} pattern - Pattern to search (. matches any character)
     * @return {boolean} - True if any word matches the pattern
     */
    searchWithWildcard(pattern) {
        const dfs = (node, index) => {
            if (index === pattern.length) {
                return node.isEndOfWord;
            }
            
            const char = pattern[index];
            
            if (char === '.') {
                for (const childNode of Object.values(node.children)) {
                    if (dfs(childNode, index + 1)) {
                        return true;
                    }
                }
                return false;
            } else {
                if (!node.children[char]) {
                    return false;
                }
                return dfs(node.children[char], index + 1);
            }
        };
        
        return dfs(this.root, 0);
    }
}

// Example usage and test cases
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Trie, TrieNode };
}

// Example usage:
/*
const trie = new Trie();

// Insert words
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("apply");

// Search
console.log(trie.search("app")); // true
console.log(trie.search("appl")); // false

// Check prefix
console.log(trie.startsWith("app")); // true
console.log(trie.startsWith("xyz")); // false

// Get words with prefix
console.log(trie.getWordsWithPrefix("app")); // ["app", "apple", "application", "apply"]

// Count words with prefix
console.log(trie.countWordsWithPrefix("app")); // 4

// Wildcard search
console.log(trie.searchWithWildcard("a..le")); // true (matches "apple")

// Phone prefix problem
const phoneNumbers = ["123", "12345", "567"];
console.log(Trie.hasPrefix(phoneNumbers)); // true (123 is prefix of 12345)
*/


/*
Advanced operations:
getWordsWithPrefix() - Get all words starting with a prefix
countWordsWithPrefix() - Count words with a prefix
longestCommonPrefix() - Find longest common prefix of all words
searchWithWildcard() - Search with '.' as wildcard character
hasPrefix() static method - Solves the phone number prefix problem (checks if any string is prefix of another)
Count tracking - Each node tracks how many words pass through it
Word count tracking - Handles duplicate insertions
*/