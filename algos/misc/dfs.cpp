#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class Solution {
public:
    void dfsCall(int u, const unordered_map<int, vector<int>>& g,vector<int>& vis,vector<int>& out) {
            vis[u] = 1;
            out.push_back(u);
            auto it = g.find(u);
            if (it == g.end()) return;
            for (int v : it->second) {
                if (!vis[v]) dfsCall(v, g, vis, out);
            }
    }

    vector<int> dfs(vector<vector<int>>& adj) {
        int V = (int)adj.size();
        vector<int> res;
        if (V == 0) return res;

        unordered_map<int, vector<int>> g;
        g.reserve(V * 2);                // avoid rehashing
        for (int u = 0; u < V; ++u) {
            g[u] = adj[u];               // copy neighbors of u
        }
        // If the graph were undirected and adj wasn’t symmetrical, 
        // should also add reverse edges here

        vector<int> vis(V, 0);
        dfsCall(0, g, vis, res);

        
        for (int i = 0; i < V; ++i)
            if (!vis[i]) {
                dfsCall(i, g, vis, res);
            }

        return res;
    }
};


// Directly use adj
/*
class Solution {
public:
    void dfsCall(int u, vector<vector<int>>& adj, vector<int>& vis, vector<int>& res) {
        vis[u] = 1;
        res.push_back(u);
        for (int v : adj[u]) if (!vis[v]) dfsCall(v, adj, vis, res);
    }

    vector<int> dfs(vector<vector<int>>& adj) {
        int V = (int)adj.size();
        vector<int> res;
        if (V == 0) return res;

        vector<int> vis(V, 0);

        dfsCall(0, adj, vis, res);

        // Cover disconnected components
        for (int i = 0; i < V; ++i)
            if (!vis[i]) dfsCall(i, adj, vis, res);

        return res;
    }
};
*/