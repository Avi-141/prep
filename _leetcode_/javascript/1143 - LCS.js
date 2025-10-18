// https://ics.uci.edu/~eppstein/161/960229.html
// https://leetcode.com/problems/longest-common-subsequence/editorial/



/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */


// Memoized Top Down DP approach
var longestCommonSubsequence = function (text1, text2) {
    const len1 = text1.length;
    const len2 = text2.length;

    let memo = Array(len1).fill(-1).map(() => Array(len2).fill(-1))

    function findLCS(p1, p2) {
        if (p1 === len1 || p2 === len2) return 0;
        if (memo[p1][p2] !== -1) return memo[p1][p2] // if we've gone through this path before

        let ans = 0;
        if (text1[p1] === text2[p2]) {
            ans = 1 + findLCS(p1 + 1, p2 + 1)
        } else {
            ans = Math.max(findLCS(p1, p2 + 1), findLCS(p1 + 1, p2))
        }
        memo[p1][p2] = ans;
        return memo[p1][p2]
    }

    return findLCS(0, 0)
};

// Bottom up DP approach
var longestCommonSubsequence = function (text1, text2) {
    const len1 = text1.length;
    const len2 = text2.length;

    let dp = Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0))

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                /*
                For the first case, we solve the subproblem that removes the first letter from each, and add 1. 
                In the grid this subproblem is always the diagonal immediately down and right.
                */
                dp[i][j] = 1 + dp[i - 1][j - 1]
            } else {
                /*
                For the second case, we consider the subproblem that removes the first letter off the first word, and then the subproblem that removes the first letter off the second word. In the grid, these are subproblems immediately right and below. */
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
                // this becomes dp[i][j] = 0 in case of Longest Common Substring
            }
        }
    }

    return dp[len1][len2]
}


// https://leetcode.com/discuss/post/1273766/longest-common-substring-by-vidhuv9-wz54/