/*
The general pattern to look for is: "Does this problem involve grouping things together based on connections or equivalence?" If so, DSU should be on your mind.

---

### Category 1: Classic Connectivity (Graph & Grid Problems)

These are the most direct applications, similar to "Number of Islands".

#### 1. [LeetCode 547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/)
*   **The Core Idea:** You are given an adjacency matrix representing cities that are connected. A "province" is a group of directly or indirectly connected cities. You need to count the number of provinces.
*   **Why DSU Fits:** This is the quintessential "connected components" problem. Each province is a disjoint set.
*   **DSU Strategy:**
    *   **Elements:** The cities, indexed `0` to `n-1`.
    *   **Union Trigger:** Iterate through the adjacency matrix. If `isConnected[i][j] == 1`, it means there's a connection. Perform `union(i, j)`.
    *   **Answer:** The final number of unique roots in your DSU is the number of provinces.

#### 2. [LeetCode 684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
*   **The Core Idea:** You are given a list of edges that form a tree, plus one extra edge. This extra edge creates a cycle. Find and return that extra edge.
*   **Why DSU Fits:** This is the classic "cycle detection" application of DSU. An edge is redundant if it tries to connect two nodes that are *already* connected.
*   **DSU Strategy:**
    *   **Elements:** The nodes of the graph, `1` to `n`.
    *   **Union Trigger:** Process the edges one by one. For each edge `(u, v)`:
        1.  Check if `find(u) == find(v)`.
        2.  If they are already in the same set, this edge is redundant because it connects an already-connected component. Return this edge.
        3.  Otherwise, they are in different sets, so perform `union(u, v)`.

---

### Category 2: Equivalence & Grouping

These problems use DSU to group items based on equivalence relationships.

#### 3. [LeetCode 990. Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)
*   **The Core Idea:** You are given equations like `a==b` and `x!=y`. Determine if all equations can be simultaneously true.
*   **Why DSU Fits:** The `==` relationship is an equivalence relation. If `a==b` and `b==c`, then `a==c`. DSU is perfectly designed to model these transitive relationships.
*   **DSU Strategy:**
    *   **Elements:** The variables (`'a'` through `'z'`).
    *   **First Pass (Unions):** Iterate through all `==` equations. For each `a==b`, perform `union(a, b)`. This groups all equal variables into the same sets.
    *   **Second Pass (Checks):** Iterate through all `!=` equations. For each `x!=y`, check if `find(x) == find(y)`. If they are in the same set, it's a contradiction. Return `false`.
    *   **Answer:** If you get through the second pass without finding a contradiction, return `true`.

#### 4. [LeetCode 721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)
*   **The Core Idea:** You are given a list of accounts, each with a name and some emails. If two accounts share even one email, they belong to the same person. Merge all accounts for the same person.
*   **Why DSU Fits:** This is a grouping problem. The "connection" between two accounts is a shared email.
*   **DSU Strategy:**
    *   **Elements:** The accounts themselves, indexed `0` to `n-1`.
    *   **Union Trigger:** Create a map from `email -> account_index`. Iterate through all emails in all accounts. For each email, if it's already in the map, it means you've found a shared email. `union` the current account index with the account index stored in the map. Otherwise, add the email to the map.
    *   **Answer:** After building the DSU, create a new map from `root -> list_of_emails`. Iterate through all accounts, find the root for each account, and add all its emails to the list corresponding to that root. Finally, format the output.

---

### Category 3: Advanced Applications (DSU as a building block)

These problems use DSU as a key component in a more complex algorithm.

#### 5. [LeetCode 1202. Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps/)
*   **The Core Idea:** You can swap characters in a string at given pairs of indices. Find the lexicographically smallest string you can create.
*   **Why DSU Fits:** The swappable pairs define connected components. Any character within a component can be moved to any index within that same component. Therefore, you can sort the characters within each component independently.
*   **DSU Strategy:**
    *   **Elements:** The indices of the string, `0` to `n-1`.
    *   **Union Trigger:** For each allowed swap pair `(i, j)`, perform `union(i, j)`.
    *   **Answer:** After building the sets, create a map `root -> list_of_characters` and `root -> list_of_indices`. Iterate through the string, find the root for each index `i`, and add `string[i]` to the character list and `i` to the index list for that root. Then, for each root, sort its character list and its index list. Finally, build the result string by placing the sorted characters at the sorted indices.

#### 6. [LeetCode 1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
*   **The Core Idea:** Given a set of points, find the minimum cost to connect all of them, where the cost between two points is their Manhattan distance.
*   **Why DSU Fits:** This is a classic Minimum Spanning Tree (MST) problem. Kruskal's algorithm for MST is a perfect use case for DSU, which provides the necessary fast cycle detection.
*   **DSU Strategy:**
    *   **Elements:** The points, indexed `0` to `n-1`.
    *   **Algorithm (Kruskal's):**
        1.  Create a list of all possible "edges" between every pair of points, with the Manhattan distance as the weight.
        2.  Sort these edges by weight in ascending order.
        3.  Iterate through the sorted edges `(u, v)`. If `find(u) != find(v)`, this edge doesn't create a cycle. Add its cost to your total and perform `union(u, v)`.
    *   **Answer:** The final accumulated cost is the minimum cost.


*/


class DSU {
    constructor(n = 0){
        this.parent = new Array(n)
        this.init(n)
        this.size = Array(n).fill(1) // union by size..
    }

    init(n){
        for(let i=0;i<n;i++){
          this.parent[i] = i
        }
    }

   find(x){
        if (this.parent[x] === x) return x;
        return this.parent[x] = this.find(this.parent[x]); 
        // path compression
    }

    uniteBySize(x, y){
        const rootX = find(x);
        const rootY = find(y);
        if(rootX === rootY) return;
        if(this.size[rootX] < this.size[rootY]) {
            // swap
            [rootX, rootY] = [rootY, rootX]
        }
        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
        return true;
    }

    // simple union that makes y's root the parent of x's root
    uniteByParent(x, y){
         const rootX = find(x);
        const rootY = find(y);
        if(rootX === rootY) return;
        if(rootX !== rootY){
            this.parent[rootX] = rootY
            this.size[rootX] +=this.size[rootY]
        }
    }

    areConnected(x,y){
        return this.find(x) === this.find(y)
    }

    countComponents(n){
        const roots = new Set()
        for(let i = 0; i < n; i++){
            roots.add(this.find(i))
        }
        return roots.size
    }
}