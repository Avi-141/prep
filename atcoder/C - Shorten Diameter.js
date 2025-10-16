// Build an undirected tree adjacency list and a degree map from 1-based edges input
function buildTree(edges) {
    const graph = {}
    const indegree = {}
    for (const [from, to] of edges) {
        // Convert to 0-based indices for internal representation
        if (!graph[from - 1]) graph[from - 1] = []
        if (!graph[to - 1]) graph[to - 1] = []
        // add both directions because tree is undirected
        graph[from - 1].push(to - 1);
        indegree[to - 1] = (indegree[to - 1] || 0) + 1;
        graph[to - 1].push(from - 1) // undirected
        indegree[from - 1] = (indegree[from - 1] || 0) + 1;
    }
    // graph: adjacency list, indegree: degree of each vertex (not used heavily here)
    return { graph, indegree }
}

// Standard BFS that returns distances from a start node to all nodes in the tree.
// - tree: adjacency list (array or object of arrays)
// - node: starting vertex (0-based)
// - N: total number of vertices
function bfs(tree, node, N) {
    const queue = [];
    const shortestDistance = Array(N).fill(-1); // -1 means unvisited / unreachable (shouldn't happen in connected tree)
    queue.push(node);
    shortestDistance[node] = 0;

    while (queue.length > 0) {
        const curr = queue.shift();
        for (const neighbor of tree[curr]) {
            if (shortestDistance[neighbor] === -1) {
                shortestDistance[neighbor] = shortestDistance[curr] + 1;
                queue.push(neighbor);
            }
        }
    }
    return shortestDistance
}

// Main solution function for AtCoder problem "Shorten Diameter".
// Reads input from stdin, constructs tree, computes diameter and then
// determines minimal number of vertex removals so that resulting tree diameter <= K.
function buildGoodTree() {
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const [N, K] = input[0].split(' ').map(Number);

    // Read edges (1-based) into list
    const edges = [];
    for (let i = 1; i < N; i++) {
        const [a, b] = input[i].split(' ').map(Number);
        edges.push([a, b]);
    }

    const { graph, indegree } = buildTree(edges)

    // 1) First BFS from arbitrary node (0) to find one endpoint of diameter
    const shortestDistancesFirstPass = bfs(graph, 0, N);
    // Find farthest node from node 0 -> one endpoint of diameter
    let maxDistance = 0;
    let farthestNode = 0;
    for (let i = 0; i < N; i++) {
        if (shortestDistancesFirstPass[i] > maxDistance) {
            maxDistance = shortestDistancesFirstPass[i];
            farthestNode = i;  // one endpoint of the tree diameter
        }
    }

    // 2) Second BFS from discovered endpoint to get distances and diameter length
    const finalDistances = bfs(graph, farthestNode, N);
    const currentDiameter = Math.max(...finalDistances.filter(d => d !== -1));

    // If already within K, no removals necessary
    if (currentDiameter <= K) {
        return 0;
    }

    // Precompute distances from every vertex to every other vertex.
    // This allows O(1) distance queries later at the cost of O(N^2) time/memory.
    const allDistances = [];
    for (let i = 0; i < N; i += 1) {
        allDistances[i] = bfs(graph, i, N)
    }

    let minRemovals = N // upper bound

    // If K is even:
    // A center can be a single vertex; any vertex must be within K/2 distance from that center.
    // We try every vertex as the center and count how many vertices are farther than K/2.
    if (K % 2 === 0) {
        for (let center = 0; center < N; center++) {
            let removals = 0;
            for (let i = 0; i < N; i++) {
                // allDistances[center][i] is distance from center to i
                if (allDistances[center][i] !== -1 && allDistances[center][i] > K / 2) {
                    removals++;
                }
            }
            minRemovals = Math.min(minRemovals, removals);
        }
    } else {
        // If K is odd:
        // The optimal "center" can be an edge (two adjacent vertices). For an edge (u,v)
        // a vertex's distance to that edge is min(dist(u, x), dist(v, x)).
        // We try every undirected edge once (i < neighbor) and count vertices whose
        // minimum distance to the edge is > (K-1)/2 (i.e., cannot be covered by that edge-center).
        for (let i = 0; i < N; i++) {
            for (const neighbor of graph[i]) {
                if (i < neighbor) {  // avoid processing undirected edge twice
                    let removals = 0;
                    for (let j = 0; j < N; j++) {
                        // distances from j to endpoints i and neighbor
                        const distToI = allDistances[i][j] === -1 ? Infinity : allDistances[i][j];
                        const distToNeighbor = allDistances[neighbor][j] === -1 ? Infinity : allDistances[neighbor][j];
                        const minDistToEdge = Math.min(distToI, distToNeighbor);
                        // If min distance to the edge is larger than allowed radius, vertex must be removed
                        if (minDistToEdge !== Infinity && minDistToEdge > (K - 1) / 2) {
                            removals++;
                        }
                    }
                    minRemovals = Math.min(minRemovals, removals);
                }
            }
        }
    }
    return minRemovals
}

// Print result to stdout (AtCoder expects single integer output)
console.log(buildGoodTree())

// Notes / rationale (brief):
// - Strategy: reduce the tree to have diameter <= K by removing minimal vertices.
// - For even K, center is a node; for odd K, center is an edge. For each candidate center,
//   count vertices outside the allowed radius and take the minimal count.
// - Precomputing all-pairs distances by running BFS from each node is simple and safe
//   for typical AtCoder constraints where N is small enough for O(N^2) memory/time.
// - This implementation uses 0-based indices internally while parsing 1-based input edges.




// adj matrix better when we need "does edge exist queries"

/*
"Modify your DFS to handle self-loops without infinite loops"
"How would self-loops affect cycle detection in an undirected graph?"

"Design a social network where users can 'follow themselves' - how do you handle this?"
"In a dependency graph, what does a self-loop represent and how do you detect it?"

"Your shortest path algorithm gives wrong results - could self-loops be the issue?"
"Why might allowing self-loops break your topological sort?"

"Should your graph data structure allow self-loops? Justify your decision."
"How would you modify adjacency matrix vs adjacency list for self-loops?"
*/

/* When Self-Loops Are Useful
1. State Machines & Finite Automata
Node stays in same state with certain input
Game states where player can "wait" or "do nothing"

2. Network Flow Problems
Self-loops can represent internal capacity or storage
Resource allocation within the same entity
// 2. Network Flow with Self-Capacity
Problems where nodes have internal storage/processing capacity

3. Dynamic Programming on Graphs
Representing "staying at current position" as an option
Time-based graph problems where waiting is allowed

4. Social Networks & Recommendation Systems
Users can like their own posts, follow themselves
Self-referential relationships

1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance
// Self-loops with weight 0 (staying in same city costs nothing)
// Floyd-Warshall naturally handles this

2. 787. Cheapest Flights Within K Stops
// Waiting at airport (self-loop) might be optimal in some variants

3. 1162. As Far from Land as Possible
// Multi-source BFS where staying put is an option


AtCoder Problems:
1. ABC 237 D - LR insertion
Self-referential operations where elements can reference themselves
2. ABC 204 D - Cooking
DP where "doing nothing" (self-loop in state) is an option


1. Shortest Path with "Wait" Option
// You can wait at any vertex for cost 0
void addWaitEdges() {
    for(int i = 0; i < n; i++) {
        graph[i][i] = 0; // self-loop with cost 0
    }
}

3. Cache/Memory Problems
// Data can stay in same cache level
// Self-loop represents cache hit (cost 0)

Design a subway system where passengers can wait at stations. Find minimum time to travel from A to B."
// Each station has self-loop (waiting costs time but might be optimal)
// if next train is delayed
for(int station = 0; station < n; station++) {
    addAdjMatrixEdge(station, station, WAIT_TIME, graph);
}
*/

