/**
 * @param {number[][]} nums
 * @return {number[]}
 */
var findDiagonalOrder = function (nums) {
    let len = nums.length;
    let result = [];
    let groups = new Map();
    for (let row = len - 1; row >= 0; row--) {
        for (let col = 0; col < nums[row].length; col++) {
            let diagonal = row + col;
            groups.set(diagonal, [...groups.get(diagonal) || [], nums[row][col]])
        }
    }
    const keys = Array.from(groups.keys()).sort((a, b) => a - b)
    for (const k of keys) result.push(...groups.get(k))
    return result;
};

var findDiagonalOrder = function (nums) {
    let rootNode = [0, 0]
    let queue = [rootNode];
    let path = [];
    // nums[1][0] is left child and nums[0][1] is right child for root node
    // nums[i][j] is left child of nums[i-1][j] and right child of nums[i][j-1]
    // add row+1, col before row, col+1 so order is correct.
    // if column is 0 and row+1 exists then row+1, col to queue
    // if column + 1 exists for current row, row, col+1 to queue

    // If we're at the start of a diagonal (first column), enqueue the cell below
    // This ensures new diagonals are seeded in the correct order.
    // Always try to enqueue the right neighbor if it exists in the same row.
    // That moves along the current diagonal.
    while (queue.length) {
        const [x, y] = queue.shift();
        path.push(nums[x][y])

        if (y === 0 && x + 1 < nums.length) queue.push([x + 1, y])
        if (y + 1 < nums[x].length) queue.push([x, y + 1])
    }
    return path;

    /*

     We only need to consider the square row + 1, col (down) if we are at the start of a diagonal. 
     Otherwise, for every other square on the diagonal, 
     the square below it has already been visited by the right edge of the previous square.
     */
}