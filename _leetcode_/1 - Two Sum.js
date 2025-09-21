/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // x, target - x
    const map = new Map();
    /*map.set('key', 'value');
    map.get('key');
    map.has('key');
    map.delete('key');
    */
    for(let i=0;i<nums.length;i++){
        let diff = target - nums[i];
        if(map.has(diff)){
            return [i, map.get(diff)]
        }else{
            map.set(nums[i], i)
        }
    }
};