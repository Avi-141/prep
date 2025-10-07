/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

// brute force
var subarraySum = function (nums, k) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let j = i; j < nums.length; j++) {
            sum += nums[j];  // Add current element to running sum
            if (sum === k) {
                count++;
            }
        }
    }

    return count;
};

// prefix sum approach... no optimization as such here.../
// but prolly we can store pref sums in map
var subarraySum = function (nums, k) {
    const pref = Array(nums.length).fill(0)
    pref[0] = nums[0]
    for (let i = 1; i < nums.length; i++) {
        pref[i] = pref[i - 1] + nums[i];
    }

    let cnt = 0;
    for (let start = 0; start < nums.length; start++) {
        for (let end = start; end < nums.length; end++) {
            const sum = start === 0 ? pref[end] : pref[end] - pref[start - 1];
            if (sum === k) cnt++;
        }
    }
    return cnt;
}

// approach using HashMap
var subarraySum = function (nums, k) {
    const hashmap = new Map();
    hashmap.set(0, 1); //  0 sum having count 1
    
    let prefixSum = 0;
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        
        // Two sum variation with prefix logic
        // (prefixSum - k) exists in map
        if (hashmap.has(prefixSum - k)) {
            // if yes then increase sum count
            count += hashmap.get(prefixSum - k);
        }
        
        hashmap.set(prefixSum, (hashmap.get(prefixSum) || 0) + 1);
    }
    
    return count;
};

//https://leetcode.com/problems/subarray-sum-equals-k/description/