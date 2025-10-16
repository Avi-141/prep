/**
 * @param {number[]} nums
 * @return {boolean}
 */


function canJumpFromPosition_Recurse(pos, nums) {
    const nMinus1 = nums.length - 1
    if (pos === nMinus1) return true // we've reached n - 1
    let farthestJump = Math.min(nums[pos] + pos, nMinus1) // where can jump from given curr pos and last index.
    for (let nextPos = pos + 1; nextPos <= farthestJump; nextPos++) {
        if (canJumpFromPosition(nextPos, nums)) return true;
    }
    return false
}

function canJumpFromPosition_Simple(pos, nums) {
    if (pos === nums.length - 1) return true
    if (nums[pos] === 0) return false // cannot jump.
    let reach = nums[pos] + pos;

    for (let jump = pos + 1; jump <= reach; jump++) {
        if (jump <= nums.length - 1 && canJumpFromPosition_Simple(jump, nums)) return true
    }
    return false
}
// now we will apply memoization to this dp.
let memo;
// for each position in array index can be good = 1, bad = 0 or unknown = -1
// initially all are -1
function canJumpFromPosition_TopDown(pos, nums) {
    if (memo[pos] !== -1) {
        return memo[pos] === 1 // is it good or not? 
    }
    let farthestJump = Math.min(nums.length - 1, nums[pos] + pos)
    for (let nextPos = pos + 1; nextPos <= farthestJump; nextPos++) {
        if (canJumpFromPosition_TopDown(nextPos, nums)) {
            memo[pos] = 1;
            return true
        }
    }
    memo[pos] = 0;
    return false
}


// we always jump to the right.
// so if we start from backwards (end of array) we will query for a pisition
function canJumpFromPosition_BottomUp(pos, nums) {
    memo = new Array(nums.length).fill(false);
    memo[nume.length - 1] = true;
    for (let i = nums.length - 2; i >= 0; i--) {
        const farthestJump = Math.min(i + nums[i], nums.length - 1);
        for (let j = i + 1; j <= farthestJump; j++) {
            if (memo[j]) {
                memo[i] = true;
                break; // path found so dont need to check fruther for this i
            }
        }
    }
    return memo[0]
}

/*

Imagine you have a car, and you have some distance to travel (the length of the array). This car has some amount of gasoline, and as long as it has gasoline, it can keep traveling on this road (the array). Every time we move up one element in the array, we subtract one unit of gasoline. However, every time we find an amount of gasoline that is greater than our current amount, we "gas up" our car by replacing our current amount of gasoline with this new amount. We keep repeating this process until we either run out of gasoline (and return false), or we reach the end with just enough gasoline (or more to spare), in which case we return true.
Note: We can let our gas tank get to zero as long as we are able to gas up at that immediate location (element in the array) that our car is currently at.

*/
function canJumpFromPosition_Greedy(nums) {
    let gas = 0;
    for(const n of nums){
        if(gas < 0) return false
        else if(n > gas) gas = n
        gas = gas - 1;
    }
    return true;
}
// Brute force recursion
var canJump = function (nums) {
    //return canJumpFromPosition_Recurse(0, nums)
    //memo = new Array(nums.length).fill(-1);
    //memo[memo.length -1] = 1; // last index by itself is a good position so mark as 1..
    //return canJumpFromPosition_TopDown(0, nums)
    // return canJumpFromPosition_BottomUp(0, nums)
    return canJumpFromPosition_Greedy(nums)
};

