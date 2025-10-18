/**
 * @param {number} n
 * @param {number[][]} mines
 * @return {number}
 */

// DFS O(n^3) approach... Okay..
const isValid = (x, y, n, grid) => {
    if (x >= n || y >= n || x < 0 || y < 0) return false
    if (grid[x][y] !== 1) return false
    return true;
}
var orderOfLargestPlusSign = function (n, mines) {
    let grid = Array(n).fill(1).map(() => Array(n).fill(1));
    for (const [x, y] of mines) {
        grid[x][y] = 0;
    }
    let largestPlusSignSize = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                // start with arm length 1 (center only)
                let span = 1;
                // expand while the next set of cells is all 1s
                while (true) {
                    // recalc each direction for this span
                    const top = i - span;
                    const bottom = i + span;
                    const left = j - span;
                    const right = j + span;
                    // break if any arm goes out of bounds or hits a mine (0)
                    if (!isValid(top, j, n, grid) ||
                        !isValid(bottom, j, n, grid) ||
                        !isValid(i, left, n, grid) ||
                        !isValid(i, right, n, grid)) {
                        break;
                    }
                    span++; // can grow one more
                }
                // record the maximum order seen (arm length = span)
                largestPlusSignSize = Math.max(largestPlusSignSize, span);
            }
        }
    }
    return largestPlusSignSize;
};


var orderOfLargestPlusSign = function (n, mines) {
    let dp = Array(n).fill(n).map(()=>Array(n).fill(n))
    // max arm length can be n
    for(const [x,y] of mines) dp[x][y] = 0;
    let result = 0;

    // 1) left-to-right pass (consecutive 1s horizontally)
    for (let row = 0; row < n; row++) {
        let countLR = 0;
        for (let col = 0; col < n; col++) {
            countLR = dp[row][col] === 0 ? 0 : countLR + 1;
            dp[row][col] = Math.min(dp[row][col], countLR);
        }
    }
    // 2) right-to-left pass (consecutive 1s horizontally)
    for (let row = 0; row < n; row++) {
        let countRL = 0;
        for (let col = n - 1; col >= 0; col--) {
            countRL = dp[row][col] === 0 ? 0 : countRL + 1;
            dp[row][col] = Math.min(dp[row][col], countRL);
        }
    }
    // 3) top-to-bottom pass (consecutive 1s vertically)
    for (let col = 0; col < n; col++) {
        let countTB = 0;
        for (let row = 0; row < n; row++) {
            countTB = dp[row][col] === 0 ? 0 : countTB + 1;
            dp[row][col] = Math.min(dp[row][col], countTB);
        }
    }
    // 4) bottom-to-top pass (consecutive 1s vertically) and compute result
    for (let col = 0; col < n; col++) {
        let countBT = 0;
        for (let row = n - 1; row >= 0; row--) {
            countBT = dp[row][col] === 0 ? 0 : countBT + 1;
            dp[row][col] = Math.min(dp[row][col], countBT);
            result = Math.max(result, dp[row][col]);
        }
    }
    return result;
};