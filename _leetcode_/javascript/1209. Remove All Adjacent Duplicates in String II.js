/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */


class Pair {
    // track count per char in a stack
    // pop when count of char = k..
    constructor(count, char) {
        this.count = count;
        this.char = char
    }
}

var removeDuplicates = function (s, k) {
    const stack = [];
    for (let i = 0; i < s.length; i++) {
        const topOfStack = stack.length - 1
        if (stack.length === 0 || s[i] !== stack[topOfStack].char) {
            stack.push(new Pair(1, s[i]))
        } else {
            // INCREMENT count, then check it its K, if so, pop
            stack[topOfStack].count++
            if (stack[topOfStack].count === k) {
                stack.pop();
            }
        }
    }

    let ans = ''
    for(const {char, count} of stack){
        ans += char.repeat(count)
    }
    return ans;
};