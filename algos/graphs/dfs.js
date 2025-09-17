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

function dfs(graph, startNode, visited = new Set()){
    visited.add(startNode);
    console.log(startNode);

    for(const neighbor of graph[startNode] || []){
        if(!visited.has(neighbor)){
            dfs(graph, neighbor, visited)
        }
    }
}


const edges = [[0,1], [0,2], [1,3], [1,4], [2,5], [4,5]]
const graphFromEdges = buildGraphFromEdges(edges)

const visitedArr = new Set();

const graph = {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F'],
    D: ['B'],
    E: ['B', 'F'],
    F: ['C', 'E']
}
dfs(graph, 'A', visitedArr);


dfs(graphFromEdges,5, visitedArr)