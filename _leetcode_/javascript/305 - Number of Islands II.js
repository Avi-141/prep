/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} positions
 * @return {number[]}
 */
var numIslands2 = function (m, n, positions) {
    let grid = Array(m).fill(0).map(() => Array(n).fill(0));
    // const operations = positions.length;
    const parent = new Array(m * n).fill(-1);
    const numIslands = [];
    let count = 0;
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 4 directions

    // dont scan entire grid every operation..
    /*for (let op = 0; op < operations; op++) {
        const x = positions[op][0];
        const y = positions[op][1];
        grid[x][y] = 1;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === 1) {
                    const cell = i * n + j;
                    // this is important..
                    if (parent[cell] === -1) {
                        parent[cell] = cell;
                    }
                    const prevRowCell = (i - 1) * n + j;
                    const prevColCell = i * n + j - 1;
                    if (i > 0 && grid[i - 1][j] === 1) unite(cell, prevRowCell);
                    if (j > 0 && grid[i][j - 1] === 1) unite(cell, prevColCell);
                }
            }
        }
        /*const set = new Set();
        for (let par of parent) {
            if (par !== -1) set.add(find(par));
        }
        numIslands.push(set.size);
    }*/

    function unite(x, y) {
        let rootX = find(x);
        let rootY = find(y);
        if (rootX === rootY) return;
        parent[rootX] = rootY;
        count--;
    }

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    for (const [x, y] of positions) {
        const cell = x * n + y;
        if (parent[cell] !== -1) {
            // positions can be duplicate..
            numIslands.push(count)
            continue;
        }

        parent[cell] = cell;
        count++;

        for (const [dx, dy] of dirs) {
            const neighborX = x + dx;
            const neighborY = y + dy;
            if (neighborX >= 0 && neighborX < m && neighborY >= 0 && neighborY < n) {
                const newCell = neighborX * n + neighborY;
                if (parent[newCell] !== -1) {
                    unite(cell, newCell)
                }
            }
        }
        numIslands.push(count);
    }

    return numIslands;
};