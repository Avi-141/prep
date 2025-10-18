/**
 * @param {number[]} calories
 * @param {number} k
 * @param {number} lower
 * @param {number} upper
 * @return {number}
 */
var dietPlanPerformance = function (calories, k, lower, upper) {
    let cals = 0;
    let pts = 0;

    // Initialize first window of size k
    for (let i = 0; i < k; i++) {
        cals += calories[i];
    }

    // Check first window
    if (cals > upper) pts += 1;
    else if (cals < lower) pts -= 1;

    // Slide the window across the rest of the array
    for (let i = k; i < calories.length; i++) {
        // Remove leftmost element, add rightmost element
        const leftmost = calories[i - k]
        const rightmost = calories[i]
        cals = cals - leftmost + rightmost

        // Check current window
        if (cals > upper) pts += 1;
        else if (cals < lower) pts -= 1;
    }

    return pts;
};

/*
Sliding Window Approach:
1. Fixed window size of k days
2. Calculate sum for first window
3. Slide window: remove left element, add right element
4. For each window, check if sum is above upper (+1 point) or below lower (-1 point)

Example: calories = [1,2,3,4,5], k = 3, lower = 3, upper = 3
- Window [1,2,3]: sum = 6 > 3 → +1 point
- Window [2,3,4]: sum = 9 > 3 → +1 point  
- Window [3,4,5]: sum = 12 > 3 → +1 point
Total: 3 points

Time: O(n), Space: O(1)
*/

//https://emre.me/coding-patterns/sliding-window/