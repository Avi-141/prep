/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

// all elements are >=1 this is very important
// since its product we can just loop throigh once
// if array had negative elements, then it becomes tricky

/*
The idea is always keep an max-product-window less than K;
Every time shift window by adding a new number on the right(j), if the product is greater than k, then try to reduce numbers on the left(i), until the subarray product fit less than k again, (subarray could be empty); Each step introduces x new subarrays, where x is the size of the current window (j + 1 - i);
*/

var numSubarrayProductLessThanK = function (nums, k) {
    // Edge case: if k <= 1, no positive product can be less than k
    if (k <= 1) return 0;
    
    let product = 1
    let cnt = 0;
    let left = 0
    for (let right = 0; right < nums.length; right++) {
        product *= nums[right];
        while (product >= k) {
            product = product / nums[left]; // shrink window from left
            left++;
        }
        cnt = cnt + (right - left + 1)
    }
    return cnt;
};

//If the product till the current index is smaller than k, then its is sure that every element in the window is smaller than k.


// Brute Force
var numSubarrayProductLessThanK_bruteForce = function (nums, k) {
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
        let product = 1;
        for (let j = i; j < nums.length; j++) {
            product *= nums[j];
            if (product < k) {
                count++;
            } else {
                break; // No point continuing as product will only increase
            }
        }
    }
    return count;
};

// using reduce to practice
var numSubarrayProductLessThanK_functional = function (nums, k) {
    if (k <= 1) return 0;
    
    return nums.reduce((acc, curr, right) => {
        acc.product *= curr;
        
        while (acc.product >= k && acc.left <= right) {
            acc.product /= nums[acc.left];
            acc.left++;
        }
        
        acc.count += right - acc.left + 1;
        return acc;
    }, { product: 1, left: 0, count: 0 }).count;
};

// Using logarithms (handles edge cases differently)
var numSubarrayProductLessThanK_logarithmic = function (nums, k) {
    if (k <= 1) return 0;
    
    // Convert to log space to avoid overflow and use prefix sums
    const logK = Math.log(k);
    const logNums = nums.map(num => Math.log(num));
    
    let count = 0;
    let left = 0;
    let logSum = 0;
    
    for (let right = 0; right < nums.length; right++) {
        logSum += logNums[right];
        
        while (logSum >= logK) {
            logSum -= logNums[left];
            left++;
        }
        
        count += right - left + 1;
    }
    
    return count;
};

// log(a × b × c) = log(a) + log(b) + log(c)
// So instead of checking: product < k
// We check: log(product) < log(k) Which becomes: sum_of_logs < log(k)

/**

1. SLIDING WINDOW fails because:
   - Product can go from large positive → small positive → large negative → small negative
   - Window shrinking logic breaks down
   - Can't simply shrink from left when product becomes "too big"

2. LOGARITHMIC APPROACH fails because:
   - log(negative number) is undefined in real numbers
   - Even if we use complex logarithms, the ordering breaks down

EXAMPLE: nums = [2, -3, 4, -1], k = 5
- Subarray [2] has product 2 < 5 ✓
- Subarray [2, -3] has product -6. Is -6 < 5? 🤔
- Subarray [2, -3, 4] has product -24 < 5 ✓  
- Subarray [2, -3, 4, -1] has product 24 > 5 ✗
*/

// ✅ SOLUTION 1: Brute Force (always works)
function subarrayProductLessThanK_withNegatives_bruteForce(nums, k) {
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
        let product = 1;
        for (let j = i; j < nums.length; j++) {
            product *= nums[j];
            if (product < k) {
                count++;
            }
            // Note: We DON'T break here because product might become small again
        }
    }
    
    return count;
}

// Track signs and absolute values separately
function subarrayProductLessThanK_withNegatives_signTracking(nums, k) {
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
        let absProduct = 1;
        let negativeCount = 0;
        
        for (let j = i; j < nums.length; j++) {
            absProduct *= Math.abs(nums[j]);
            if (nums[j] < 0) negativeCount++;
            
            // Calculate actual product
            let actualProduct = negativeCount % 2 === 0 ? absProduct : -absProduct;
            
            if (actualProduct < k) {
                count++;
            }
        }
    }
    
    return count;
}

// Dynamic Programming approach
function subarrayProductLessThanK_withNegatives_dp(nums, k) {
    let count = 0;
    
    // For each starting position
    for (let start = 0; start < nums.length; start++) {
        let product = 1;
        
        // Extend the subarray
        for (let end = start; end < nums.length; end++) {
            product *= nums[end];
            
            if (product < k) {
                count++;
            }
        }
    }
    
    return count;
}