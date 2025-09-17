#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

/*
UNORDERED_MAP FOR GRAPHS - QUICK REFERENCE
==========================================
*/

// Simple adjacency list
unordered_map<int, vector<int>> graph;
// Weighted graph (node -> {neighbor, weight})
unordered_map<int, vector<pair<int, int>>> weightedGraph;
// Multiple edge types (useful for complex graphs)
unordered_map<int, unordered_map<int, int>> adjMatrix; // graph[u][v] = weight


// Undirected Add Edge
void addEdge(unordered_map<int, vector<int>>& g, int u, int v) {
    g[u].push_back(v);
    g[v].push_back(u);
}

// Undirected Add Weighted Edge
void addWeightedEdge(unordered_map<int, vector<pair<int, int>>>& g, int u, int v, int w) {
    g[u].push_back({v, w});
    g[v].push_back({u, w});
}

// Check if edge exists
bool hasEdge(unordered_map<int, vector<int>>& g, int u, int v) {
    if (g.find(u) == g.end()) return false;
    for (int neighbor : g[u]) {
        if (neighbor == v) return true;
    }
    return false;
}

// DFS with unordered_set for visited
void dfs(unordered_map<int, vector<int>>& g, int node, unordered_set<int>& visited) {
    visited.insert(node);
    cout << node << " ";
    
    for (int neighbor : g[node]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(g, neighbor, visited);
        }
    }
}

// BFS pattern
void bfs(unordered_map<int, vector<int>>& g, int start) {
    unordered_set<int> visited;
    queue<int> q;
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        
        for (int neighbor : g[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}

/*
4. ADVANCED PATTERNS
*/

// Find shortest path (BFS for unweighted)
int shortestPath(unordered_map<int, vector<int>>& g, int start, int end) {
    if (start == end) return 0;
    
    unordered_set<int> visited;
    queue<pair<int, int>> q; // {node, distance}
    
    q.push({start, 0});
    visited.insert(start);
    
    while (!q.empty()) {
        auto [node, dist] = q.front();
        q.pop();
        
        for (int neighbor : g[node]) {
            if (neighbor == end) return dist + 1;
            
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push({neighbor, dist + 1});
            }
        }
    }
    return -1; // no path found
}

// Count connected components
int countComponents(unordered_map<int, vector<int>>& g) {
    unordered_set<int> visited;
    int components = 0;
    
    // Get all vertices
    unordered_set<int> vertices;
    for (auto& pair : g) {
        vertices.insert(pair.first);
        for (int neighbor : pair.second) {
            vertices.insert(neighbor);
        }
    }
    
    for (int vertex : vertices) {
        if (visited.find(vertex) == visited.end()) {
            components++;
            // DFS to mark all connected vertices
            function<void(int)> dfs = [&](int node) {
                visited.insert(node);
                for (int neighbor : g[node]) {
                    if (visited.find(neighbor) == visited.end()) {
                        dfs(neighbor);
                    }
                }
            };
            dfs(vertex);
        }
    }
    return components;
}

/*
5. PERFORMANCE NOTES
*/

/*
TIME COMPLEXITY:
- Insert edge: O(1) average
- Find neighbors: O(1) average  
- Check if edge exists: O(degree of vertex)
- DFS/BFS: O(V + E)

SPACE COMPLEXITY:
- O(V + E) where V = vertices, E = edges

ADVANTAGES over vector<vector<int>>:
- Dynamic vertices (don't need to know max vertex number)
- Memory efficient for sparse graphs
- Easy to handle non-consecutive vertex numbering

WHEN TO USE:
- Sparse graphs
- Dynamic vertex addition
- Non-consecutive vertex IDs (like strings, large integers)
- When you don't know the maximum vertex number beforehand
*/

int main() {
    unordered_map<int, vector<int>> graph;
    
    // Build sample graph
    addEdge(graph, 1, 2);
    addEdge(graph, 1, 3);
    addEdge(graph, 2, 4);
    addEdge(graph, 3, 4);
    
    cout << "Graph built with " << graph.size() << " vertices" << endl;
    
    unordered_set<int> visited;
    cout << "DFS from vertex 1: ";
    dfs(graph, 1, visited);
    cout << endl;
    
    cout << "BFS from vertex 1: ";
    bfs(graph, 1);
    cout << endl;
    
    cout << "Shortest path 1->4: " << shortestPath(graph, 1, 4) << endl;
    cout << "Connected components: " << countComponents(graph) << endl;
    
    return 0;
}