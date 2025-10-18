/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var countPairs = function (n, edges) {
    // dsu lagake
    // has component ka size ek dusre se pairs mai leke
    // multiply karke add

    let parent = new Array(n).fill(-1)
    let size = Array(n).fill(1)
    for (let i = 0; i < n; i++) {
        parent[i] = i;
    }


    function find(x) {
        if (parent[x] === x) return x;
        return (parent[x] = find(parent[x]))
    }

    function uniteBySize(x, y) {
        let rootX = find(x);
        let rootY = find(y);
        if (rootX === rootY) return;
        if (size[rootX] < size[rootY]) {
            // swap
            //[rootX, rootY] = [rootY, rootX]
            const t = rootX;
            rootX = rootY;
            rootY = t;
        }
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        return true;
    }

    for (const [u, v] of edges) uniteBySize(u, v)
    const components = [];
    for (let i = 0; i < n; i++) {
        // if its a disjoint set
        // push the sets size
        if (find(i) === i) components.push(size[i]);
    }

    const totalComponents = n * n
    let totalConnectedSize = 0
    for (const s of components) {
        totalConnectedSize += s * s;
    }

    return Math.floor((totalComponents - totalConnectedSize) / 2)

};


var countPairs = function (n, edges) {
    const graph = {};
    for (let [from, to] of edges) {
        if (!graph[from]) graph[from] = []
        if (!graph[to]) graph[to] = []
        graph[from].push(to)
        graph[to].push(from);
    }

    let visited = Array(n).fill(false)

    function dfs(node) {
        let count = 1;
        visited[node] = true;
        for (let neighbor of graph[node] || []) {
            if (!visited[neighbor]) {
                count += dfs(neighbor)
            }
        }
        return count;
    }

    let summationOfComponentSizes = 0;
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            const componentSize = dfs(i);
            summationOfComponentSizes += componentSize * componentSize;
        }
    }

    return Math.floor((n * n - summationOfComponentSizes) / 2)
}