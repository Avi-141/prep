/*

https://leetcode.com/problems/maximum-students-taking-exam/solutions/3505825/c-all-solutions-you-need-max-flow-max-ma-1utd/
https://leetcode.com/problems/maximum-students-taking-exam/solutions/3878662/wo-bitmasking-easy-to-understand-by-yadi-68ak/
https://leetcode.com/problems/maximum-students-taking-exam/solutions/503433/python-dfs-with-memorization-by-merciles-ylz9/

https://leetcode.com/problems/maximum-students-taking-exam/solutions/1460292/Python-oror-Ford-Fulkerson-with-DFS-oror-high-level-explanation/

https://leetcode.com/problems/maximum-students-taking-exam/solutions/2475512/ford-fulkerson-max-flow-max-matching-min-mpg8/
https://leetcode.com/problems/maximum-students-taking-exam/solutions/503790/python-hungarian-time-om2n2-space-omn-be-uhlp/

https://algo.monster/liteproblems/1349

https://youtu.be/Sal6kHewGcM
minimum vertex cover = maximum matching and how to find it. 

If we have the min vertex cover and remove all such vertices from our graph, then by definition there should be no edge remaining in the leftover graph, i.e. we can select all remaining vertices. 
Now our answer should be max(n + m - v, v) but as v cannot be greater than min(n, m). 
Our answer becomes n + m - v
=============



TLE Code as i bruted through all subsets.

I modelled it as a max independent set problem
But it turnde out that in worse case we can have 2^v subsets where v is set of all good seats
And if all seats in 8*8 grid are good, we dead.
2^64 yeeted..


function maxStudents(seats) {
    const m = seats.length;
    const n = seats[0].length;
    
    // Extract all good seats (vertices in graph)
    const goodSeats = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (seats[i][j] === '.') {
                goodSeats.push([i, j]);
            }
        }
    }
    
    const V = goodSeats.length;
    // console.log(`Found ${V} good seats`);
    
    // if two seats can see each othr
    function conflicts(seat1, seat2) {
        const [i1, j1] = seat1;
        const [i2, j2] = seat2;
        
        const di = Math.abs(i1 - i2);
        const dj = Math.abs(j1 - j2);
        
        // Students can see each other if:
        // Horizontally adjacent (same row, adjacent columns)
        if (di === 0 && dj === 1) return true;
        
        // Diagonally adjacent (adjacent rows, adjacent columns)
        if (di === 1 && dj === 1) return true;
        
        // Vertically adjacent (di === 1 && dj === 0) is OK
        return false;
    }
    
    // try all 2^V subsets
    let maxStudentsCount = 0;
    let bestArrangement = [];
    
    // Iterate through all possible subsets using bitmask
    for (let mask = 0; mask < (1 << V); mask++) {
        // Extract seats selected in current subset
        const selectedSeats = [];
        for (let i = 0; i < V; i++) {
            if (mask & (1 << i)) {
                selectedSeats.push(goodSeats[i]);
            }
        }
        
        // Check if this subset forms a valid independent set
        let isValid = true;
        for (let i = 0; i < selectedSeats.length && isValid; i++) {
            for (let j = i + 1; j < selectedSeats.length && isValid; j++) {
                if (conflicts(selectedSeats[i], selectedSeats[j])) {
                    isValid = false;
                }
            }
        }
        
        // Update maximum if this is a valid and larger independent set
        if (isValid && selectedSeats.length > maxStudentsCount) {
            maxStudentsCount = selectedSeats.length;
            bestArrangement = [...selectedSeats];
        }
    }
    
    //console.log(`Maximum students: ${maxStudentsCount}`);
    //console.log(`Best arrangement: ${JSON.stringify(bestArrangement)}`);
    
    return maxStudentsCount;
}
*/



// DFS with memoization... using bitmasking as well..
// Inspired by Algo monster... what a solution man..

/**
 * Key Innovation: The 'availableSeats' parameter in DFS encodes BOTH:
 * 1. Which seats are broken/good (from original grid)
 * 2. Which seats are blocked by diagonal conflicts (from previous row)
 * This elegant encoding eliminates the need for explicit diagonal checks
 */

function maxStudents(seats) {
    const m = seats.length;    // number of rows
    const n = seats[0].length; // number of columns
    // convert rows to bitmasks.. 
    /**
     * Convert a row of seats into a bitmask
     * If seat[j] is available ('.'), bit j is set to 1
     * If seat[j] is broken ('#'), bit j is set to 0
     * 
     * Example: ['.', '#', '.'] -> 0b101 = 5
     */
    function rowToBitmask(row) {
        let mask = 0;
        for (let col = 0; col < n; col++) {
            if (row[col] === '.') {
                mask |= (1 << col);
            }
        }
        return mask;
    }
    
    // Convert all rows to bitmask representation
    const rowMasks = seats.map(rowToBitmask);
    // const rowMasks = [];
    // for (let i = 0; i < seats.length; i++) rowMasks.push(rowToBitmask(seats[i]));
    // console.log("Row bitmasks:", rowMasks.map(m => m.toString(2).padStart(n, '0')));

    
    /**
     * Memoization table: memo[availableSeats][rowIndex]
     * Stores the maximum students from row 'rowIndex' to end
     * given 'availableSeats' configuration
     */
    const memo = new Map();
    
    function getMemoKey(availableSeats, rowIndex) {
        return `${availableSeats}-${rowIndex}`;
    }
    
    /**
     * Count number of set bits in a number (number of students in a row)
     */
    function popcount(num) {
        let count = 0;
        while (num) {
            count += num & 1;
            num >>= 1;
        }
        return count;
    }
    
    /**
     * DFS function to find maximum students from current row onwards
     * 
     * @param {number} availableSeats - Bitmask of available seats in current row (encodes both broken seats AND diagonal conflicts)
     * @param {number} rowIndex - Current row being processed
     * @returns {number} Maximum students that can be seated from this row to end
     * 
     * IMPORTAnt: 'availableSeats' already accounts for diagonal conflicts,
     * so we only need to check:
     * 1. Students sit in available seats (mask is subset of availableSeats)
     * 2. No adjacent students in same row (no consecutive 1s in mask)
     */
    function dfs(availableSeats, rowIndex) {
        // Base case: all rows over
        if (rowIndex >= m) {
            return 0;
        }
        
        // Check memoization, if already calculated..
        const memoKey = getMemoKey(availableSeats, rowIndex);
        if (memo.has(memoKey)) {
            return memo.get(memoKey);
        }
        
        let maxStudentsFromHere = 0;
        // Try all possible student arrangements for current row
        for (let mask = 0; mask < (1 << n); mask++) {
            
            // Subset Check
            // Students can only sit in available seats
            // mask must be a subset of availableSeats
            // (availableSeats | mask) should equal availableSeats
            // If mask has any bit not in availableSeats, OR bitwise will add new bits
            if ((availableSeats | mask) !== availableSeats) {
                continue;
            }
            
            // No Adjacent Students
            // Check if any two students are sitting next to each other
            // If mask = 0b0110 (students at positions 1 and 2):
            //   mask >> 1 = 0b0011
            //   mask & (mask >> 1) = 0b0110 & 0b0011 = 0b0010 (non-zero)
            if ((mask & (mask << 1)) !== 0) {
                continue;
            }
            
            // Count students in current row
            const studentsInCurrentRow = popcount(mask);
            if (rowIndex === m - 1) {
                // Last Row
                // Just count students in this row
                maxStudentsFromHere = Math.max(maxStudentsFromHere, studentsInCurrentRow);
            } else {
                //  Not Last Row , so recurse
                // Calculate available seats for NEXT row
                // Start with next row's broken/available seats
                let nextAvailable = rowMasks[rowIndex + 1];
                
                // Remove seats that would be diagonally adjacent to current students
                // Remove upper-left diagonal conflicts:
                // If current row has student at position j, 
                // next row can't have student at position j-1
                // So we shift mask left and remove those positions
                nextAvailable &= ~(mask << 1);
                
                // Remove upper-right diagonal conflicts:
                // If current row has student at position j,
                // next row can't have student at position j+1
                // So we shift mask right and remove those positions
                nextAvailable &= ~(mask >> 1);
                
                // Recurse with updated availability (diagonal conflicts encoded!)
                const studentsFromNextRows = dfs(nextAvailable, rowIndex + 1);
                maxStudentsFromHere = Math.max( maxStudentsFromHere, studentsInCurrentRow + studentsFromNextRows);
            }
        }
        
        memo.set(memoKey, maxStudentsFromHere);
        return maxStudentsFromHere;
    }
    
    // START DFS FROM FIRST ROW    
    // console.log("\n=== Starting DFS ===");
    const result = dfs(rowMasks[0], 0);
    //console.log(`\nMemoization table size: ${memo.size} states`);
    
    return result;
}


// Ford Fulkerson Algorithm : Bipartite graph based on column even odd split
// Min vertex cover logic: What's the minimum number of seats we need to block so that no two remaining seats can see each other?
// Findin min vertex cover or in this case as its bipartite, find max matching (Konigs theorem)
// Max independent set i.e student seating = total verticies - max matching = total vertices - min vertex cover

/*
SET A (boys):     SET B (girls):
  Alex              Emma
  Ben               Fiona
  Chris             Grace

Compatibility (edges):
  Alex - Emma
  Alex - Fiona
  Ben - Emma
  Ben - Grace
  Chris - Grace

Maximum Matching = "Maximum number of couples"
One solution: {Alex-Emma, Ben-Grace} - size 2
Another solution: {Alex-Fiona, Ben-Emma} - size 2

We can't do better than 2 because Chris only likes Grace,
and if Chris-Grace match, Ben can't match with Grace.


========

Grid: [.][.][.]  → SET A: (0,0), (0,2), (1,0), (1,2)  [even cols]
      [.][.][.]  → SET B: (0,1), (1,1)                [odd cols]

Conflicts (edges):
  (0,0)-(0,1)
  (0,0)-(1,1)
  (0,2)-(0,1)
  (0,2)-(1,1)
  (1,0)-(0,1)
  (1,0)-(1,1)
  (1,2)-(0,1)
  (1,2)-(1,1)

Maximum Matching = "Maximum pairs of conflicting seats"
Example: {(0,0)-(0,1), (1,2)-(1,1)} - size 2
  - (0,0) matched once 
  - (0,1) matched once 
  - (1,2) matched once 
  - (1,1) matched once 

These 4 seats form the minimum vertex cover!
Remaining 4 seats can all have students!

Max matching logic: What's the maximum number of conflict pairs we can identify where each seat appears in at most one pair?


Augmenting Path:
Find Maximum Matching (Augmenting Path Algorithm)
An augmenting path is a path that alternates between:

Edges NOT in the matching (free edges)
Edges IN the matching (matched edges)

Starting from an unmatched vertex and ending at an unmatched vertex.
Key property is that If you "flip" all edges along an augmenting path (matched <-> unmatched), the matching grows by 1!


Visual: 
INITIAL STATE:
    A ---- B ---- C ---- D
    
Current matching: {B-C}  (shown with =)
    A ---- B ==== C ---- D
           ↑unmatched     ↑unmatched

AUGMENTING PATH: A ---- B ==== C ---- D
  - Start: A (unmatched) ✓
  - A-B: free edge (not in matching) ✓
  - B-C: matched edge (in matching) ✓
  - C-D: free edge (not in matching) ✓
  - End: D (unmatched) ✓

AFTER FLIPPING (swap all edges):
    A ==== B ---- C ==== D
    
New matching: {A-B, C-D}  (size increased from 1 to 2!)


===
Graph:
    1 ---- 2
    |    / |
    |   /  |
    |  /   |
    3 ---- 4

STEP 1: Start with empty matching {}
  Try vertex 1, find path: 1-2
  Augmenting path: 1 ---- 2
  Matching: {1-2}

STEP 2: Try vertex 3 (unmatched)
  Path 3-2: But 2 is already matched to 1
  Try to "kick out" 1 and find new match for 1
  
  Path: 3 ---- 2 ==== 1 
  But 1 has no other options, fail.
  
  Path 3-4: Success!
  Augmenting path: 3 ---- 4
  Matching: {1-2, 3-4}

STEP 3: All vertices matched! Maximum matching = 2

Analogies to remember: 
Minimum Vertex Cover: "Block the minimum number of intersections to stop all traffic routes"
Maximum Matching: "Maximum number of non-overlapping handshakes in a room"
Augmenting Path: "A chain of people swapping dance partners to fit one more couple on the dance floor"
*/


/**
 * ========================================
 * BIPARTITE MATCHING APPROACH
 * ========================================
 * 
 * Key Insight: The conflict graph is BIPARTITE!
 * - Partition vertices by column parity (even vs odd columns)
 * - All edges go between the two partitions
 * 
 * Algorithm:
 * 1. Build bipartite graph (even cols vs odd cols)
 * 2. Find maximum matching using augmenting paths
 * 3. Apply König's Theorem: MIS = |V| - Max Matching
 * 
 * Complexity: O(V × E) where V = O(mn), E = O(mn)
 *            = O(m²n²) worst case
 */

function maxStudents(seats) {
    const m = seats.length;
    const n = seats[0].length;    
    // STEP 1: EXTRACT GOOD SEATS & PARTITION
    
    /**
     * Partition good seats by column parity
     * SET A: even columns (0, 2, 4, ...)
     * SET B: odd columns (1, 3, 5, ...)
     */
    
    const setA = []; // Even column seats
    const setB = []; // Odd column seats
    const seatToId = new Map(); // Map (row,col) to unique ID
    let idCounter = 0;
    
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (seats[row][col] === '.') {
                const id = idCounter++;
                const seat = { id, row, col };
                seatToId.set(`${row},${col}`, id);
                
                if (col % 2 === 0) {
                    setA.push(seat);
                } else {
                    setB.push(seat);
                }
            }
        }
    }
    
    const totalSeats = setA.length + setB.length;
    
    // STEP 2: BUILD CONFLICT GRAPH (ADJACENCY LIST)
    
    /**
     * Add edge between two seats if they can see each other:
     * - Horizontally adjacent: (i, j) ↔ (i, j±1)
     * - Diagonally adjacent: (i, j) ↔ (i±1, j±1)
     */
    
    function canSeeEachOther(seat1, seat2) {
        const dr = Math.abs(seat1.row - seat2.row);
        const dc = Math.abs(seat1.col - seat2.col);
        
        // Adjacent horizontally (same row, adjacent columns)
        if (dr === 0 && dc === 1) return true;
        
        // Adjacent diagonally (adjacent row and column)
        if (dr === 1 && dc === 1) return true;
        
        return false;
    }
    
    // Build adjacency list: adj[idA] = [list of IDs in setB that conflict]
    const adjList = new Map();
    
    for (let seatA of setA) {
        adjList.set(seatA.id, []);
        
        for (let seatB of setB) {
            if (canSeeEachOther(seatA, seatB)) {
                adjList.get(seatA.id).push(seatB.id);
            }
        }
    }
    
    // Count edges
    let edgeCount = 0;
    for (let neighbors of adjList.values()) {
        edgeCount += neighbors.length;
    }
    
    
    // STEP 3: MAXIMUM BIPARTITE MATCHING
    
    /**
     * Find maximum matching using augmenting path algorithm
     * 
     * Matching: A set of edges with no shared vertices
     * Augmenting path: Alternating path from unmatched A to unmatched B
     * 
     * Algorithm:
     * 1. Start with empty matching
     * 2. For each unmatched vertex in A, find augmenting path using DFS
     * 3. If found, flip matching along the path (increases matching size by 1)
     * 4. Repeat until no augmenting paths exist
     */
    
    // matchA[idA] = idB means seat A is matched to seat B
    // matchB[idB] = idA means seat B is matched to seat A
    const matchA = new Map();
    const matchB = new Map();
    
    /**
     * Try to find an augmenting path starting from seat A using DFS
     * 
     * @param {number} idA - Starting vertex in set A
     * @param {Set} visited - Vertices visited in this DFS
     * @returns {boolean} - True if augmenting path found
     */
    function findAugmentingPath(idA, visited) {
        // Try each neighbor of A in set B
        for (let idB of adjList.get(idA)) {
            if (visited.has(idB)) continue;
            visited.add(idB);
            
            // Case 1: B is unmatched ..we found an augmenting path!
            if (!matchB.has(idB)) {
                matchA.set(idA, idB);
                matchB.set(idB, idA);
                return true;
            }
            
            // Case 2: B is matched to some A'
            // Try to recursively find augmenting path from A'
            const idAPrime = matchB.get(idB);
            if (findAugmentingPath(idAPrime, visited)) {
                // Success, so Update matching along this path
                matchA.set(idA, idB);
                matchB.set(idB, idA);
                return true;
            }
        }
        
        return false;
    }
    
    // Find maximum matching
    console.log("=== Finding Maximum Matching ===\n");
    let matchingSize = 0;
    
    for (let seatA of setA) {
        const visited = new Set();
        if (findAugmentingPath(seatA.id, visited)) {
            matchingSize++;
            console.log(`Match ${matchingSize}: Seat (${seatA.row},${seatA.col}) ↔ Set B`);
        }
    }
    
    /**
     * König's Theorem (for bipartite graphs):
     *   Minimum Vertex Cover = Maximum Matching
     * 
     * Therefore:
     *   Maximum Independent Set = |V| - Minimum Vertex Cover
     *                           = |V| - Maximum Matching
     * 
     * The independent set is the set of vertices NOT in the minimum vertex cover
     */
    
    const maxIndependentSet = totalSeats - matchingSize;
    
    // VISUALIZE THE MATCHING
    
    if (matchingSize > 0 && m <= 5 && n <= 6) {
        console.log("Matched pairs (conflicts we 'cover'):");
        for (let [idA, idB] of matchA.entries()) {
            const seatA = setA.find(s => s.id === idA);
            const seatB = setB.find(s => s.id === idB);
            console.log(`  (${seatA.row},${seatA.col}) ↔ (${seatB.row},${seatB.col})`);
        }
    }
    
    return maxIndependentSet;
}

/*

Algorithm                                    When to use:
Bitmask DPO(m × 4^n × n)                     n ≤ 8 (LeetCode constraint)
Bipartite MatchingO(V × E) = O(m²n²)         n > 20 or educational
Hopcroft-KarpO(E√V) = O(mn√mn)               Large graphs, optimized
*/

//https://leetcode.com/problems/maximum-students-taking-exam/solutions/2475512/ford-fulkerson-max-flow-max-matching-min-mpg8/
/*

Max flow : Min cut

Imagine water pipes:
SOURCE → [thin pipe] → [wide pipe] → SINK

No matter how wide the other pipes are,  the thin pipe limits total flow!
Min cut = capacity of the thin pipe
Max flow = can't exceed the thin pipe's capacity

*/