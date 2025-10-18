/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    const m = board.length;
    const n = board[0].length;

    if (word.length > m * n) return false;

    const freq = new Array(128).fill(0);
    for (const char of word) {
        freq[char.charCodeAt(0)]++;
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const char = board[i][j];
            freq[char.charCodeAt(0)]--;
        }
    }

    for (let count of freq) {
        if (count > 0) return false;
    }

    function dfs(row, col, currWordIndex) {
        // important base case
        // this means we have completed finding word in the grid
        if(currWordIndex === word.length) return true;
        if (row < 0 || row >= m || col < 0 || col >= n || board[row][col] !== word[currWordIndex]) return false

        // mark the cell as visited otherwise (we are taking this word into the dfs chain)
        const currLetter = board[row][col]
        board[row][col] = '#'

        const canMakeWord = dfs(row + 1, col, currWordIndex + 1) || dfs(row - 1, col, currWordIndex + 1) ||
            dfs(row, col + 1, currWordIndex + 1) || dfs(row, col - 1, currWordIndex + 1)

        // here we need to get the word back... so after dfs is over, mark is back
        board[row][col] = currLetter
        return canMakeWord;
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }

    return false;
};

// word search II 
// https://algo.monster/liteproblems/212
// Complex implementation