
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
    void findNumberOfProvinces(vector<vector<int>>& isConnected, vector<bool>& visited, int u) {
        queue<int> q;
        visited[u] = true;
        q.push(u);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v = 0; v < isConnected.size(); v++) {
                if (!visited[v] && isConnected[u][v]) {
                    q.push(v);
                    visited[v] = true;
                }
            }
        }
}

    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        vector<bool> visited(n, false);
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                findNumberOfProvinces(isConnected, visited, i);
                count++;
            }
        }
        return count;
    }
};