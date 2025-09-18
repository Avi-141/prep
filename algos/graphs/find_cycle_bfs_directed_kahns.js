const buildGraphFromEdges = (edges) => {
    const n = Math.max(...edges.flat()) + 1;
    const indegree = Array(n).fill(0);
    const graph = {};

    for(const [from, to] of edges){
        if(!graph[from]) graph[from] = []
        if(!graph[to]) graph[to] = []
        graph[from].push(to);
        indegree[to]+=1;
    } 
    return {graph, indegree, n}
}


// indegree count (incoming edges for each node)
const bfs = (graph, totalNodes, indegree) => {
    const queue = []
    for(let i=0;i<totalNodes;i++){
        if(indegree[i] === 0) queue.push(i);
        // add all zero indegree nodes to queue.
    }
    let processed = 0;
    while(queue.length > 0){
        const node = queue.shift();
        processed +=1;

        for(const neighbor of graph[node]){
            indegree[neighbor] -=1;
            if(indegree[neighbor] === 0){
                queue.push(neighbor)
            }
        }
    }
    return processed !== totalNodes
}



// Kahn's algorithm
// Needs topological sort

const hasCycle = (edges) =>{
    const {graph, indegree, n} = buildGraphFromEdges(edges)
    return bfs(graph, n, indegree)
}