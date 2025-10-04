/**
 * @param {number[]} nums
 * @return {number}
 */
var zeroFilledSubarray = function(nums) {
    let numSubarrays = 0;
    let streakOfZeroes = 0;
    for(let num of nums){
        if(num === 0){
            // 00 -> 0,0,00 = 3
            streakOfZeroes+=1;
            numSubarrays = numSubarrays + streakOfZeroes;
        }else streakOfZeroes = 0 // new subgroup.
    }
    return numSubarrays;
};