var maxProduct = function (nums) {
    if (nums.length === 0) return 0;
    let maxSoFar = nums[0]
    let minSoFar = nums[0]
    let result = maxSoFar;


    for (let i = 1; i < nums.length; i++) {
        let current = nums[i]
        let tempMax = Math.max(current, maxSoFar * current, minSoFar * current)
        minSoFar =  Math.min(current, maxSoFar*current, minSoFar*current)
        // negative if 
        // can be turned into largerpos
        maxSoFar = tempMax;
        result = Math.max(maxSoFar, result)

    }

    return result;
};