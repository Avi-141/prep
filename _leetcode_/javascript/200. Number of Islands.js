/**
 * @param {character[][]} grid
 * @return {number}
 */


// The goal is to count the number of islands, not the total number of land cells.
var numIslands = function (grid) {
    const m = grid.length;
    const n = grid[0].length;
    let totalIsland = 0

    const visited = new Set()

    const dfs = (i, j) => {
        const key = `${i},${j}`
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1' || visited.has(key)) {
            return;
        }
        // grid[i][j] = '0' // mark as visited
        visited.add(key)
        dfs(i - 1, j)
        dfs(i + 1, j)
        dfs(i, j - 1)
        dfs(i, j + 1);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const key = `${i},${j}`
            if (grid[i][j] === '1' && !visited.has(key)) {
                totalIsland++
                dfs(i, j)
            }
        }
    }
    return totalIsland
};

// DSU approach
// https://leetcode.com/discuss/post/1072418/disjoint-set-union-dsuunion-find-a-compl-2oqn/
let parent = [];
const find = (x) => {
    return parent[x] === x ? x : (parent[x] = find(parent[x]))
}

const unite = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    if(rootX === rootY) return; // they are already united.
    if(rootX !== rootY){
        parent[rootX] = rootY
    }
}


function numIslands(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    parent = Array(numRows * numCols).fill(-1);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j] === '1') {
                //Use numCols (n) as the multiplier
                const currIndex = i * numCols + j;
                parent[currIndex] = currIndex;

                if (i > 0 && grid[i - 1][j] === '1') {
                    unite(currIndex, (i - 1) * numCols + j);
                }
                if (j > 0 && grid[i][j - 1] === '1') {
                    unite(currIndex, i * numCols + (j - 1));
                }
            }
        }
    }

    const setOfIslands = new Set();
    for(let p = 0; p < parent.length; p++){
        if(parent[p] !== -1) setOfIslands.add(find(p))
    }
    return setOfIslands.size;
}

//https://leetcode.com/problems/number-of-islands/