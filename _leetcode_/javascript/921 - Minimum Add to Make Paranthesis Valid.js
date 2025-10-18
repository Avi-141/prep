/**
 * @param {string} s
 * @return {number}
 */
var minAddToMakeValid = function(s) {
    const stack = [];
    let count = 0;

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            if (stack.length > 0) {
                stack.pop();
            } else {
                count++;
            }
        }
    }

    // Any unmatched opening parentheses need a closing counterpart
    count += stack.length;

    return count;
};

/**
 * @param {string} s
 * @return {number}
 */

var minAddToMakeValid = function (s) {
    let unmatchedOpen = 0;
    let unmatchedClose = 0;

    for (const char of s) {
        if (char === '(') unmatchedOpen++;
        else if (char === ')') {
            if(unmatchedOpen > 0) unmatchedOpen --
            else unmatchedClose++;
        }
    }
    return unmatchedOpen + unmatchedClose
};