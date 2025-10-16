/**
 * @param {number[]} nums
 * @return {number[][]}
 */

var subsets = function(nums) {
    const acc = [];
    
    function recur(acc, ns, path, start) {
        // Base case: processed all elements
        if (ns.length === start) {
            acc.push([...path]); // clone the current path
            return;
        }
        
        // take ns[start]
        path.push(ns[start]);
        recur(acc, ns, path, start + 1);
        path.pop(); // backtrack
        recur(acc, ns, path, start + 1);
    }
    
    recur(acc, nums, [], 0);
    return acc;
};

var subsets = function (nums) {
    let result = [[]]; // start with empty subset.
    for (let num of nums) {
        const newSubsets = [];
        // console.log('result till now', result)
        for (let subset of result) {
            // console.log('subset', subset, num)
            // append num to each existing subset
            newSubsets.push([...subset, num])
        }
        result = result.concat(newSubsets)
        // console.log('next Result', result)
    }
    return result;
}

// https://leetcode.com/problems/subsets/?envType=problem-list-v2&envId=backtracking
// https://leetcode.com/problems/subsets/solutions/27278/c-recursive-iterative-bit-manipulation/?envType=problem-list-v2&envId=backtracking
// https://leetcode.com/problems/subsets/solutions/27281/a-general-approach-to-backtracking-questions-in-java-subsets-permutations-combination-sum-palindrome-partitioning/?envType=problem-list-v2&envId=backtracking