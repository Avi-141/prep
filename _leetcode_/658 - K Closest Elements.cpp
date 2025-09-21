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

vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int n = arr.size();
    if (k >= n) return arr;
    if (x <= arr[0]) {
        return vector<int>(arr.begin(), arr.begin() + k);
    }
    if (x >= arr[n - 1]){
        return vector<int>(arr.end() - k, arr.end());
    }

    // Find closest index to x via binary search
    int pos = lower_bound(arr.begin(), arr.end(), x) - arr.begin();
    if (pos == n) pos = n - 1;
    if (pos > 0 && abs(arr[pos] - x) >= abs(arr[pos - 1] - x)) {
        pos = pos - 1;  // in case of tie pick smaller element
    }
    // guarantees pos points at the nearer element, so Window expansion produces the correct answer..
    // Two pointers expanding from closest pos
    int left = pos - 1, right = pos + 1;
    vector<int> result;
    result.reserve(k);
    result.push_back(arr[pos]);
    while ((int)result.size() <  k) {
        if (left < 0) { // left end over, take from right
            result.push_back(arr[right]);
            right += 1;
        } else if (right >= n) { // right end over, take from left
            result.insert(result.begin(), arr[left]);
            left -=1;
        } else {
            int dl = abs(arr[left] - x);
            int dr = abs(arr[right] - x);
            if (dl <= dr) {
                result.insert(result.begin(), arr[left]); // insert at beginnign and shift
                left -= 1;
            } else {
                result.push_back(arr[right]); // insert at and
                right += 1;
            }
        }
    }
    return result;
}

// So here i found closest element to X in sorted array using binary search. Then the search space will be left and right of that index for K elements


