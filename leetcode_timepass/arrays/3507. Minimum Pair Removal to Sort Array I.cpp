
#define fastio ios_base::sync_with_stdio(false); cin.tie(nullptr); cout.tie(nullptr)


#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
#include <cmath>
#include <numeric>
#include <cstring>
#include <climits>
#include <iomanip>
#include <sstream>
#include <fstream>
#include <functional>
using namespace std;


/*

Given an array nums, you can perform the following operation any number of times:
    Select the adjacent pair with the minimum sum in nums. If multiple such pairs exist, choose the leftmost one.
    Replace the pair with their sum.
Return the minimum number of operations needed to make the array non-decreasing.
An array is said to be non-decreasing if each element is greater than or equal to its previous element (if it exists).  

Input: nums = [5,2,3,1]
Output: 2

Input: nums = [1,2,2]
Output: 0


I/p: [2,2,-1,3,-2,2,1,1,1,0,-1]
O/p : 9 

I/P : [-1]
O/p: 0

Constraints:

    1 <= nums.length <= 50
    -1000 <= nums[i] <= 1000

*/

int minimumPairRemoval(vector<int>& nums) {
    int operations = 0;

    if (nums.size() <= 1) {
        return 0;
    }
    
    while(nums.size() > 1){
        bool isNonDecreasing = true;
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] < nums[i-1]) {
                isNonDecreasing = false;
                break;
            }
        }

        if (isNonDecreasing) {
            return operations;
        }
        
        int minSum =nums[0] + nums[1];
        int minIndex = 0;
        for(int i = 1; i< nums.size() -1 ; i+=1){
            if(nums[i]+nums[i+1] < minSum){
                minSum = nums[i]+nums[i+1];
                minIndex = i;
            }
        }

        nums[minIndex] = minSum;
        nums.erase(nums.begin() + minIndex + 1);
        operations +=1;
    }

    return operations ;
}
