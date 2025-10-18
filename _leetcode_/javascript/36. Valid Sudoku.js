/**
 * @param {character[][]} board
 * @return {boolean}
 */

/*
k = i / 3 * 3 + j / 3 

0  0  0 | 1  1  1 | 2  2  2
0  0  0 | 1  1  1 | 2  2  2
0  0  0 | 1  1  1 | 2  2  2
--------+---------+---------
3  3  3 | 4  4  4 | 5  5  5
3  3  3 | 4  4  4 | 5  5  5
3  3  3 | 4  4  4 | 5  5  5
--------+----------+--------
6  6  6 | 7  7  7 | 8  8  8
6  6  6 | 7  7  7 | 8  8  8
6  6  6 | 7  7  7 | 8  8  8

*/

// for each row we have 9 positions so 9*9
var isValidSudoku_Track = function (board) {
    let N = 9;
    // rows[r][num] = true means digit 'num' is in row r
    /*
rows = [
  [f, f, f, f, f, f, f, f, f, f],  // row 0: can track digits 0-9 (we use 1-9)
  [f, f, f, f, f, f, f, f, f, f],  // row 1
  [f, f, f, f, f, f, f, f, f, f],  // row 2
  ...
  [f, f, f, f, f, f, f, f, f, f]   // row 8
]

    */
    let rows = Array(9).fill().map(() => Array(10).fill(false)); // 10 digits 1–9
    let cols = Array(9).fill().map(() => Array(10).fill(false));
    let boxes = Array(9).fill().map(() => Array(10).fill(false));

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const value = board[row][col];
            if (value === '.') continue // no number

            // for every
            let num = board[row][col] - '0'
            // board[r][c] - '0'; // e.g., '5' → 5, '9' → 9
            // we are using digit itself as index..
            const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3)
            if (rows[row][num] || cols[col][num] || boxes[boxIndex][num]) return false
            rows[row][num] = true;
            cols[col][num] = true;
            boxes[boxIndex][num] = true;
        }
    }
    return true;
};


function ithBitSet(num, i) {
    return num & (1 << i)
}


var isValidSudoku_BitMask = function (board) {
    // Instead of 2D arrays, use one integer per row/col/box
    // Each bit (1 to 9) represents whether digit 'd' has been seen
    const N = 9
    let rows = new Array(N).fill(0);
    let cols = new Array(N).fill(0);
    let boxes = new Array(N).fill(0);

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const val = board[r][c]
            if (val === '.') continue;

            let number = board[r][c] - '0'
            const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

            if (ithBitSet(rows[r], number) ||
                ithBitSet(cols[c], number) ||
                ithBitSet(boxes[boxIndex], number)
            ) {
                return false;
            }

            rows[r] |= (1 << number)
            cols[c] |= (1 << number)
            boxes[boxIndex] |= (1 << number)
        }
    }
    return true
}
/*

+---------+---------+---------+
| .  .  . | .  .  . | 1  .  . |
| .  .  . | .  .  . | .  .  . |
| .  .  . | .  .  . | .  .  . |
+---------+---------+---------+
| .  .  . | .  .  . | .  2  . |
| .  .  . | .  .  . | .  3  . |
| .  .  . | .  .  . | .  4  . |
+---------+---------+---------+
| .  .  . | .  .  . | .  .  . |
| .  .  . | .  .  . | .  .  . |
| .  .  . | .  .  . | .  .  1 |
+---------+---------+---------+


VALID BUT NOT SOLVABLE!!!
*/