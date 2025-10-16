/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const mapOpenClose = {
        '(':')',
        '{':'}',
        '[':']'
    };

    const stack = [];
    for(const char of s){
        if(['(', '{', '['].includes(char)) stack.push(mapOpenClose[char])
        else if(stack.length === 0 || stack.pop() !== char) return false
    }

    return stack.length === 0;
};

//https://leetcode.com/problems/valid-parentheses/solutions/9178/short-java-solution/