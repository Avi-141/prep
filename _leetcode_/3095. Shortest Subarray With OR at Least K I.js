// https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i/solutions/4961902/java-sliding-window-bit-frequency-table/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

// Brute Force O(n^2) time O(1) space as this has small constraints
var minimumSubarrayLength = function (nums, k) {
    const len = nums.length;
    let shortestSubLen = Infinity;
    let orTillNow;
    for (let i = 0; i < len; i++) {
        orTillNow = 0;
        for (let j = i; j < len; j++) {
            orTillNow |= nums[j];
            if (orTillNow >= k) shortestSubLen = Math.min(shortestSubLen, j - i + 1)
        }
    }
    return shortestSubLen === Infinity ? -1 : shortestSubLen
};
