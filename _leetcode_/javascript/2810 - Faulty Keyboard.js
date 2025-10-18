/**
 * @param {string} s
 * @return {string}
 */

// this involves multiple reversals given multiple i's 
var finalString = function(s) {
    let resultChars = []
    for(const char of s){
        if(char === 'i'){
            resultChars.reverse();
        }else{
            resultChars.push(char)
        }
    }
    return resultChars.join('')
};

var finalString = function(s) {
    let result = "";
    let rev = false;
    for (const c of s) {
        if (c === 'i') {
            // toggle reversal mode
            rev = !rev;
        } else {
            // add char to end or front based on rev flag
            result = rev ? c + result : result + c;
        }
    }
    // if rev is true, perform final reversal
    if (rev) {
        result = result.split('').reverse().join('');
    }
    return result;
};

/**
 * @param {string} s
 * @return {string}
 */

// inspired by https://leetcode.com/problems/faulty-keyboard/solutions/3870361/o-n/
var finalString = function(s) {
    let a = "", b = "";
    for (const c of s) {
        if (c === 'i') {
            // swap active/inactive buffers on each toggle
            [a, b] = [b, a]; // O(1) swap
        } else {
            // always append to the “active” buffer
            a += c; // amortized O(1)
        }
    }
    // reverse the inactive buffer once and prepend
    // b has accumulated the “to‐be‐prepended” segments in forward order,
    // so we reverse b once to prepend them correctly. 
    // a is already in the right (forward) order, so we leave it as-is.
    return b.split('').reverse().join('') + a;
};