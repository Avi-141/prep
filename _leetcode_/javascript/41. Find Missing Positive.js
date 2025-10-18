/**
 * @param {number[]} nums
 * @return {number}
 */

// using the array itself as hash table.


// array size is n even if array is fill with smallest positive integers
// it can only contain first n integers that is [1, n] in that case n+1 will be answer
// but if any other elemnt like 0 , negative number or any number greater than n is present that mean one element out of [1,n] is missing
// took me a while to understand that array should have elements from 1 to n..
// just disregard the negative elements, they are useless.

// Index i represents whether number i+1 exists in the array
// The sign of nums[i] indicates if we've "seen" the number i+1

// For each number x in the array, we mark index x-1 as "visited"
// We mark by making the value at that index negative
// Math.abs(nums[i]) ensures we read the original value even if it's already been marked negative
function firstMissingPositive(nums) {
    for (let i=0;i<nums.length;i++) {
        if(nums[i] < 0) nums[i] = 0
    }
    // [3,4,-1,1] = [3,4,0,1]
    // [-3, -4, 0, -1]
    // therefore 2 is missing
    for (let i = 0; i < nums.length; i++) {
        let index = Math.abs(nums[i]) - 1; 
        // Numbers greater than n or less than 1 are irrelevant (can't be the answer)
        if(index >= nums.length || index < 0) continue;
        if(nums[index] > 0) nums[index] *= -1;
        else if(nums[index] === 0){
            nums[index] = -Infinity;
        }
    }

    for(let i=0;i<nums.length;i++){
        if(nums[i] >=0) return i+1
    }
    /*
        Why >= 0 is Correct
        When we check if(nums[i] >= 0), we're looking for positions that are still unvisited:

        nums[i] > 0: Positive numbers (never marked as visited)
        nums[i] = 0: Zeros that were never marked (meaning the number i+1 was never seen)
        Both cases indicate that number i+1 is missing from the original array.

        Example to Illustrate
        Consider array [1, 0, 3]
        marking: [-1, 0, -3]
        >=0 means 2 is missing.. (index 1), return i+1

    */
    return nums.length + 1

};


// Cyclic Sort
// Place each number in its "correct" position: 
// number 1 should be at index 0, number 2 at index 1, etc.
// After sorting, the first position that doesn't contain its expected value reveals the missing number
function firstMissingPositiveCyclicSort(nums) {
    let i = 0;
    
    // Place each number in its correct position
    while (i < nums.length) {
        let correctIndex = nums[i] - 1; // number nums[i] should be at index nums[i]-1
        
        // Only swap if:
        // 1. Number is in valid range [1, n]
        // 2. Number is not already in correct position
        if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[correctIndex]) {
            // Swap nums[i] with nums[correctIndex]
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++; // Move to next position only if no swap needed
        }
    }
    
    // Find first position where expected number is missing
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    // All numbers [1, n] are present, so answer is n+1
    return nums.length + 1;
}

/*
Example walkthrough: [3, 4, -1, 1]

Initial: [3, 4, -1, 1]
i=0: nums[0]=3, should be at index 2. Swap with nums[2]=-1
     [−1, 4, 3, 1]
i=0: nums[0]=-1, invalid (negative), move to i=1
i=1: nums[1]=4, should be at index 3. Swap with nums[3]=1
     [−1, 1, 3, 4]
i=1: nums[1]=1, should be at index 0. Swap with nums[0]=-1
     [1, −1, 3, 4]
i=1: nums[1]=-1, invalid, move to i=2
i=2: nums[2]=3, already at correct position (index 2), move to i=3
i=3: nums[3]=4, already at correct position (index 3), done

Final: [1, −1, 3, 4]
Check: nums[1] ≠ 2, so answer is 2
*/