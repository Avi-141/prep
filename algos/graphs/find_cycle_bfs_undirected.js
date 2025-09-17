let cycleStart = -1
let cycleEnd = -1;


function buildGraph(edges, directed=false){
    const graph = {};
    for(const [from, to] of edges){
        if(!graph[from]) graph[from] = []
        if(!graph[to]) graph[to] = []
        graph[from].push(to);
        if(!directed) graph[to].push(from);
    }
    return graph
}


function bfs(graph, node, visited){
    const queue = [];

    queue.push({node, parent: -1});
    visited[node] = true
    while(queue.length > 0){
        const curr = queue.shift();
        for(const neighbor of graph[curr.node]){
            if(visited[neighbor] && neighbor !== curr.parent) {
                cycleStart = neighbor;
                cycleEnd = curr.node;
                return true
            }
            if(!visited[neighbor]){
                visited[neighbor] = true
                queue.push({node: neighbor, parent: curr.node})
            }
        }
    }
    return false

}

function hasCycle(edges){
    const graph = buildGraph(edges, false);
    const nodes = Object.keys(graph).map(Number);
    const n = Math.max(...nodes) + 1;
    const visited = Array(n).fill(false);
    
    for(const node of nodes){
        if(!visited[node] && bfs(graph, node, visited)) return true;
    }
    return false
}

