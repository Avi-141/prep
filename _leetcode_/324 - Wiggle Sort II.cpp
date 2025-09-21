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
    void wiggleSort(vector<int>& nums) {
        std::sort(nums.begin(), nums.end());
        vector<int> sortedWiggleArr;
    // sorting and piking left, right will not work..
    // 4 5 5 6  -> 4 6 5 5 wrong
    // sort and put in indices odd and even in reverse order
    // every odd group element in wiggle > even group..
    std:
        sort(nums.begin(), nums.end());
        int n = nums.size();
        if (n < 2)
            return;
        // 5 _ 4 _ even index reverse
        // _ 6 _ 5 odd index reverse
        // Since the initial array is sorted, we are assured that [c < f > b < e
        // > a < d]
        vector<int> ans(nums.size());
        int j = 1; // odd first
        for (int i = nums.size() - 1; i >= 0; i--) {
            ans[j] = nums[i];
            j = j + 2;
            if (j >= nums.size()) {
                j = 0; // we have completed all odd
                // now reset to 0 for even ones.
            }
        }
        for (int i = 0; i < nums.size(); i++) {
            nums[i] = ans[i];
        }
    }
};

// https://leetcode.com/problems/wiggle-sort-ii/solutions/77677/o-n-o-1-after-median-virtual-indexing/
// virtual indexing and 3 way partition

/*

The “O(N) time, O(1) extra” wiggle‐sort recipe has three main pieces:

1. Find the median in O(N)  
   Use C++’s `nth_element` (or Quickselect) to put the true median at index `n/2`.  After that call, every element before `n/2` is ≤ median, and every element after is ≥ median (but not sorted).

2. Virtual-index mapping to interleave slots  
   We want the final pattern  
     nums[0] < nums[1] > nums[2] < nums[3] > …  
   Equivalently:  
     – the “large half” of values go into odd indices 1,3,5,…  
     – the “small half” go into even indices 0,2,4,…  
   We achieve that by re-numbering our array in one pass via this mapping:  
     newIndex(i) = (1 + 2*i) % (n | 1)  
   If n is odd, `(n|1)==n`; if n is even, `(n|1)==n+1`.  
   This formula walks through indices in the order  
     1, 3, 5, …, (n−1 or n−2), 0, 2, 4, …  
   so that you fill all odd slots first, then the evens.

3. Dutch-national-flag 3-way partition around the median  
   Now treat the array via its virtual indices and do a single 3-way partition:  
   ```
   left = 0, i = 0, right = n−1
   while (i ≤ right) {
     if (A[newIndex(i)] >  median) swap(A[newIndex(left++)],  A[newIndex(i++)]);
     else if (A[newIndex(i)] <  median) swap(A[newIndex(i)],        A[newIndex(right--)]);
     else /* == median 
     i++;
   }
   ```  
   – Anything > median goes into the “front” of the virtual sequence (i.e. into odd slots).  
   – Anything < median goes into the “back” (i.e. into even slots).  
   – Equals stay in the middle.

Once that single pass finishes, all the larger values occupy odd positions, smaller occupy evens, and equals fill whatever remains—giving you the required  
  nums[0] < nums[1] > nums[2] < nums[3] …  
in O(N) time with only a handful of integer swaps.
*/