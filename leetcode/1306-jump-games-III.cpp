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


int jump(vector<int>& nums, int start) {


    // We can jump to i + nums[i] or i - nums[i]
    
    /*

        Given an array of non-negative integers arr, you are initially positioned at start index of the array. 
        When you are at index i, you can jump to i + arr[i] or i - arr[i], check if you can reach any index with value 0.

        Notice that you can not jump outside of the array at any time.
        Example 1:

            Input: arr = [4,2,3,0,3,1,2], start = 5
            Output: true
            Explanation: 
            All possible ways to reach at index 3 with value 0 are: 
            index 5 -> index 4 -> index 1 -> index 3 
            index 5 -> index 6 -> index 4 -> index 1 -> index 3 

            Example 2:

            Input: arr = [4,2,3,0,3,1,2], start = 0
            Output: true 
            Explanation: 
            One possible way to reach at index 3 with value 0 is: 
            index 0 -> index 4 -> index 1 -> index 3

            Example 3:

            Input: arr = [3,0,2,1,2], start = 2
            Output: false
            Explanation: There is no way to reach at index 1 with value 0.

            Time Complexity for a case like: [1,1,1,1,1,1,1,0]
            //https://leetcode.com/problems/jump-game-iii/solutions/1618994/c-easy-to-solve-solution-beginner-friendly-algo-with-detailed-explanation-and-a-dry-run/

            https://leetcode.com/problems/jump-game-iii/solutions/1619031/c-python-simple-solution-w-explanation-dfs-bfs-traversals/

    */

}
    
    