// 1. ARRAYS - Built-in
const arr = [1, 2, 3];
// Key methods: push(), pop(), shift(), unshift(), slice(), splice(), sort(), reverse()

// 2. STRINGS - Built-in (immutable)
const str = "hello";
// Key methods: charAt(), substring(), slice(), split(), indexOf(), replace()

// 3. OBJECTS/HASH MAPS - Built-in
const obj = { key: 'value' };

// Map - better than object when keys aren't strings
const map = new Map();
map.set('key', 'value');
map.get('key');
map.has('key');
map.delete('key');

// 4. SETS - Built-in
const set = new Set();

// 5. PRIORITY QUEUE (HEAP)

// Usage:
// const pq = new MinHeap(); // Min heap
// const maxPq = new MinHeap((a, b) => b - a); // Max heap  
// const dijkstraPq = new MinHeap((a, b) => a.dist - b.dist); // Custom objects

// 5. STACK - Use Array
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    peek() { return this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
}
// 8. LINKED LIST
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    add(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
}

// 9. BINARY TREE
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
// 11. TRIE (Prefix Tree)
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }
    
    search(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isEndOfWord;
    }
}

// 12. UNION FIND (Disjoint Set)
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill().map((_, i) => i);
        this.rank = Array(n).fill(1);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            // Union by rank
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }
}

// 13. SEGMENT TREE (for range queries)
class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n);
        this.build(arr, 0, 0, this.n - 1);
    }
    
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            this.build(arr, 2 * node + 1, start, mid);
            this.build(arr, 2 * node + 2, mid + 1, end);
            this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
        }
    }
    
    query(node, start, end, l, r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return this.tree[node];
        
        const mid = Math.floor((start + end) / 2);
        return this.query(2 * node + 1, start, mid, l, r) + 
               this.query(2 * node + 2, mid + 1, end, l, r);
    }
}


/*
Priority by frequency in LeetCode:

Essential (90% of problems):

Arrays, Strings, Objects/Maps, Sets
Stack, Queue
LinkedList, Binary Tree
Important (70% of medium/hard):

Heap/PriorityQueue
Trie
UnionFind
Advanced (30% of hard problems):

SegmentTree, Fenwick Tree
Deque for sliding window problems
Master the first 9 data structures thoroughly before moving to advanced ones!
*/

// 3. Array methods you MUST know:
const array = [1,2,3];
arr.push(4); // add to end
arr.pop(); // remove from end  
arr.shift(); // remove from front (slow O(n))
arr.unshift(0); // add to front (slow O(n))
arr.slice(1, 3); // [2, 3] - copy portion
arr.splice(1, 1); // remove 1 element at index 1

// FANCY STUFF that's actually useful:
// 1. Array.from() - create arrays
Array.from({length: 5}, (_, i) => i); // [0,1,2,3,4]
Array.from("hello"); // ['h','e','l','l','o']

// 2. Destructuring 
const [a, b] = [1, 2]; // a=1, b=2
const {x, y} = {x: 1, y: 2}; // x=1, y=2

// 3. Spread operator
const merged = [...arr1, ...arr2];
const copy = [...original];


const arrs = ['a', 'b', 'c'];
const objs = {x: 1, y: 2, z: 3};

// for...in - iterates over KEYS/INDICES
for(const key in arr) {
    console.log(key);     // "0", "1", "2" (indices as strings)
    console.log(arr[key]); // "a", "b", "c"
}

for(const key in obj) {
    console.log(key);     // "x", "y", "z" (property names)
    console.log(obj[key]); // 1, 2, 3
}

// for...of - iterates over VALUES
for(const value of arr) {
    console.log(value);   // "a", "b", "c" (actual values)
}

// for...of doesn't work on objects directly
// for(const value of obj) {} // ❌ Error!

// But works on Object.values(), Object.keys(), Object.entries()
for(const value of Object.values(obj)) {
    console.log(value);   // 1, 2, 3
}