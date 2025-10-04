/**
 * @param {number[][]} matrix
 * @return {number}
 */
var countSquares = function (matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let result = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 1) {
                if (i === 0 || j === 0) {
                    result += 1
                } else if (matrix[i][j] === 1) {
                    const up = matrix[i - 1][j];
                    const left = matrix[i][j - 1];
                    const leftUp = matrix[i - 1][j - 1];
                    const maxSide = Math.min(up, left, leftUp) + 1;
                    result += maxSide;
                    matrix[i][j] = maxSide; // use matrix itself to update..
                }
            }
        }
    }
    return result;
};


var countSquares = function (matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let cache = Array(rows).fill(0).map(() => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i === 0 || j === 0) {
                cache[i][j] = matrix[i][j] === 0 ? 0 : 1;
            } else if (matrix[i][j] === 1) {
                const up = cache[i - 1][j];
                const left = cache[i][j - 1];
                const leftUp = cache[i - 1][j - 1];
                cache[i][j] = Math.min(up, left, leftUp) + 1;
            } else {
                cache[i][j] = 0
            }
        }
    }
    const sum = cache.flat().reduce((a, b) => a + b, 0);
    return sum;
};