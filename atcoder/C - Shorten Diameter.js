
function buildTree(edges) {
    const graph = {}
    const indegree = {}
    for (const [from, to] of edges) {
        if (!graph[from - 1]) graph[from - 1] = []
        if (!graph[to - 1]) graph[to - 1] = []
        graph[from - 1].push(to - 1);
        indegree[to - 1] = (indegree[to - 1] || 0) + 1;
        graph[to - 1].push(from - 1) // undirected tree
        indegree[from - 1] = (indegree[from - 1] || 0) + 1;
    }
    return { graph, indegree }
}


function bfs(tree, node, N) {
    const queue = [];
    const shortestDistance = Array(N).fill(-1); // instead of visited
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

function buildGoodTree() {
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const [N, K] = input[0].split(' ').map(Number);

    const edges = [];
    for (let i = 1; i < N; i++) {
        const [a, b] = input[i].split(' ').map(Number);
        edges.push([a, b]);
    }

    const { graph, indegree } = buildTree(edges)
    const shortestDistancesFirstPass = bfs(graph, 0, N); // first bfs
    // We start from node 0 .. can be anything btw.
    // Find the node with maximum distance from node 0
    let maxDistance = 0;
    let farthestNode = 0;
    for (let i = 0; i < N; i++) {
        if (shortestDistancesFirstPass[i] > maxDistance) {
            maxDistance = shortestDistancesFirstPass[i];
            farthestNode = i;  // This is one endpoint of diameter
        }
    }

    // Second BFS from the farthest node (diameter endpoint)
    const finalDistances = bfs(graph, farthestNode, N);
    const currentDiameter = Math.max(...finalDistances.filter(d => d !== -1));

    // If current diameter is already ≤ K, no removals needed
    if (currentDiameter <= K) {
        return 0;
    }

    // precompute all distances BFS from each vertex
    const allDistances = [];
    for(let i =0; i< N;i+=1){
        allDistances[i] = bfs(graph, i, N)
    }

    let minRemovals = N
    
    // Even case is simple... just loop using each vertex as center and find min removals
    if (K % 2 === 0) {
        // Even K: try each vertex as center, remove nodes (centers) with distance > K/2
        for (let center = 0; center < N; center++) {
            let removals = 0;
            
            for (let i = 0; i < N; i++) {
                if (allDistances[center][i] !== -1 && allDistances[center][i] > K / 2) {
                    removals++;
                }
            }
            minRemovals = Math.min(minRemovals, removals);
        }
    } else {
        // Odd is not using node but use EDGE as center.... i missed this and got 11 WA...
        for (let i = 0; i < N; i++) {
            for (const neighbor of graph[i]) {
                if (i < neighbor) {  // Avoid duplicate edges
                    let removals = 0;
                    
                    for (let j = 0; j < N; j++) {
                        const dist1 = allDistances[i];
                        const dist2 = allDistances[neighbor]
                        const minDistToEdge = Math.min(
                            dist1[j] === -1? Infinity: allDistances[i][j],
                            dist2[j] === -1? Infinity:allDistances[neighbor][j]
                        );
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

console.log(buildGoodTree())


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

