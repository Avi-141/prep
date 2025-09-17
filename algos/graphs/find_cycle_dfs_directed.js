// Global variables for cycle detection
let cycleStart = -1;
let cycleEnd = -1;

const buildGraph = (edges) => {
    const graph = {}
    for(const [from, to] of edges){
        if(!graph[to]) graph[to] = [];
        if(!graph[from]) graph[from] = [];
        graph[from].push(to)
    }
    return graph;
}

// ...existing code...

const dfs = (graph, node, visited, recStack, parent, depth = 0) =>{
    const indent = '  '.repeat(depth);
    console.log(`${indent}→ Entering node ${node}`);
    
    visited[node] = true;
    recStack[node] = true;
    console.log(`${indent}  recStack[${node}] = true`);
    console.log(`${indent}  Current recStack: [${recStack.map((val, idx) => val ? idx : '_').filter(x => x !== '_').join(', ')}]`);

    // Check if this node has any neighbors
    const neighbors = graph[node] || [];
    console.log(`${indent}  Node ${node} has neighbors: [${neighbors.join(', ') || 'NONE'}]`);

    if(neighbors.length === 0) {
        console.log(`${indent}  🔵 Node ${node} is a DEAD END (no outgoing edges)`);
    }

    for(const neighbor of neighbors){
        console.log(`${indent}  Checking neighbor ${neighbor}`);
        
        // neighbor already traversed
        if(recStack[neighbor] === true) {
            console.log(`${indent}  🔴 CYCLE DETECTED! ${neighbor} is in recStack`);
            cycleStart = neighbor;
            cycleEnd = node;
            return true; // back edge
        }
        // if not visited and cycle in subtree.
        if(!visited[neighbor]) {
            console.log(`${indent}  ${neighbor} not visited, going deeper...`);
            parent[neighbor] = node;
            if(dfs(graph, neighbor, visited, recStack, parent, depth + 1)) return true
        } else {
            console.log(`${indent}  ${neighbor} already visited (not in recStack)`);
        }
    }
    
    console.log(`${indent}  ✅ Finished exploring all neighbors of ${node}`);
    recStack[node] = false
    console.log(`${indent}← Exiting node ${node} (backtracking)`);
    console.log(`${indent}  recStack[${node}] = false`);
    console.log(`${indent}  Current recStack: [${recStack.map((val, idx) => val ? idx : '_').filter(x => x !== '_').join(', ')}]`);
    return false
}


// color as follows
// all white colored at start
/*
We will run a series of DFS in the graph. Initially all vertices are colored white (0). 
From each unvisited (white) vertex, start the DFS, mark it gray (1) while entering and mark it black (2) on exit. 
If DFS moves to a gray vertex, then we have found a cycle (if the graph is undirected, the edge to parent is not considered). 
The cycle itself can be reconstructed using parent array.
*/

const dfsColor = (graph, node, color, parent) => {
    color[node] = 1;
    for(const neighbor of graph[node]){
        if(color[neighbor] === 0){ // WHITE, unvisited
            parent[neighbor] = node; // sets parent, also need to explore deeper levels
            if(dfsColor(graph, neighbor, color, parent)){
                return true; // Cycle in subtree..
            }
        }else if(color[neighbor] === 1){ // Gray - back edge therefore cycle
            cycleStart = neighbor;
            cycleEnd = node;
            return true;
        }
    }
    // reached back, no cycle baby
    color[node] = 2;
    return false
}


const findCycle = (graph) => {
    const nodes = Object.keys(graph).map(Number);
    const n = Math.max(...nodes) + 1;
    const visited = new Array(n).fill(false)
    const color = new Array(n).fill(0)// WHITE GREY BLACK
    const parent = new Array(n).fill(-1);
    const recStack = new Array(n).fill(false);
    cycleStart = -1
    cycleEnd = -1

    for(const node of nodes){
        
        if(!visited[node] && dfs(graph, node, visited, recStack, parent)){
         break;
        }
        //if(color[node] ===0 && dfsColor(graph, node, color, parent)){
          //  break;
        //}
    }

    if(cycleStart === -1){
        console.log("Acyclic");
        return null;
    }else{
        const cycle =[];
        cycle.push(cycleStart);
        for(let v = cycleEnd; v !== cycleStart; v = parent[v]){
            cycle.push(v);
        }
        cycle.push(cycleStart)
        console.log("Cycle is", cycle);
        return cycle
    }
}

const edges = [[0,1],[2,1],[0,2],[2,0]]
const graph = buildGraph(edges, true)
findCycle(graph)

/*
White (0): "Never seen this node"
Gray (1): "Currently exploring this path"
Black (2): "Completely finished with this node"
Makes the algorithm's state machine more explicit

if(color[neighbor] === 0) // Tree edge
if(color[neighbor] === 1) // Back edge (cycle!)  
if(color[neighbor] === 2) // Forward/Cross edge
Advanced algorithms need edge types:

When 3-Color Really Shines

Strongly Connected Components
Topological sorting with edge classification
Bridge/Articulation point detection
*/