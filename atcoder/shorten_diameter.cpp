#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

// simple adj list
unordered_map<int, vector<int>> graph;
// weighted graph
unordered_map<int, vector<pair<int,int>>> weightedGraph;
// multiple edge types;
unordered_map<int, unordered_map<int,int>> adjMatrix; 


void addEdge(int u, int v, unordered_map<int, vector<int>>&g){
    if(u == v) return; // prevent self-loop
    g[u].push_back(v);
    g[v].push_back(u); // if undirected
}

// adj list better for sparse graphs

void addWeightedEdge(int u, int v, int w, unordered_map<int, vector<pair<int,int>>>&g){
    if(u == v) return; // prevent self-loop
    g[u].push_back({v,w});
    g[v].push_back({u,w}); // if undirected
}


void addAdjMatrixEdge(int u, int v, int w, unordered_map<int, unordered_map<int,int>>&g){
    if(u == v) return; // prevent self-loop
    g[u][v] = w;
    g[v][u] = w; // if undirected
} 

void dfs(int node, unordered_map<int, vector<int>>&g, vector<int>&visited){
    if(visited[node] == true) return;
    visited[node] = true;
    for(auto neighbor: g[node]){
        if(!visited[neighbor]){
            dfs(neighbor, g, visited);
        }
    }
}



// adj matrix better when we need "does edge exist queries"

/*
"Modify your DFS to handle self-loops without infinite loops"
"How would self-loops affect cycle detection in an undirected graph?"

"Design a social network where users can 'follow themselves' - how do you handle this?"
"In a dependency graph, what does a self-loop represent and how do you detect it?"

"Your shortest path algorithm gives wrong results - could self-loops be the issue?"
"Why might allowing self-loops break your topological sort?"

"Should your graph data structure allow self-loops? Justify your decision."
"How would you modify adjacency matrix vs adjacency list for self-loops?"
*/

/* When Self-Loops Are Useful
1. State Machines & Finite Automata
Node stays in same state with certain input
Game states where player can "wait" or "do nothing"

2. Network Flow Problems
Self-loops can represent internal capacity or storage
Resource allocation within the same entity
// 2. Network Flow with Self-Capacity
Problems where nodes have internal storage/processing capacity

3. Dynamic Programming on Graphs
Representing "staying at current position" as an option
Time-based graph problems where waiting is allowed

4. Social Networks & Recommendation Systems
Users can like their own posts, follow themselves
Self-referential relationships

1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance
// Self-loops with weight 0 (staying in same city costs nothing)
// Floyd-Warshall naturally handles this

2. 787. Cheapest Flights Within K Stops
// Waiting at airport (self-loop) might be optimal in some variants

3. 1162. As Far from Land as Possible
// Multi-source BFS where staying put is an option


AtCoder Problems:
1. ABC 237 D - LR insertion
Self-referential operations where elements can reference themselves
2. ABC 204 D - Cooking
DP where "doing nothing" (self-loop in state) is an option


1. Shortest Path with "Wait" Option
// You can wait at any vertex for cost 0
void addWaitEdges() {
    for(int i = 0; i < n; i++) {
        graph[i][i] = 0; // self-loop with cost 0
    }
}

3. Cache/Memory Problems
// Data can stay in same cache level
// Self-loop represents cache hit (cost 0)

Design a subway system where passengers can wait at stations. Find minimum time to travel from A to B."
// Each station has self-loop (waiting costs time but might be optimal)
// if next train is delayed
for(int station = 0; station < n; station++) {
    addAdjMatrixEdge(station, station, WAIT_TIME, graph);
}
*/

