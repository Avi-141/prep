
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


bool hasParityChange(int prev, int next) {
    return (prev % 2 != next % 2);
}


#include <vector>
#include <algorithm>
using namespace std;

long long solve(vector<int>& nums, int x) {
    long long oddScore = nums[0], evenScore = nums[0], score = nums[0];
    if (nums[0] % 2 == 0)
        oddScore -= x;
    else
        evenScore -= x;
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] % 2 == 0) {
            evenScore = max(evenScore + nums[i], oddScore + nums[i] - x);
            score = max(score, evenScore);
        } else {
            oddScore = max(oddScore + nums[i], evenScore + nums[i] - x);
            score = max(score, oddScore);
        }
    }
    return score;
}

/* 

TLE
        bool hasParityChange(int prev, int next) {
            return (prev % 2 != next % 2);
        }   
    
        long long maxScore(vector<int>& nums, int x) {
    
        //std::vector<std::pair<int, int>> parityChanges;
        //std::vector<std::pair<int, int>> parityChangeElements;
    
        int n = nums.size();
        // WOW
    
        /*
    
        FAILING TC:
        NUMS = [9,58,17,54,91,90,32,6,13,67,24,80,8,56,29,66,85,38,45,13,20,73,16,98,28,56,23,2,47,85,11,97,72,2,28,52,33]
        X = 90
        MY OUTPUT: 908
        REQUIRED OUTPUT 886
        Initially i was you initializing all entries to –1:
    
        vector<long long> dp(n, -1);
        dp[0] = nums[0];
    
    This means that if a valid move results in a score lower than –1, the dp value won’t update because –1 is already higher. For example, in the above test case the only way to get from index 0 to index 1 is to compute:
    
        From index 0 to 1:
        dp[1]=dp[0]+nums[1]−(penalty if parity changes)dp[1]=dp[0]+nums[1]−(penalty if parity changes)
        Since nums[0]=9nums[0]=9 (odd) and nums[1]=58nums[1]=58 (even), a penalty of x=90x=90 applies.
        So the valid score would be:
        dp[1]=9+58−90=−23.
        dp[1]=9+58−90=−23.
    
    However, because dp[1] is –1, the update is:
    
    dp[1] = max(dp[1], new_score) = max(-1, -23) = -1;
    
    This makes dp[1]artificially higher than it should be. When later transitions use this incorrect value, they overestimate the best achievable score. In failing test case test case this overestimation eventually leads to an output of 908 rather than the expected 886.
    
       vector<long long> dp(n, numeric_limits<long long>::min());
       dp[0] = nums[0];
       long long maxScore = 0;
   
       // The key part of the solution is to update dp[j] 
       // whenever we find a better way to reach j by moving from a previous position i
   
       for(int i = 0; i < n; i+=1){
           for(int j = i+1; j < n; j+=1){
               long long new_score = dp[i] + nums[j];
               if(hasParityChange(nums[i],nums[j])){
                   new_score -= x;
               }
                   dp[j] = max(dp[j], new_score);
           }
       }
   
           return *max_element(dp.begin(), dp.end());
       }
   };
*/


int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        int x;        
        vector<int> nums(n);
        for (int i = 0; i < n ; i++) {
                cin >> nums[i];
        }
        cin >> x;

        cout << solve(nums, x) << endl;
    }
    return 0;
}

/*

You are given a 0-indexed integer array nums and a positive integer x.

You are initially at position 0 in the array and you can visit other positions according to the following rules:

    If you are currently in position i, then you can move to any position j such that i < j.
    For each position i that you visit, you get a score of nums[i].
    If you move from a position i to a position j and the parities of nums[i] and nums[j] differ, then you lose a score of x.

Return the maximum total score you can get.

Note that initially you have nums[0] points.

 
Example 1:

Input: nums = [2,3,6,1,9,2], x = 5
Output: 13
Explanation: We can visit the following positions in the array: 0 -> 2 -> 3 -> 4.
The corresponding values are 2, 6, 1 and 9. Since the integers 6 and 1 have different parities, the move 2 -> 3 will make you lose a score of x = 5.
The total score will be: 2 + 6 + 1 + 9 - 5 = 13.

Example 2:

Input: nums = [2,4,6,8], x = 3
Output: 20
Explanation: All the integers in the array have the same parities, so we can visit all of them without losing any score.
The total score is: 2 + 4 + 6 + 8 = 20.

NUMS = [9,58,17,54,91,90,32,6,13,67,24,80,8,56,29,66,85,38,45,13,20,73,16,98,28,56,23,2,47,85,11,97,72,2,28,52,33]
X = 90
MY OUTPUT: 908
REQUIRED OUTPUT 886

*/



/*

// HINT: Think of each move as a state transition: staying in the same state (even to even or odd to odd) costs nothing extra, while switching states costs x.
*/