/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
    const rows = board.length;
    const cols = board[0].length;
    // 0,0    0,2
    // 1,0    1,2

    // find all zeroes from boundary of board
    // as we do a dfs for these chain of zeroes, we know these can never be converted to surrounding i.e X


    const DFS = (board, i, j, rows, cols) => {
        if (i < 0 || i >= rows || j < 0 || j >= cols || board[i][j] !== 'O') return;
        board[i][j] = 'V'
        DFS(board, i - 1, j, rows, cols)
        DFS(board, i + 1, j, rows, cols)
        DFS(board, i, j - 1, rows, cols)
        DFS(board, i, j + 1, rows, cols)
    }
    // for first and last column
    for (let i = 0; i < rows; i++) {
        if (board[i][0] === 'O') DFS(board, i, 0, rows, cols)
        if (board[i][cols - 1] === 'O') DFS(board, i, cols - 1, rows, cols);
    }

    // for first and last row
    for (let i = 0; i < cols; i++) {
        if (board[0][i] === 'O') DFS(board, 0, i, rows, cols)
        if (board[rows - 1][i] === 'O') DFS(board, rows - 1, i, rows, cols);
    }

    // we have now complete DFS from all borders
    // and we have marked the visited nodes in these chain of zeroes by V

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // there is a cell that has not been connected with border chain
            if (board[i][j] === 'O') board[i][j] = 'X'
            if (board[i][j] === 'V') board[i][j] = 'O' // restore original state, this cannot be surrounded,
        }
    }

};