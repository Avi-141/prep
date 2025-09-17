#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

void bfs(unordered_map<int, vector<int>>&g, int node, vector<bool>&visited){
    queue<int> q;
    visited[node] = true;
    // unordered_set<int> visitedSet;
    q.push(node);
    //visitedSet.insert(node);
    while(!q.empty()){
        int curr = q.front();
        q.pop();
        for(auto neighbor: g[curr]){
            if(!visited[neighbor]){ // if (visited.find(neighbor) == visited.end()) for set usage {
                visited[neighbor] = true;
                //visitedSet.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}