/**
 * @param {string} s
 * @return {number}
 */
var numSub = function(s) {
    let result = 0;
    let count = 0;
    let MOD = 1e9 + 7;
    for(const char of s){
        if(char === '1'){
            count = count + 1;
            result = (result + count) % MOD; // add count of subarrays ending with char = 1
        } else count = 0// reset
    }
    return result;
};