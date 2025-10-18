/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */

// Approach 3 (Binary Search Window):
// We search for the start index 'left' in [0..n-k] such that the k-length window is closest to x.
// In that comparison, prefer writing:
//    x - arr[mid] > arr[mid + k] - x
// instead of using absolute values: Math.abs(x - arr[mid]) > Math.abs(arr[mid + k] - x)
// This non-absolute form handles edge cases where arr[mid] == arr[mid+1] (or sequences of identical numbers),
// ensuring ties move the left bound correctly and maintain the required ordering.

// FAILS ON EDGE CASE DUE TO COMPARISION OF ABSOLUTE VALUE
var findClosestElements = function(arr, k, x) {
    // shrink window until its size is k
    let lo = 0, hi = arr.length - 1;
    while (hi - lo + 1 > k) {
        // Remove the element farther from x
        if (Math.abs(arr[lo] - x) > Math.abs(arr[hi] - x)) {
            lo++;
        } else {
            hi--;
        }
    }
    return arr.slice(lo, hi + 1);
};

// abs approach fails on 2 test cases.

/*
Here's my one-liner intuition for it: 
you can rearrange x - arr[mid] > arr[mid + k] - x to be 
x > (arr[mid] + arr[mid + k]) / 2. 
That is, we're asking "is x greater than the midpoint 
between arr[mid] and arr[mid + k]?", 
or equivalently "is x closer to arr[mid + k] than arr[mid]"?

The reason this works and abs(arr[mid] - x) > abs(arr[mid + k] - x) DOES NOT, is because we're shifting the meaning of this statement: instead of asking about the distance between x and our endpoints, we're asking about what side of their midpoint x is on. This means that even in the pathological case where arr[mid] = arr[mid + k] = their midpoint, as long as x > midpoint, we'll get the right answer
*/

// https://leetcode.com/problems/find-k-closest-elements/editorial/comments/1197180/?parent=1052417


/*
Notice here are 3 possible cases:
1. x <= arr[mid] < arr[mid+k]
2. arr[mid] <= x <= arr[mid+k]
3. arr[mid] < arr[mid+k] <= x
Now notice that for each one of the cases 
x > ( arr[mid] + arr[mid + k])/2 
forces you to move right and 
the opposite force you to move left in the search
*/

var findClosestElements = function(arr, k, x) {
    // shrink window until its size is k
    let lo = 0, hi = arr.length - 1;
    while (hi - lo + 1 > k) {
        // Remove the element farther from x
        if ((arr[lo] + arr[hi])/2 < x) {
            lo++;
        } else {
            hi--;
        }
    }
    return arr.slice(lo, hi + 1);
};