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

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> maxWindow;
        deque<int> dq;

        for (int i = 0; i < nums.size(); i++) {
            // if we index is out of window, remove it from front
            // if number at back (max) is less than next, remove max as we got
            // new max keep sequeue decreasing

            if (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            dq.push_back(i); // got new max

            if (i >= k - 1) {
                int dqMaxIndex = dq.front();
                maxWindow.push_back(nums[dqMaxIndex]);
            } // get maximum for current window of k
        }

        return maxWindow;
    }
};

// The key why monotonic deque works is it stores both magnitude and position information. 
// From head to tail, the elements get smaller and further to the right of the array.