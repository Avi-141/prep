/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValid = function (s) {
    const stack = [];
    const stringSplit = s.split("");

    for (let i = 0; i < stringSplit.length; i++) {
        const char = stringSplit[i];
        
        if (char === '(') {
            stack.push(i);
        } else if (char === ')') {
            if (stack.length > 0) {
                // Found a matching open parenthesis, so pop it.
                stack.pop();
            } else {
                // No matching open parenthesis, mark this for removal. 
                // stack is empty so this is an extra one..
                // s = a())b
                stringSplit[i] = '';
            }
        }
        // For any other character (letters, etc.), we do nothing.
    }

    // any indices left in the stack are for unmatched open parentheses.
    // second loop correctly handles this.
    for (let i = 0; i < stack.length; i++) {
        const invalidOpenIndex = stack[i];
        stringSplit[invalidOpenIndex] = '';
    }

    return stringSplit.join("");
};

// 
// Follow up - multiple types of paranthesis
// (), {}, []
//"a(b[c{d}e]f)g", "a(b[c{d}e]f)g"
function minRemoveMulti(s) {
    const chars = s.split('');
    const stack = []; // stack of { idx, char }
    const opens = new Set(['(', '[', '{']);
    const match = { ')': '(', ']': '[', '}': '{' };

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (opens.has(c)) {
            stack.push({ idx: i, char: c });
        } else if (c in match) {
            if (stack.length && stack[stack.length - 1].char === match[c]) {
                stack.pop();
            } else {
                chars[i] = ''; // remove unmatched closing
            }
        }
    }
    // remove leftover unmatched openings
    for (const { idx } of stack) chars[idx] = '';
    return chars.join('');
}