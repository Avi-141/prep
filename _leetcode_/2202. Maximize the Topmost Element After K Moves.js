/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maximumTop = function(nums, k) {
    const n = nums.length;

    // Case 1: Only one element and an odd number of moves.
    // We must remove the element, and with the remaining even moves,
    // we can only add/remove, leaving the pile empty in the end.
    if (n === 1 && k % 2 === 1) {
        return -1;
    }

    // Case 2: Very few moves (k=0 or k=1).
    // If k=0, we do nothing, top is nums[0].
    // If k=1, we pop nums[0], new top is nums[1].
    // Note: The case of n=1, k=1 is handled by Case 1.
    // If nums is empty, nums[k] will be undefined which works if we need to return -1 for empty result.
    // However, constraints say nums.length >= 1, so nums[k] is safe to access if k < n.
    if (k < 2) {
        return nums[k] === undefined ? -1 : nums[k];
    }
    
    // Case 3: More moves than elements in the pile (or equal).
    // This means we can remove every element.
    if (k >= n) {
        // If k > n, we can remove all elements and add the absolute max back.
        // If k = n, we can remove all n-1 elements, and for the last move,
        // add the max of the removed elements back. 
        // We cannot simply pop all because the pile would be empty.
        const subArray = nums.slice(0, n - (k === n ? 1 : 0));
        // If subArray is empty (e.g., nums=[1], k=1), Math.max returns -Infinity.
        return subArray.length > 0 ? Math.max(...subArray) : -1;
    }

    // Case 4: Standard case (k >= 2 and k < n).
    // We have two main options to get the maximum top element:
    // Option A: Pop k elements. The new top is `nums[k]`.
    // Option B: Pop k-1 elements, then use the last move to push back the
    // largest element among the ones we just popped.
    // The largest among the first k-1 elements is `Math.max(...nums.slice(0, k - 1))`.
    const max_in_prefix = Math.max(...nums.slice(0, k - 1));
    
    // The answer is the best outcome between Option A and Option B.
    return Math.max(nums[k], max_in_prefix);
};