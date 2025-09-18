// BFS-based cycle detection using 3-color approach for directed graphs
const buildGraphFromEdges = (edges) => {
    const graph = {};
    const nodes = new Set();
    
    for(const [from, to] of edges){
        if(!graph[from]) graph[from] = [];
        if(!graph[to]) graph[to] = [];
        graph[from].push(to);
        nodes.add(from);
        nodes.add(to);
    }
    return {graph, nodes: Array.from(nodes)};
}


const bfsCycleDetection3Color = (graph, nodes) =>{
    const color = {}
    const parent = {};
    // white = 0,unvisited
    // gray = 1, processing, back edge
    // black = 2, done

    for(const node of nodes){
        color[node] = 0;
        parent[node] = -1
    }

    for(const startNode of nodes){
        if(color[startNode]===0){
            const queue = [startNode];
            color[startNode] = 1; // in progress.

            while(queue.length > 0){
                const currVertex = queue.shift()
                if(!graph[currVertex]) continue;


                for(const neighbor of graph[currVertex]){
                    if(color[neighbor] === 1){
                        return true;
                    }
                    if(color[neighbor] === 0){
                        queue.push(neighbor)
                        parent[neighbor] = currVertex
                        color[neighbor] = 1;
                    }
                }
                color[currVertex] = 2; // black, done processing and no cycle
            }
        }
    }
    return false; // No cycle found
}

// Test
const edges1 = [[0, 1], [1, 2], [2, 0]]; // Has cycle
const edges2 = [[0, 1], [1, 2], [2, 3]]; // No cycle, tree
const edges3 = [[0, 1], [1, 2], [2, 3], [3, 1]]; // Has cycle: 1-2-3-1

console.log("=== BFS 3-Color Cycle Detection ===");
console.log("Test 1 (has cycle):");
const {graph: g1, nodes: n1} = buildGraphFromEdges(edges1);
console.log("Has cycle:", bfsCycleDetection3Color(g1, n1));

console.log("\nTest 2 (no cycle):");
const {graph: g2, nodes: n2} = buildGraphFromEdges(edges2);
console.log("Has cycle:", bfsCycleDetection3Color(g2, n2));

console.log("\nTest 3 (no cycle):");
const {graph: g3, nodes: n3} = buildGraphFromEdges(edges3);
console.log("Has cycle:", bfsCycleDetection3Color(g3, n3));

/*
BFS processes level-by-level, not path-by-path
Finding a "gray" node doesn't mean it's an ancestor in your current path
It could be a sibling node being processed in parallel
*/

/*
Correct BFS Approaches:
Kahn's Algorithm (Topological Sort)

If you can't process all nodes, there's a cycle Works only for directed graphs
Union-Find for Undirected Graphs 
Check if adding an edge creates a cycl
*/