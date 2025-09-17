// Example 2D grid
const exampleGrid = [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1]
];

const dfsGrid= (grid, row, col, visited = new Set())=>{
    const rows = grid.length;
    const cols = grid[0].length;
    const key = `${row},${col}`;

    if(row < 0 || row >= rows || col < 0 || col >=cols || visited.has(key)) return;
    visited.add(key);
    console.log('Visited ' + key)

    // visit all 4 dirs from given cell
    const directions = [[0,1], [1,0], [0,-1], [-1,0]];
    for(const [dr, dc] of directions){
        dfsGrid(grid, row+dr, col+dc, visited)
    }
}


dfsGrid(exampleGrid,1,1)