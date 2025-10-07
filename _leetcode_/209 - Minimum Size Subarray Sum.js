/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */

// Sliding Window (O(n))
var minSubArrayLen = function(target, nums) {
    let left = 0;
    let sum = 0;
    let minLen = Infinity;
    
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        
        // Shrink window from left while sum >= target
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    
    return minLen === Infinity ? 0 : minLen;
};


// Binary search on prefix sums
// note that arary has + elements only so no issue
// if negative then tricky
var minSubArrayLen = function(target, nums) {
    const N = nums.length;
    const pref = new Array(N + 1).fill(0);
    
    for (let i = 0; i < N; i++) {
        pref[i + 1] = pref[i] + nums[i];
    }
    
    let minLen = Infinity;
    
    // Try all possible starting positions.. as we need to check for all windows
    for (let start = 0; start < N; start++) {
        // Binary search for the smallest end position where sum >= target
        let left = start, right = N - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const sum = pref[mid + 1] - pref[start];
            
            if (sum >= target) {
                minLen = Math.min(minLen, mid - start + 1);
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    }
    
    return minLen === Infinity ? 0 : minLen;
};

//https://leetcode.com/problems/minimum-size-subarray-sum/solutions/3725912/generalization-for-negative-numbers-o-n-time-memory/
//https://emre.me/coding-patterns/sliding-window/