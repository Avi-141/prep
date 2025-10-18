/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    // x, target - x
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        let diff = target - nums[i];
        if (map.has(diff)) {
            // return current index and index of complement.
            return [i, map.get(diff)]
        }
        map.set(nums[i], i)
    }
    //  Problem guarantees exactly one solution, so we never fall through.

};