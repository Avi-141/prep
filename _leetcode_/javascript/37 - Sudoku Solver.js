// https://leetcode.com/problems/sudoku-solver/solutions/15796/singapore-prime-minister-lee-hsien-loong-s-sudoku-solver-code-runs-in-1ms/
// https://leetcode.com/problems/sudoku-solver/solutions/7139970/leetcode-editorial-sudoku-solver-0ms-beats-100/


/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
// there are 9 subgrids
// block is i/3, first element is i/3 * 3
// subgrid = (row / 3) * 3 + col/3

// col to be reset to 0 so that in every SUBSEQUENT 
// row iteration the search for vacant space will start from COLUMN 0
var solveSudoku = function (board) {
    function solve(row, col) {
        for (let i = row; i < 9; i++) {
            // Only reset col to 0 if we're moving to a new row beyond the initial one
            let startCol = (i === row) ? col : 0;
            for (let j = startCol; j < 9; j++) {
                if (board[i][j] !== '.') continue;
                for (let num = 1; num <= 9; num++) {
                    const str = num.toString();
                    if (isValid(board, i, j, str)) {  // ← FIXED: use (i, j)
                        board[i][j] = str;
                        if (solve(i, j + 1)) return true;
                        board[i][j] = '.';
                    }
                }
                return false;
            }
        }
        return true;
    }

    function isValid(board, row, col, num) {
        const x = Math.floor(row / 3) * 3;
        const y = Math.floor(col / 3) * 3;

        for (let i = 0; i < 9; i++) {
            const dy = Math.floor(i / 3);
            const dx = i % 3;  // no need for Math.floor here
            if (
                board[row][i] === num ||        // row
                board[i][col] === num ||        // col
                board[x + dy][y + dx] === num   // 3x3 block ← FIXED
            ) {
                return false;
            }
        }
        return true;
    }

    solve(0, 0);
};