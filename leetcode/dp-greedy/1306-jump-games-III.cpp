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


bool canJumpIII_BFS(vector<int>& nums, int start) {
    queue<int> Q;
    // Use a queue for BFS traversal
    Q.push(start);
    while(Q.size()){
        start = Q.front(); Q.pop();
        if(nums[start] == 0) return true;
        if(nums[start] < 0) continue; // We have already visited this node
        if(start + nums[start] < nums.size()) Q.push(start + nums[start]);
        if(start - nums[start] >= 0) Q.push(start - nums[start]);
        nums[start] *= -1; // color visited node to not end up in infinite jumps.
    }
    return false;
}

bool canJumpIII_DFS(vector<int>& nums, int start) {
        bool isOOB = (start < 0 || start > nums.size());
        if(isOOB || nums[start] < 0) return false; // visited or OOB.
        return nums[start] == 0 || canJumpIII_DFS(nums, start + nums[start]) || canJumpIII_DFS(nums, start - nums[start]);
}
    
int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int n; int start;
        cin >> n >> start;
        vector<int> nums(n);
        for(int i =0; i<n; i+=1){
            cin >> nums[i];
        }
        cout << canJumpIII_BFS(nums, start) << endl;
        cout << canJumpIII_DFS(nums, start) << endl;

    }
    return 0;
}

// https://leetcode.com/u/archit91/
// https://leetcode.com/u/Cosmic_Phantom/