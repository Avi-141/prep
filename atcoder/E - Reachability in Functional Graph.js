// DFS approach, not optimal, TLE.
// Needs memoization
const reachabilityCount = (graph, vertex, visited = new Set(), reachable = new Set()) => {
    if (visited.has(vertex)) return reachable.size;
    visited.add(vertex)
    reachable.add(vertex)

    const neighbors = graph[vertex]
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            reachabilityCount(graph, neighbor, visited, reachable)
        }
    }
    return reachable.size
}


const solveTLE = () => {
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const N = Number(input[0]);
    const edges = input[1].split(' ').map(Number);
    const memo = Array(N + 1).fill(-1);

    let totalPairs = 0;

    const reachabilityCountSimple = (vertex) => {
        const reachable = new Set();
        const path = []
        let current = vertex
        if (memo[vertex] !== -1) return memo[vertex]

        while (!reachable.has(current)) {
            reachable.add(current);
            path.push(current);
            current = edges[current - 1] // find the node it points to..
        }

        const cycleStart = path.indexOf(current)
        const cycleLength = path.length - cycleStart
        //console.log(`Vertex ${vertex}: path=${path}, cycleStart=${cycleStart}, cycleLength=${cycleLength}`);

        // lets start from vertex 5
        // path = [5 2 4 1] , reachable = {5 2 4 1} curr = edges[0] = 2.
        // 2 in reachable, exit cycle detected , curr = 2
        // cycleStart = path.indexOf(current) = path.indexOf(2) = 1
        // cycleLength = path.length - cycleStart = 4 - 1 = 3

        for (let i = 0; i < path.length; i += 1) {
            const node = path[i];
            // cycle hasnt started, in tail, find reachable distance
            if (i < cycleStart) {
                memo[node] = path.length - i;
            } else if (i >= cycleStart) {
                // in cycle, will find same len over and over..
                memo[node] = cycleLength
            }
            //console.log(`  memo[${node}] = ${memo[node]} (i=${i})`);
        }
        // return reachable.size
        return memo[vertex]
    }

    for (let vertex = 1; vertex <= N; vertex += 1) {
        const count = (reachabilityCountSimple(vertex))
        //console.log(`Vertex ${vertex} can reach ${count} nodes`);
        //const count = reachabilityCountSimple(graph, vertex, new Set(), new Set());
        totalPairs += count;
        // console.log(reachabilityCountSimple(vertex, edges))
    }
    /*
        // Without batch memoization:
        reachabilityCount(5) → traverses 5→2→4→1→2 (detects cycle)
        reachabilityCount(2) → traverses 2→4→1→2 (same cycle again!)
        reachabilityCount(4) → traverses 4→1→2→4 (same cycle again!)
        reachabilityCount(1) → traverses 1→2→4→1 (same cycle again!)

        // With batch memoization:
        reachabilityCount(5) → traverses once, caches results for ALL nodes [5,2,4,1]
        reachabilityCount(2) → memo hit! Returns cached result
        reachabilityCount(4) → memo hit! Returns cached result  
        reachabilityCount(1) → memo hit! Returns cached result
    */

    console.log(totalPairs)
}

/*
The main TLE culprit in below code is queue.shift() (O(N) per pop → worst-case O(N²)). 
I swapped it for a head pointer queue and got AC. 
also can tighten a few hotspots like typed arrays, single split, no extra sets..but not needed as of now
const A = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let p = 0;
const N = A[p++];

const to     = new Int32Array(N + 1);
const indeg  = new Int32Array(N + 1);
for (let i = 1; i <= N; i++) {
  const v = A[p++];
  to[i] = v;
  indeg[v]++;              // count indegree (for Kahn peel)
}
*/

/*const { makeIntQueue } = require('./queue');

const q = makeIntQueue(N);
for (let i = 1; i <= N; i++) if (indeg[i] === 0) q.push(i);
while (!q.empty()) {
  const u = q.pop();
  const v = to[u];
  if (--indeg[v] === 0) q.push(v);
}
*/

function solve(){
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const N = Number(input[0]);

    const edges = input[1].split(' ').map(Number);
    const next = Array(N+1).fill(-1);
    const indegree = Array(N+1).fill(0);
    let totalReachable = 0;

    const reachable = Array(N+1).fill(0);

    for(let i=1;i<=N;i++){
        next[i] = edges[i-1] // i to a(i)
        indegree[next[i]]+=1;
    }


    //Now, remove every node that isn’t on a cycle, in the order we would topologically delete them.  Remove all tail nodes using Kahn
    // const queue = [];
    // Kahn peel (NO shift! use head/tail indices)
    /*for(let i=1;i<=N;i++){
        if(indegree[i]===0) queue.push(i);
    }*/

    const q = new Int32Array(N);
    let head = 0, tail = 0;
    for (let i = 1; i <= N; i++) {
        if (indegree[i] === 0) q[tail++] = i;
    }


    const processingOrder = [];
    while(head < tail){
        // const node = queue.shift(); //(O(N) per pop → worst-case O(N²))
        const node = q[head++];    
        processingOrder.push(node);

        const neighbor = next[node];
        indegree[neighbor]-=1; // important

        if(indegree[neighbor]===0){
            //queue.push(neighbor)
            q[tail++] = neighbor;
        }
    }


    // Handle cycle nodes (remaining)
    const visited = Array(N+1).fill(false)
    for(let i=1;i<=N;i++){
        if(indegree[i] > 0 && !visited[i]){
            // we are now in cycle with unvisited node.
            const cycleNodes =[];
            let current = i;
            do{
                cycleNodes.push(current);
                visited[current] = true
                current = next[current]
            } while(current !==i) // cycle completed.

            // all cycle nodes can reach all nodes in cycle
            for(const cycleNode of cycleNodes){
                reachable[cycleNode] = cycleNodes.length;
                indegree[cycleNode] = 0; // processing complete
            }
        }
    }

    for(let i = processingOrder.length - 1; i>=0;i-=1){
        const node = processingOrder[i];
        reachable[node] = reachable[next[node]] + 1;
    }

    for(let i=1;i<=N;i++){
        totalReachable+=reachable[i]
    }
    return totalReachable
}

console.log(solve())

/*

In functional graphs, the reachable set size for each node depends on 
whether it's part of a cycle or leads into one. 
For nodes within a cycle, the size equals the cycle length. 
For nodes leading into the cycle, the reachable set is determined by the tail length and cycle length
*/

/*

Learnt something interesting today:
We are very used to using Array.shift() to pop the first element out of an array
In Node/V8 engine, Array.shift() is O(n) because it has to reindex the remaining elements. 
So lets say we run a BFS that pops ~N times, that becomes O(N²) and explodes on N ≈ 2*10^5 elements.
The fix is to use classic head-pointer queue: store items in an array and keep an integer head that moves forward. No reindexing, so pops are O(1)

// push: q[tail++] = x
// pop:  const x = q[head++]
// empty when head === tail
const q = new Int32Array(N);
let head = 0, tail = 0;

// push
q[tail++] = start;

// pop
const x = q[head++];

// check empty
if (head === tail) { empty }


Everywhere you’d normally use a queue in competitive programming:
BFS on graphs/grids (shortest path in unweighted graphs).
Kahn’s algorithm (topological sort / indegree peeling).
Multi-source BFS (start many nodes at once).
State-space BFS (word ladder, locks, bitmask BFS).
0-1 BFS (uses a deque; head/tail indices again).

In languages with cheap pops from the front, you don’t need this (e.g., Python collections.deque.popleft() is O(1), C++ deque, Java ArrayDeque). In JS, you do.

Queues/Deques show up constantly. 
A few classic ones where the head-pointer (or deque) pattern matters:

Topological sort / Kahn
LeetCode 207/210 — Course Schedule I/II
AtCoder ABC 223 D — “Restricted Permutation” (Kahn; often with a min-heap, but plain queue is fine if no order constraint)
Codeforces 510C — Fox And Names (toposort on letters)

Single-/Multi-source BFS (grid/graph)
LeetCode 994 — Rotting Oranges (multi-source BFS)
LeetCode 127 — Word Ladder (BFS on word graph)
LeetCode 752 — Open the Lock
LeetCode 1091 — Shortest Path in Binary Matrix
LeetCode 286 — Walls and Gates (multi-source BFS)
AtCoder ABC 007 C — Maze BFS
AtCoder ABC 088 D — Grid Repainting BFS

Deque (head/tail both ends)
LeetCode 239 — Sliding Window Maximum (monotonic deque)

0-1 BFS problems (edges 0 cost or 1 cost) — push front/back depending on edge cost

*/

