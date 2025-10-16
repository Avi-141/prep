/**
 * @param {number[][]} mat
 * @return {number[]}
 */
// BFS Alternative in case https://leetcode.com/problems/diagonal-traverse/discuss/1456697/Intuitive-spiral-BFS-traversal-based-O(NM)-solution
var findDiagonalOrder = function (mat) {
    const rows = mat.length;
    const cols = mat[0].length
    const pattern = new Array(rows * cols);
    let row = 0, col = 0;

    for (let i = 0; i < rows * cols; i++) {
        pattern[i] = mat[row][col];
        let diagonal = row + col
        // notice all values in the same diagonal share the same sum value of x index + y index
        // direction of going up right or going down left depends whether the index sum is even or odd
        //for each even or odd diagonal, there are three cases:
        // 1. there is room to go that direction 
        // 2. there is no row space to go further but there is col space 
        // 3. there is no col space to go further but there is row space
        // even sum diagonal
        if (diagonal % 2 === 0) {
            if (row - 1 >= 0 && col + 1 < cols) {
                // move up right
                row = row - 1
                col = col + 1
            } else if (col + 1 < cols) {
                // at top row, so move right
                col = col + 1
            } else {
                // at right edge so move down
                row = row + 1
            }
        } else {
            if (row + 1 < rows && col - 1 >= 0) {
                // move down left
                row = row + 1
                col = col - 1;
            } else if (row + 1 < rows && col - 1 < 0) {
                // at left edge and not bottom so move down
                row = row + 1
            } else if (row + 1 > rows - 1 && col + 1 < cols) {
                // at bottom edge and not right edge so move right
                col = col + 1
            }
        }
    }
    return pattern;
};

/*

Direction Pattern
The traversal alternates direction based on the diagonal sum:

Even sum (0, 2, 4...): Move up-right (↗) - decrease row, increase col
Odd sum (1, 3, 5...): Move down-left (↙) - increase row, decrease col

Boundary Handling
When you can't continue in the preferred direction, follow these rules:

For even diagonals (going up-right):

If possible: move up-right (row-1, col+1)
If at top row but not right edge: move right (row, col+1)
If at right edge: move down (row+1, col)

For odd diagonals (going down-left):

If possible: move down-left (row+1, col-1)
If at left edge but not bottom: move down (row+1, col)
If at bottom edge: move right (row, col+1)
*/