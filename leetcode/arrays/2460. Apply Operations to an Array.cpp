
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


// Brute force with extra space
vector<int> applyOperations(vector<int>& nums) {
    vector<int> ans(nums.size());
    for(int i=0;i<nums.size();i+=1){
        for(int j=1;j<nums.size();j+=1){
            if(nums[i] == nums[j]){
                nums[i]*=2;
                nums[j]=0;
            }
        }
    }
    int countZero = 0;
    for(int i=0;i<nums.size();i++){
        if(nums[i]){
            ans.push_back(nums[i]);
        }else countZero++;
    }
    while(countZero --){
        ans.push_back(0);
    }
    return ans;
}

vector<int> applyOperations_OnePass(vector<int>& nums) {
    vector<int> ans;
    int j =0;
    // re-order array in place.
    // j will either be equal to i or to an index containing 0.
    int N = nums.size();
    for (int i = 0; i < N ; i += 1) {
            if (i+1 < N && nums[i] == nums[i+1]) {
                nums[i] *= 2;
                nums[i+1] = 0;
            }
            if(nums[i]!=0){
                swap(nums[i],nums[j]);
                j += 1;
            }
    }
    return nums;
}

int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> nums(n);
        applyOperations(nums);
    }
}