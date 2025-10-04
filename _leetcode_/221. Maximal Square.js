/**
 * @param {character[][]} matrix
 * @return {number}
 */
// https://leetcode.com/problems/maximal-square/description/
// Bottom up DP.
var maximalSquare = function (matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const table = Array(rows).fill(0).map(() => Array(cols).fill(0));
    let maxSide = 0;
    // for first row/column just add values as is, it can either be single square of 1 or no square due to 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i === 0 || j === 0) {
                table[i][j] = matrix[i][j] === '1' ? 1 : 0;
            } else if (matrix[i][j] === '1') {
                // if current cell is 1, then we can form a square with min of left, top, diagonal + 1
                table[i][j] = Math.min(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1]) + 1;
            } else {
                // if current cell is 0, then no square can be formed here
                table[i][j] = 0;
            }
            maxSide = Math.max(maxSide, table[i][j]);
        }
    }
    return maxSide * maxSide;
};


// Top down dfs with memoize.
var maximalSquare = function (matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const cache = new Map();
    // Top-down DFS with logging
    const dfs = (i, j) => {
        console.log(`Entering dfs(${i}, ${j})`);
        if (i >= rows || j >= cols) {
            console.log(`dfs(${i}, ${j}) out of bounds, return 0`);
            return 0;
        }
        let key = `${i},${j}`;
        if (!cache.has(key)) {
            let down = dfs(i + 1, j);
            let right = dfs(i, j + 1);
            let diagonal = dfs(i + 1, j + 1);
            cache.set(key, 0);
            if (matrix[i][j] === '1') {
                let maxSquareSide = Math.min(down, right, diagonal) + 1;
                cache.set(key, maxSquareSide);
            }
        }
        console.log(`Returning dfs(${i}, ${j}) = ${cache.get(key)}`);
        return cache.get(key);
    }
    dfs(0, 0);
    // Build a 2D cache table for visualization
    const cacheTable = Array(rows).fill(0).map(() => Array(cols).fill(null));
    for (const [k, v] of cache.entries()) {
        const [x, y] = k.split(',').map(Number);
        cacheTable[x][y] = v;
    }
    console.log('Cache Table (max square side from each cell):');
    console.table(cacheTable);

    let maxSqLen = Math.max(...Array.from(cache.values()));
    return maxSqLen * maxSqLen;
}
// https://leetcode.com/u/archit91/
// https://leetcode.com/problems/maximal-square/solutions/1632376/c-python-6-simple-solution-w-explanation-optimizations-from-brute-force-to-dp/




// Histogram and Monotonic stack approach
var maximalSquareHistogram = function (matrix) {
    if (!matrix.length || !matrix[0].length) return 0;
    let rows = matrix.length, cols = matrix[0].length;
    let heights = Array(cols).fill(0);
    let maxSide = 0;
    for (let i = 0; i < rows; i++) {
        // store every row’s cumulative height
        // Maintain a 1D heights[col] (number of consecutive ‘1’s ending at the current row)
        for (let j = 0; j < cols; j++) {
            heights[j] = matrix[i][j] === '1' ? heights[j] + 1 : 0;
        }

        // use the 'histograms' (heights) to compute largest square
        // we will create a monotonic stack approach, find next smaller to left and to right
        // Treat heights as a histogram and for each bar compute its NSL/NSR (next‐smaller‐left/right) with a mono-stack
        // For bar j, its maximal width = right[j] – left[j] – 1; the largest square side you can embed at j is min(heights[j], width)
        // For each bar j you want to know “how far left and right can I extend so that every bar in that interval is at least as tall as mine?”
        // NSL[j] gives you the nearest index < j whose bar is strictly shorter.
        // NSR[j] gives you the nearest index > j whose bar is strictly shorter.
        // Therefore every bar in (NSL[j]+1 … NSR[j]–1) has height ≥ heights[j], so you have a contiguous width
        let stack = [], left = Array(cols).fill(-1), right = Array(cols).fill(cols);

        // NSL: next smaller to left
        for (let j = 0; j < cols; j++) {
            while (stack.length && heights[stack[stack.length - 1]] >= heights[j]) {
                stack.pop();
            }
            left[j] = stack.length ? stack[stack.length - 1] : -1;
            stack.push(j);
        }
        // NSR: next smaller to right
        stack = [];
        for (let j = cols - 1; j >= 0; j--) {
            while (stack.length && heights[stack[stack.length - 1]] >= heights[j]) {
                stack.pop();
            }
            right[j] = stack.length ? stack[stack.length - 1] : cols;
            stack.push(j);
        }

        // compute max square side for this histogram
        for (let j = 0; j < cols; j++) {
            let width = right[j] - left[j] - 1;
            let side = Math.min(width, heights[j]);
            maxSide = Math.max(maxSide, side);
        }
    }
    // return area (side squared)
    return maxSide * maxSide;
}


/// GPT generated code.... need to dry run
// 3) 2D Prefix-Sum + Binary Search approach
// Build a (m+1)x(n+1) prefix-sum array P so that P[i+1][j+1] = sum of matrix[0..i][0..j]
var maximalSquarePrefix = function (matrix) {
    if (!matrix.length || !matrix[0].length) return 0;
    const m = matrix.length;
    const n = matrix[0].length;

    // 1) Build prefix-sum P with an extra row and column of zeros
    // P[i+1][j+1] = (matrix[i][j] as int) + P[i][j+1] + P[i+1][j] - P[i][j]
    const P = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const val = matrix[i][j] === '1' ? 1 : 0;
            P[i + 1][j + 1] = val + P[i][j + 1] + P[i + 1][j] - P[i][j];
        }
    }

    // 2) Helper to get sum of any k x k sub-square starting at (r, c)
    //    rows r..r+k-1 and cols c..c+k-1 inclusive
    const getSum = (r, c, k) => {
        // In P-coordinates, bottom-right = (r+k, c+k), top-left = (r, c)
        return P[r + k][c + k] - P[r][c + k] - P[r + k][c] + P[r][c];
    };

    let maxSide = 0;
    // 3) For each cell (i,j) consider it as top-left of a candidate square
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Maximum possible side length from this cell
            const maxPossible = Math.min(m - i, n - j);
            // Only search if we can beat current maxSide
            let lo = maxSide + 1;
            let hi = maxPossible;
            let best = 0;
            // Binary search largest k where sum == k*k
            while (lo <= hi) {
                const mid = Math.floor((lo + hi) / 2);
                // If the total ones in this mid x mid square equals full area,
                // then all cells are '1' and we can try bigger.
                if (getSum(i, j, mid) === mid * mid) {
                    best = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            // Update global max side
            maxSide = Math.max(maxSide, best);
        }
    }

    // Return area = side^2
    return maxSide * maxSide;
};