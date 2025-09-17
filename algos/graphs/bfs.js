const buildGraphFromEdges = (edges, directed = false) => {
    const graph = {};
    for(const [from, to] of edges){
        if(!graph[from]) graph[from] = []
        if(!graph[to]) graph[to] = []
        graph[from].push(to);
        if(!directed) graph[to].push(from);
    } 
    return graph;
}

const bfs = (graph, start, visited = new Set()) => {
    const queue = [];
    queue.push(start);
    visited.add(start)

    while(queue.length > 0){
        const node = queue.shift() // dequeue remove from front
        console.log(node);
        for(const neighbor of graph[node]){
            if(!visited.has(neighbor)){
                visited.add(neighbor)
                queue.push(neighbor)
            }
        }
    }
}


class Queue {
    constructor(){
        this.items = [];
    }

    enqueue(item){
        this.items.push(item);
    }

    dequeue(){
        return this.items.shift();
    }

    isEmpty(){
        return this.items.length === 0
    }
}

function bfsWithQueueClass(graph, start, visited = new Set()){
    const queue = Queue();
    queue.enqueue(start);
    visited.add(start);

    while(!queue.isEmpty()){
        const node = queue.dequeue();
        console.log(node)
        for(const neighbor in graph[node]){
            if(!visited.has(neighbor)){
                visited.add(neighbor);
                queue.enqueue(neighbor)
            }
        }
    }
}


const edges = [[0,1], [0,2], [1,3], [1,4], [2,5], [4,5]];
const graph = buildGraphFromEdges(edges);
console.log("BFS traversal:");
bfs(graph, 3);