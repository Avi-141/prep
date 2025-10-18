/**
 * @param {number[][]} grid
 * @return {number}
 */

// dfs approach
var maxAreaOfIsland = function (grid) {
    const m = grid.length;
    const n = grid[0].length;
    let maxArea = 0;
    const area = (row, col) => {
        if (row < 0 || col < 0 || row >= m || col >= n || grid[row][col] !== 1) return 0
        grid[row][col] = 0;
        return 1 + area(row - 1, col) + area(row + 1, col) + area(row, col - 1) + area(row, col + 1)
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            maxArea = Math.max(maxArea, area(i, j))
        }
    }

    return maxArea;
};

// bfs approach -- more suited in real life find friends problem
var maxAreaOfIsland = function (grid) {
    let maxArea = 0
    let dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const m = grid.length, n = grid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                let area = 0;
                const queue = [[i, j]]; // store coordinates
                grid[i][j] = 0; // mark visited
                while (queue.length) {
                    const p = queue.shift();
                    area += 1;
                    for (const [dx, dy] of dirs) {
                        const x = p[0] + dx; // current x + direction x
                        const y = p[1] + dy; // current y + direction y
                        // in bounds and is land
                        if (x >= 0 && y >= 0 && x < m && y < n && grid[x][y] === 1) {
                            queue.push([x, y]);
                            grid[x][y] = 0; // mark visited     
                        }
                    }
                }
                maxArea = Math.max(maxArea, area);
            }
        }
    }
    return maxArea;
}