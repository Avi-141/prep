// 2033 Minimum operations to make a uni value grid

// Sort the 2d to 1d array... as its just set of numbers we want to apply the operation to.
// Find the median of the array -- the target.. Btw any number between medians is also ok.
// For each number in the array, calculate the number of operations required to make it equal to the median.


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

int median(vector<int> &v)
{
    size_t n = v.size() / 2;
    nth_element(v.begin(), v.begin()+n, v.end());
    return v[n];
}

int solve(vector< vector<int> >& grid, int x) {
    vector<int> nums;
    int rows = grid.size();
    int cols = grid[0].size();
    for(int i = 0; i < rows; i+=1){
        for(int j = 0; j < cols; j += 1){
            nums.push_back(grid[i][j]);
        }
    }
    int targetNumber = median(nums);
    int operations = 0;
    for (int num : nums){
        if( num % x != targetNumber % x ) return -1;
        // find distance between the target number and the current number and divide by x to get the number of operations required.
        operations += abs(num - targetNumber)/x;
    }
    // cout << operations;
    return operations;
}

int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int rows;
        int cols;
        cin >> rows >> cols;
        
        vector< vector<int> > grid(rows, vector<int>(cols));
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cin >> grid[i][j];
            }
        }
        
        int x;
        cin >> x;
        
        cout << solve(grid, x) << endl;
    }
    return 0;
}