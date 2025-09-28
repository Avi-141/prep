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

    For each index, the algorithm calculates the maximum reachable index, updating the array in place. 
    For any index i, it computes max(nums[i] + i, nums[i-1]). 
    The goal is to store the maximum reachable index at each position.
    The next step uses a greedy approach: starting from index 0, it jumps to the furthest reachable index based on the prefix maximum array, updating the index and incrementing the jump count until reaching the last index

*/
int jump(vector<int>& nums) {

    for(int i = 1; i < nums.size(); i++){
        nums[i] = max(nums[i] + i, nums[i-1]);
    }

    int ind = 0;
    int jumps = 0;

    while(ind < nums.size() - 1){
        jumps++;
        ind = nums[ind];
    }

    return jumps;
}
    
    