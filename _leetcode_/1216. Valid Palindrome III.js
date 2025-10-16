/**
 * @param {string} s
 * @param {number} k
 * @return {boolean}
 */


var isValidPalindrome = function (s, k) {

    let n = s.length
    const dp = Array(n+1).fill(0).map(() => Array(n+1).fill(0))
    let reverseS = [...s].reverse().join("");

    const LCSBetweenSAndItsReverse = findLCS();
    return n - LCSBetweenSAndItsReverse <= k

    function findLCS(){
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= n; j++) {
                if (s[i - 1] === reverseS[j - 1]) {
                    dp[i][j] = 1 + dp[i - 1][j - 1]
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
                }
            }
        }
        return dp[n][n]
    }
};