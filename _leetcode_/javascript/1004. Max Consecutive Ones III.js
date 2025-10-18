/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var longestOnes = function (nums, k) {
    let left = 0, right = 0;
    for (right = 0; right < nums.length; right++) {
        if (nums[right] === 0) k = k - 1 // converted 0 to 1 and moved
        if (k < 0) {
            if (nums[left] === 0) k = k + 1 // flip back to 1
            left++
        }
    }
    return right - left
};


// Partial PTO
// PTO = 3.5
// so 3 total + 0.5 extension
// check for days[left -1] and days[right+1] and extend by the decimal

// wholePto = int(pto)
// partial  = float(pto)

/*

l = 0
maxVacation = 0;
for(r in nums){
    if(nums[r] === 'W') wholePto -=1
    while(wholePto < 0){
        if(nums[left] === 'W') wholePto+=1
        left +=1
    }

    extension = 0.0
    if(left > 0 && days[left -1]==='W') 
        or if(right < len -1 && days[right + 1] === 'W') extension = partial
    maxVacation = max(maxVacation, right - left + 1 + extension)
}

*/