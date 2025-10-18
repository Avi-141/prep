function wallsAndGates(rooms) {
  const m = rooms.length;
  if (!m) return;
  const n = rooms[0].length;
  const INF = 2147483647; // empty room
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  const queue = [];
  let head = 0; // head index for O(1) dequeue

  //console.log("Initial rooms:");
  // printGrid(rooms);

  // enqueue all gates
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rooms[i][j] === 0) {
        queue.push([i, j]);
        // console.log(`Enqueue gate at (${i},${j})`);
      }
    }
  }

  let layer = 0;
  while (head < queue.length) {
    const size = queue.length - head; // current layer size
    // console.log(`\nBFS layer ${layer}, queue size=${size}, queue=${JSON.stringify(queue.slice(head))}`);

    for (let s = 0; s < size; s++) {
      const [x, y] = queue[head++];
      // console.log(` Dequeue (${x},${y}) val=${rooms[x][y]}`);

      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue; // out of bounds
        if (rooms[nx][ny] !== INF) continue; // wall(-1), gate(0), or already visited
        rooms[nx][ny] = rooms[x][y] + 1;     // first visit => shortest distance
        // console.log(`  Update (${nx},${ny}) -> ${rooms[nx][ny]} (from (${x},${y}))`);
        queue.push([nx, ny]);
      }
    }

    // console.log(" Grid after layer:");
    // printGrid(rooms);
    layer++;
  }

  // console.log("\nFinal rooms:");
  //printGrid(rooms);

  function printGrid(g) {
    for (let i = 0; i < g.length; i++) {
      console.log(g[i].map(v => String(v).padStart(11, ' ')).join(' '));
    }
  }
}

// Example to trace:
const rooms = [
  [2147483647, -1, 0, 2147483647],
  [2147483647, 2147483647, 2147483647, -1],
  [2147483647, -1, 2147483647, -1],
  [0, -1, 2147483647, 2147483647],
];

wallsAndGates(rooms);

/*

 // we initiate breadth-first search (BFS) from all gates in sequence
    // Semantically, the multi-sourced BFS with 1 queue is actually concurrent.
    // One queue to handle multiple sources is essentially like performing each layer for
    // each node once, before progressing to the next layer of any other bfs -- basically
    // context switching of multiple "bfs tasks" at the same time gives the illusion of
    // "at the same time".
*/


/*

each gate is not fully searched before moving on to a new gate. Each gate only looks at the areas within 1 space before we check the next gate. So each area within one space of the gates are checked for rooms and these rooms are marked, then added to the queue. Once all gates are checked, each new space is checked, and so forth. So, once a room gets hit, it has to be from the closest gate

*/