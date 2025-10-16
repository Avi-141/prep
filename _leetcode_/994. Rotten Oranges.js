var orangesRotting = function (grid) {
    const m = grid.length, n = grid[0].length;

    const dfs = (i, j, minute) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0 || (grid[i][j] > 1 && grid[i][j] < minute))
            return;
        grid[i][j] = minute;
        dfs(i + 1, j, minute + 1);
        dfs(i - 1, j, minute + 1);
        dfs(i, j + 1, minute + 1);
        dfs(i, j - 1, minute + 1);
    };

    // Start DFS from all rotten oranges
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2)
                dfs(i, j, 2);
        }
    }

    let totalMinsTaken = 2;
    for (let row of grid) {
        for (let cell of row) {
            if (cell === 1) return -1;
            totalMinsTaken = Math.max(totalMinsTaken, cell);
        }
    }
    return totalMinsTaken - 2;
};

// The starting rotten oranges are marked as 2, representing minute 0 of rotting.
// Their neighbors get marked as 3 → which means rotted at minute 1
// Then 4 → minute 2, and so on.


/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    let freshOranges = 0;
    let maxTime = 0;

    // Initialize queue and count fresh oranges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) {
                queue.push([r, c, 0]); // [row, col, time]
            } else if (grid[r][c] === 1) {
                freshOranges++;
            }
        }
    }

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // BFS traversal
    let head = 0;
    while (head < queue.length) {
        const [r, c, time] = queue[head++];
        maxTime = Math.max(maxTime, time);

        for (const [dr, dc] of directions) {
            const newR = r + dr;
            const newC = c + dc;

            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && grid[newR][newC] === 1) {
                // This fresh orange rots
                grid[newR][newC] = 2;
                freshOranges--;
                queue.push([newR, newC, time + 1]);
            }
        }
    }

    // Final check for remaining fresh oranges
    return freshOranges === 0 ? maxTime : -1;
};