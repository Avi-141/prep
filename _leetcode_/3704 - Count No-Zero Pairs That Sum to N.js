/**
 * @param {number} n
 * @return {number}
 */

// THIS WILL TLE due to constraints..
// we need digit dp approach with some dfs

// O(N/2*Log(N)) also wont cut it.. fuck.
var countNoZeroPairs = function (n) {
    // find closest zero dig num to n
    // subtract 1 from it and start with that pair
    // count half the pairs and double the answer
    // but n is too large.. we cannot recurse..
    const hasZero = (num) => {
        while (num > 0) {
            if (num % 10 === 0) return true;
            num = Math.floor(num / 10);
        }
        return false;
    };

    const half = Math.floor(n / 2);
    let count = 0;
    for (let a = 1; a <= Math.min(half, 10e7); a++) {
        const b = n - a;
        if (!hasZero(b) && !hasZero(a)) {
            if (a === b) count += 1;
            else count += 2;
        }
    }
    return count;
};



var countNoZeroPairs = function (n) {

}