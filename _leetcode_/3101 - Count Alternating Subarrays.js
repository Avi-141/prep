/**
 * @param {number[]} nums
 * @return {number}
 */
var countAlternatingSubarrays = function (nums) {
    let dp = Array(nums.length).fill(1); // min 1 
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1]) dp[i] = dp[i - 1] + 1
    }
    // can think of like prefix sum..

    const sum = dp.reduce((accumulator, currValue) => {
        return accumulator + currValue
    }, 0)

    return sum;
};


// Constant space... count streak
/**
 * @param {number[]} nums
 * @return {number}
 */
var countAlternatingSubarrays = function(nums) {
    let totalCount = 0;
    let currentStreak = 0;

    for (let i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] !== nums[i - 1]) {
            currentStreak++;
        } else {
            currentStreak = 1; // Resetting the streak
        }
        totalCount += currentStreak;
    }

    return totalCount;
};