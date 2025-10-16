/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestDistance = function (grid) {
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const queue = [];
    // let head = 0; // head index for O(1) dequeue
    let M = grid.length
    let N = grid[0].length
    let buildings = [];
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (grid[i][j] === 1) buildings.push([i, j])
        }
    }

    // distance: Accumulates the total shortest-path distance from all buildings to each empty land cell (0)
    // After running BFS from every building, distances[r][c] holds the sum of distances from all buildings to (r, c)

    // reachable[M][N]: Counts how many buildings can reach each empty land cell. 
    // Obstacles (2) can block paths; a cell is valid only if it’s reachable from every building

    // visited[M][N] (per building): Ensures, within one BFS, each cell is processed once. 
    // This guarantees we add the shortest distance from this building to that cell exactly once and avoid double counting via multiple paths.
    let distances = Array(M).fill(0).map(() => Array(N).fill(0));
    let reachable = Array(M).fill(0).map(() => Array(N).fill(0));
    for (const [bx, by] of buildings) {
        // for every building we need to track visited lands
        const visited = Array(M).fill(false).map(() => Array(N).fill(false));
        const queue = [[bx, by, 0]]
        visited[bx][by] = true;

        while (queue.length) {
            const [x, y, dist] = queue.shift();
            for (const [dx, dy] of dirs) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < M && ny >= 0 && ny < N && !visited[nx][ny] && grid[nx][ny] === 0) {
                    visited[nx][ny] = true;
                    // We reached neighbor at distance dist + 1 from the current building
                    // add that cost to the total for (nx, ny).
                    distances[nx][ny] += dist + 1;
                    // Record that this building can reach (nx, ny)
                    reachable[nx][ny] += 1;
                    queue.push([nx, ny, dist + 1])
                }
            }
        }
    }

    let ans = Infinity;
    const total = buildings.length;
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (grid[i][j] === 0 && reachable[i][j] === total) {
                ans = Math.min(ans, distances[i][j])
            }
        }
    }
    return ans === Infinity ? -1 : ans
};

/*

function shortestDistance(grid) {
  const m = grid.length, n = grid[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const dist = Array.from({length: m}, () => Array(n).fill(0));
  let target = 0, buildings = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== 1) continue;
      buildings++;
      const q = [[i, j, 0]];
      while (q.length) {
        const [x, y, d] = q.shift();
        for (const [dx, dy] of dirs) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === target) {
            grid[nx][ny] = target - 1;      // mark reached by this building
            dist[nx][ny] += d + 1;          // add distance from this building
            q.push([nx, ny, d + 1]);
          }
        }
      }
      target--; // next building will only see cells reached by all previous ones
    }
  }

  let ans = Infinity;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === -buildings) ans = Math.min(ans, dist[i][j]);
    }
  }
  return ans === Infinity ? -1 : ans;


    Maintain target starting at 0.
    For each building’s BFS:
        Only step onto cells where grid[nx][ny] === target. Those are empty cells that were reached by all previous buildings and are unvisited in this BFS.
        When you enqueue such a cell, immediately set grid[nx][ny] = target - 1. This does two things:
            Acts as visited for the current BFS (prevents multiple enqueues via other paths).
            Tags the cell as “reached by this building,” so the next building (with target decremented) will consider it.
    After finishing a building, do target--.
    After processing B buildings, exactly the cells with grid[r][c] === -B are reachable from all buildings.

}*/