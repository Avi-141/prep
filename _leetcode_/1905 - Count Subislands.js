/**
 * @param {number[][]} grid1
 * @param {number[][]} grid2
 * @return {number}
 */
var countSubIslands = function (grid1, grid2) {
    const m = grid1.length
    const n = grid1[0].length // both are n*m so its ok
    let subIslandsCount = 0;
    // acessible by dfs due to closure
    // pass by reference
    let isSubIsland;

    const dfs = (x, y) => {
        if (x < 0 || x >= m || y < 0 || y >= n || grid2[x][y] === 0) return;

        // no point to dfs this subisland as its water
        // We found land in grid2 at (x, y), but the same spot in grid1 is water (0)
        if (grid1[x][y] === 0) {
            isSubIsland = false;
        }

        // mark this x,y as visited, we sink this island (make it water)
        grid2[x][y] = 0
        dfs(x + 1, y)
        dfs(x - 1, y)
        dfs(x, y + 1)
        dfs(x, y - 1)
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid2[i][j] === 1) {
                // Assume it's a valid sub-island until proven otherwise
                isSubIsland = true;
                dfs(i, j);

                // if went through and dfs happened.. it is a subisland
                if (isSubIsland) subIslandsCount++
            }
        }
    }
    return subIslandsCount;
};

/// Union Find Approach
// https://leetcode.com/problems/count-sub-islands/solutions/5695643/o-m-n-union-find-java-c-python-go-rust-javascript/