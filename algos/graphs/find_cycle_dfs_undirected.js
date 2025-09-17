// Global variables for cycle detection
let cycleStart = -1;
let cycleEnd = -1;

const buildGraphFromEdges = (edges, directed = false) =>{
    const graph = {};
    for(const [from, to] of edges){
        if(!graph[from]) graph[from] = []
        if(!graph[to]) graph[to] = []
        graph[from].push(to);
        if(!directed) graph[to].push(from);
    }
    return graph
}

const dfs = (graph, node, parent, visited, parentArray) => {
    visited[node] = true;

    for(const neighbor of graph[node]){
        if(neighbor === parent) continue; // skip edge to parent

        if(visited[neighbor] === true) {
            cycleStart = neighbor; // back-edge 
            cycleEnd = node;
            return true
        }

        parentArray[neighbor] = node;

        if(dfs(graph, neighbor, 
            node /* node is parent for neighbor */,
            visited, parentArray)){ 
            return true;
        }
    }
    return false; // No cycle
}

const findCycle = (graph) => {
    const nodes = Object.keys(graph).map(Number);
    const n = Math.max(...nodes) + 1;
    const visited = new Array(n).fill(false)
    const parent = new Array(n).fill(-1);
    cycleStart = -1
    cycleEnd = -1

    // DFS from each unvisited node
    for(const node of nodes){ // handle disconnected graphs..
        if(!visited[node] && dfs(graph, node, -1, visited, parent)){
            break;
        }
    }

    if(cycleStart === -1){
        console.log("Acyclic");
        return null;
    }else{
        // console.log(cycleStart, cycleEnd)
        // Cycle path
        const cycle =[];
        cycle.push(cycleStart);
        for(let v = cycleEnd; v !== cycleStart; v = parent[v]){
            cycle.push(v);
        }
        cycle.push(cycleStart) // loop closed
        console.log("Cycle is", cycle);
        return cycle
    }
}


const edges1 = [[0,1], [0,2], [1,3], [1,4], [2,5], [4,5]]; 
// Has cycle: 0->1->4->5->2->0
const edges2 = [[0,1], [1,2], [2,3], [3,4]]; // No cycle (tree)

console.log("Test 1 - Graph with cycle:");
const graph1 = buildGraphFromEdges(edges1);
console.log("Graph:", graph1);
findCycle(graph1);

const graph2 = buildGraphFromEdges(edges2);
console.log("Graph:", graph2);
findCycle(graph2);


// Two disconnected components
const disconnectedEdges = [
    [0, 1], [1, 2],    // Component 1: 0-1-2 (no cycle)
    [3, 4], [4, 5], [5, 3]  // Component 2: 3-4-5-3 (has cycle)
];

const graphDisconnected = buildGraphFromEdges(disconnectedEdges)
findCycle(graphDisconnected)