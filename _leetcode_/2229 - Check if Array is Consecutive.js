/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isConsecutive = function(nums) {
    const lowerBound = Math.min(...nums);
    const upperBound = lowerBound + nums.length - 1;
    const max = Math.max(...nums);
    const len = nums.length;
    let set = new Set(nums);

    if(upperBound < max) return false;
    if(len === 1) return true;

    for(let i = lowerBound + 1; i <= upperBound;i++){
        if(!set.has(i)) return false
    }
    return true;
}

// Math
// range is from [x, x+n-1]
// we can sum up first x+n-1 elements
// then subtract sum of first x-1 elements
// this gives sum of elements from x to x+n-1;
// if sum of nums = diff above, then we have all elements.
// [3,7,5,4,6] = 25
// range = [3,7]
// 7*8/2 - (2)*3/2 = 25
// but for test case [0,3,0,3] = 6
// 0+1+2+3 = 6
// range = [0,3]
// wont work here..
// / Sum-based approach:
// - Track minimum value and ensure all elements are unique.
// - Compute actual sum of the array.
// - Expected sum for the sequence [min ... min+len-1]:
//     total_n = n*(n+1)/2, so expected = total_{min+len-1} - total_{min-1}.
// - Return true if actual sum matches expected sum.
var isConsecutive = function(nums) {
    const len = nums.length;
    if (len <= 1) return true;
    let min = Infinity;
    let sum = 0;
    const seen = new Set();
    for (const num of nums) {
        sum += num;
        if (num < min) min = num;
        if (seen.has(num)) return false;
        seen.add(num);
    }
    const n = min + len - 1;
    const m = min - 1;
    const expectedSum = (n * (n + 1) / 2) - (m * (m + 1) / 2);
    return expectedSum === sum;
};