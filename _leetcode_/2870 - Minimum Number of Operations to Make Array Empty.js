/*
You are given a 0-indexed array nums consisting of positive integers.
There are two types of operations that you can apply on the array any number of times:

Choose two elements with equal values and delete them from the array.
Choose three elements with equal values and delete them from the array.
Return the minimum number of operations required to make the array empty, or -1 if it is not possible.
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
    let countMap = new Map();
    for (const num of nums) {
        const prev = countMap.get(num) || 0;
        countMap.set(num, prev + 1);
    }

    const counts = countMap.values(); // iterable keys of map, MapIterator
    const countsArr = Array.from(counts); // convert to array
    let total = 0;
    let track = 0;
    for (let count of countsArr) {
        if (count === 1) return -1
        if (count % 2 === 0) {
            let ops = count / 2
            total += ops
            track += count;
        }
        if (count % 3 === 0) {
            let ops = count / 3
            total += ops;
            track += count;
        }
    }
    if (track === nums.length) return total
    return -1;
};
// This is wrong as it directly computes count rather than optimal way to clean up the array.
// TC [14,12,14,14,12,14,14,12,12,12,12,14,14,12,14,14,14,12,12]
// Ans should be 7 i get 8.



/**
 * @param {number[]} nums
 * @return {number}
 */

// Implement minimum operations by solving 2x + 3y = count for each value count
var minOperations = function(nums) {
    const countMap = new Map();
    for (const num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }
    let totalOps = 0;
    for (const count of countMap.values()) {
        if (count === 1) return -1;
        // for occurences like 4, 7, 10 
        // we can split it into: 4 = 2opns, 7 = 2,2,3 = 3 opns and so on
        // each of these values is basiaclly num/3 ceil.
        const triples = Math.floor(count / 3);
        const rem = count % 3;
        let ops;
        if (rem === 0) {
            ops = triples;
        } else if (rem === 1) {
            // use one fewer triple and two pairs to cover remainder 4
            ops = triples - 1 + 2;
        } else { // rem === 2
            // one extra pair covers remainder
            ops = triples + 1;
        }
        totalOps += ops;
    }
    return totalOps;
};