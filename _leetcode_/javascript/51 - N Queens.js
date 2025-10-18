/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
    const board = new Array(n).fill('.').map(() => Array(n).fill('.'))
    const configurations = []

    function canPlace(board, row, col) {
        for (let i = 0; i < n; i++) {
            // vertical check for the same column 
            if (board[i][col] === 'Q') return false
            // only check two upward diagonals as we are going row by row
            // no need to chec bottom two diagaonls..
            if (row - i >= 0 && col - i >= 0 && board[row - i][col - i] === 'Q') return false
            if (row - i >= 0 && col + i < n && board[row - i][col + i] === 'Q') return false
        }
        return true // we can now place the queen
    }

    function placeQueen(board, row) {
        if (row === board.length) {
            // configurations.push(board)
            /*
                In JavaScript, arrays are objects passed by reference. 
                When we do configurations.push(board).. we are 
                 Pushing a reference to the board array, not a copy
                 Later, when you backtrack with board[row][col] = '.', 
                 we are modifying the same board that was pushed to configurations

            */
            configurations.push(board.map(row => row.join('')));
            return;
        }

        // try placing queen on each column for a given row .. basically all cells of the row i
        for (let col = 0; col < board.length; col++) {
            if (canPlace(board, row, col)) {
                board[row][col] = 'Q' // place and check next
                placeQueen(board, row + 1)
                // reset now so we can get other configurations
                // This modifies the board that's already in configurations
                // so dont push board directly
                board[row][col] = '.'
            }
        }
    }

    placeQueen(board, 0)
    return configurations;
};


// another O(N) approach is to not track entire grid but just column positions..
var solveNQueens = function (n) {
    const solutions = []
    const queens = new Array(n).fill(-1) // queens[row] = col;

    function canPlace(row, col) {
        for (let r = 0; r < row; r++) {
            const c = queens[r]
            /*

                r = row where a queen is already placed
                c = column where that queen is placed (c = queens[r])
                col = column we're trying to place a new queen in current row

                We need to ensure that the new queen at (row, col) does not conflict with any previously placed queens.

                1. Column Check: If c === col, it means there's already a queen in the same column.
                2. Diagonal Check: For two points to be on the same diagonal, the absolute difference in rows must equal the absolute difference in columns.
                // This formula checks both top-left/bottom-right AND top-right/bottom-left diagonals

            */
            // check column and both diagonals
            if (c === col || Math.abs(row - r) === Math.abs(col - c)) return false
        }
        return true
    }

    function placeQueen(row) {
        if (row === n) {
            const solution = [];
            for (let r = 0; r < n; r++) {
                const rowStr = '.'.repeat(queens[r]) + 'Q' + '.'.repeat(n - queens[r] - 1);
                solution.push(rowStr);
            }
            solutions.push(solution);
            return;
        }

        for (let col = 0; col < n; col++) {
            if (canPlace(row, col)) {
                queens[row] = col;
                placeQueen(row + 1);
                queens[row] = -1; // Backtrack
            }
        }
    }
    placeQueen(0)
    return solutions
}