/**
 * @param {number} n
 * @return {number}
 */
var closestFair = function (n) {
    // if its odd length number, get next higher order
    while (true) {
        let stringNum = String(n);
        // 403 -> 10^3 = 1000
        if (stringNum.length & 1) {
            n = Math.pow(10, stringNum.length)
            stringNum = String(n)
        }

        let odd = 0, even = 0;
        for(const char of stringNum){
            if(Number(char) & 1) odd++
            else even++
        }

        if(odd === even) return n;
        n+=1
    }
    return -1; // it'll never reach here.
};