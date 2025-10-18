/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumPairRemoval = function (nums) {
    let len = nums.length
    let count = 0;
    while (len > 1) {
        let nonDecreasing = true;
        let minSum = Infinity
        let minIndex = -1;
        for (let i = 0; i < len - 1; i++) {
            if (nums[i] > nums[i + 1]) nonDecreasing = false
            const sum = nums[i] + nums[i+1]
            if (sum < minSum) {
                minSum = sum
                minIndex = i;
            }
        }

        if(nonDecreasing){
            return count;
        }
        nums[minIndex] = minSum
        for (let i = minIndex + 1; i < len - 1; i++) nums[i] = nums[i + 1]
        len--;
        count++
    }
    return count;
};