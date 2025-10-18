/**
 * @param {number[]} data
 * @return {number}
 */

// Sliding Window Approach:
// 1. Count total 1s - this becomes our window size
// 2. Slide a window of that size across the array
// 3. For each window, count how many 0s are inside
// 4. The minimum number of 0s in any window = minimum swaps needed

var minSwaps = function(data) {
    // Count total number of 1s (this will be our window size)
    let numOnes = 0;
    for(const num of data) numOnes += num // just 0 or 1
    // if no 1s or all are 1s, no swaps needed
    if (numOnes === 0 || numOnes === data.length) return 0;
    
    // Initialize first window and count 0s in it
    // easier to read and setup the soln
    let zerosInWindow = 0;
    for (let i = 0; i < numOnes; i++) {
        if (data[i] === 0) {
            zerosInWindow++;
        }
    }
    
    // for first window we've found these many zeroes.
    let minZeros = zerosInWindow;
    
    // Slide the window across the rest of the array
    for (let i = numOnes; i < data.length; i++) {
        // Remove the leftmost element from window
        if (data[i - numOnes] === 0) {
            zerosInWindow--;
        }
        // Add the new rightmost element to window
        if (data[i] === 0) {
            zerosInWindow++;
        }

        minZeros = Math.min(minZeros, zerosInWindow);
    }
    
    // The minimum zeros in any window = minimum swaps needed
    return minZeros;
};

/*
Example walkthrough: [1,0,1,0,1]

numOnes = 3 (window size = 3)
First window [1,0,1] → zerosInWindow = 1, minZeros = 1

Slide window:
- Window [0,1,0]: Remove data[0]=1, add data[3]=0 → zerosInWindow = 2
- Window [1,0,1]: Remove data[1]=0, add data[4]=1 → zerosInWindow = 1

minZeros = 1, so answer is 1

Intuition: We need a contiguous subarray of length 3 (total 1s) that has 
minimum 0s. The window with minimum 0s needs minimum swaps to become all 1s.

Why this works:
- If we want all 1s grouped together, we need a contiguous segment of length = total 1s
- The number of swaps needed = number of 0s currently in that optimal segment
- We try all possible segments of the right length and pick the one with minimum 0s

Time Complexity: O(n) - single pass to count 1s + single pass to slide window
Space Complexity: O(1) - only using a few variables
*/