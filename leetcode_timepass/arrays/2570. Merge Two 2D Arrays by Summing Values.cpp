
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

// Hashmap
vector<vector<int> > mergeArrays(vector<vector<int> >& nums1, vector<vector<int> >& nums2) {
    int n = nums1.size();
    int m = nums2.size();
    int iterSize = max(n, m);
    unordered_map<int, int> mp;
    for (int i = 0; i < iterSize; i++) {
        if(i < n){
            mp[nums1[i][0]] += nums1[i][1];
        }
        if(i < m){
            mp[nums2[i][0]] += nums2[i][1];
        }
    }

    vector<vector<int> > ans;
    for (auto k : mp) {
        vector<int> pair;
        pair.push_back(k.first);
        pair.push_back(k.second);
        ans.push_back(pair);
    }
    sort(ans.begin(), ans.end());
    return ans;
}


// Two pointer
vector<vector<int> > mergeArrays(vector<vector<int> >& nums1, vector<vector<int> >& nums2) {
    int first = 0;
    int second = 0;
    vector<vector<int> > arr;
    while(first < nums1.size() && second < nums2.size()){
        int id1 = nums1[first][0]; int num1 = nums1[first][1];
        int id2 = nums2[second][0]; int num2 = nums2[second][1];
        if(id1 < id2) {
            arr.push_back({id1, num1});
            first++;
        }
        else if (id2 < id1){
            arr.push_back({id2, num2});
            second++;
        }else if(id1==id2){
            arr.push_back({id1, num1+num2});
            first++;
            second++;
        }
    }
    while(first < nums1.size()){
        arr.push_back(nums1[first]);
        first +=1;
    }
    while(second < nums2.size()){
        arr.push_back(nums2[second]);
        second +=1;
    }
    return arr;
}


int main() {
    fastio;
    int t = 1;
    cin >> t;
    while (t--) {
        int n, m;
        cin >> n >> m;
        vector< vector<int> > nums1(n, vector<int>(n));
        vector< vector<int> > nums2(m, vector<int>(m));

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                cin >> nums1[i][j];
            }
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < m; j++) {
                cin >> nums2[i][j];
            }
        }

        vector<vector<int > >result = mergeArrays(nums1, nums2);
        for (const auto& pair : result) {
            cout << pair[0] << " " << pair[1] << endl;
        }
    }
    return 0;
}