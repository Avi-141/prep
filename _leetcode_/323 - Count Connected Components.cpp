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
    void dfs(int u, unordered_map<int, vector<int>>& graph,
             vector<bool>& visited) {
        visited[u] = true;
        for (int& v : graph[u]) {
            if (!visited[v])
                dfs(v, graph, visited);
        }
    }

    int countComponents(int n, vector<vector<int>>& edges) {
        // Build adjacency list
        unordered_map<int, vector<int>> graph;
        for (auto& e : edges) {
            int u = e[0], v = e[1];
            graph[u].push_back(v);
            graph[v].push_back(u); // undirected
        }
        vector<bool> visited(n, false);
        int components = 0;
        for (int i = 0; i < n; ++i) {
            if (!visited[i]) {
                dfs(i, graph, visited);
                ++components;
            }
        }
        return components;
    }
};