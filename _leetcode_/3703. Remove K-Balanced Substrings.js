/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var removeSubstring = function (s, k) {
    const stack = []; // char, count
    // check for group of k substring
    for (const char of s) {
        if (stack.length > 0 && stack[stack.length - 1][0] === char) {
            stack[stack.length - 1][1]++;
        }
        else stack.push([char, 1]);
        // (( ))

        while(stack.length >=2 && 
            stack[stack.length - 1][0] === ")" &&
            stack[stack.length - 1][1] >= k &&
            stack[stack.length - 2][0] === "(" &&
            stack[stack.length - 2][1] >= k
        ) {
            stack[stack.length - 1][1] -= k;
            stack[stack.length - 2][1] -= k;
            // one group found can find more?

            if (stack[stack.length - 1][1] === 0) stack.pop();
            if (stack.length > 0 && stack[stack.length - 1][1] === 0) stack.pop();
        }
    }
    //console.log(stack)
    return stack.map(([char, count]) => char.repeat(count)).join('')
};
