/**
 * @param {number[]} nums
 * @return {number[][]}
 */

/*
Given an integer array nums, 
return all the triplets [nums[i], nums[j], nums[k]] 
such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
the solution set must not contain duplicate triplets.
*/

var threeSum = function (nums) {
    // sort and two pointer
    nums.sort((a, b) => a - b);
    let res = [];
    // only need to consider numbers <= 0 as the first element of a triplet.
    // If the smallest number is > 0, no three numbers can sum to 0.
    for (let i = 0; i < nums.length && nums[i] <= 0; ++i)
        // Skip duplicate values for the first element of the triplet.
        if (i === 0 || nums[i - 1] !== nums[i]) { // fixed number is same
            twoSumII(nums, i, res);
        }
    return res;
};

let twoSumII = function (nums, i, res) {
    // target is 0 here..
    // lo and hi, to find the other two numbers in the triplet.
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
        let sum = nums[i] + nums[lo] + nums[hi];
        // below if and else if
        // ensures that for a fixed nums[i], 
        // any given pair of (nums[lo], nums[hi]) can only be processed once.
        if (sum < 0) {
            // If the sum is too small, 
            // move the left pointer to the right to increase the sum.
            ++lo;
        } else if (sum > 0) {
            // If the sum is too large, 
            // move the right pointer to the left to decrease the sum.
            --hi;
        } else {
            // Found a triplet.
            res.push([nums[i], nums[lo++], nums[hi--]]);
            // Skip duplicate values for the second element of the triplet.
            while (lo < hi && nums[lo] == nums[lo - 1]) ++lo;
            // third element duplicates already handled as pointer has moved..
        }
    }
};