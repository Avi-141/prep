// https://leetcode.com/problems/generate-parentheses/editorial/

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    const totalBrackets = 2 * n;
    const result = [];

    // Intuition: "I have n left and n right brackets in my pocket — how do I use them?"
    function dfs(left, right, current) {
        if (left === 0 && right === 0) {
            result.push(current);
            return;
        }
        if (left > 0) dfs(left - 1, right, current + '(');
        if (right > left) dfs(left, right - 1, current + ')');
    }

    // Intuition: "I’ve used open left and close right brackets — what can I add next?"
    function dfs(open, close, current) {
        if (current.length === totalBrackets) {
            result.push(current);
            return;
        }
        if (open < n) dfs(open + 1, close, current + '(');        // can add '('
        if (close < open) dfs(open, close + 1, current + ')');    // can add ')' only if close < open
    }
    // dfs(n, n, '');
    dfs(0, 0, '');

    return result;
};