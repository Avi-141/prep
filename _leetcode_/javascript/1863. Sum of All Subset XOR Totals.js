/**
 * @param {number[]} nums
 * @return {number}
 */
var subsetXORSum = function(nums) {
    let subsets = [];

    function XORSum(start, currXor){
        // all nums have been considered..
        if(start === nums.length) return currXor

        let withElement = XORSum(start+1, currXor ^ nums[start])
        let withoutElement = XORSum(start+1, currXor)
        return withElement + withoutElement;
    }


    /*
    function findSubsets(start, path){
        if(start === nums.length) {
            subsets.push([...path])
            return;
        }

        path.push(nums[start])
        findSubsets(start+1, path)
        path.pop()
        findSubsets(start+1, path)
    }

    function xorSubsets(){
        let result = 0;
        findSubsets(0, [])
        for(const sub of subsets){
            let total = 0;
            for(const num of sub){
                total^= num;
            }
            result+=total;
        }
        return result;
    }*/

    return XORSum(0,0)
};