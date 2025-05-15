
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

//[3,2,1]
// [1,4,3,3,2]
// [3,3,3]
/*

int length_longest_incr_subarray(vector<int>& nums) {
    int maxLength =1;
    for(int i =0; i< nums.size(); i++){
        int currLength =1;
        for(int j=i+1; j< nums.size();j+=1){
            if(nums[j] > nums[j-1]){
                currLength +=1;
            }else{
                break;
            }
        }
        maxLength = max(maxLength, currLength);
    }
    return maxLength;
}


int length_longest_decr_subarray(vector<int>& nums) {
    int maxLength =1;
    for(int i =0; i< nums.size(); i++){
        int currLength =1;
        for(int j=i+1; j< nums.size();j+=1){
            if(nums[j] < nums[j-1]){
                currLength +=1;
            }else{
                break;
            }
        }
        maxLength = max(maxLength, currLength);
    }
    return maxLength;
}
    
*/


int length_incr_decr_subarray(vector<int> &nums){
    int maxLen = 1;
    int incrLen = 1;
    int decrLen = 1;
    for (int i=1; i< nums.size(); i++){
        if(nums[i] > nums[i-1]){
            incrLen +=1;
            decrLen = 1;
        }else if(nums[i] < nums[i-1]){
            incrLen =1;
            decrLen +=1;
        }else incrLen =1, decrLen =1; // Same number.
        maxLen = max(maxLen, max(incrLen,decrLen));
    }
    return maxLen;
}

int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> nums(n);
        //cout << max(length_longest_decr_subarray(nums), length_longest_incr_subarray(nums)) << endl;
        cout << length_incr_decr_subarray(nums);
    }
    return 0;
}

