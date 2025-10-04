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

class NumberContainers {
public:
    NumberContainers() {}

    void change(int index, int number) {
        if(indexToNumbers.find(index) != indexToNumbers.end()){
            // index not mapped rn.
            // find curr number on that index.
            // erase that mapping from number to indice mapping.
            int currMappedNumber = indexToNumbers[index];
            // remove specific index from the set of indices.
            numberToIndices[currMappedNumber].erase(index); 
            // if there is now an empty set after erasing, clean up the key itself. the entire map entry.
            if(numberToIndices[currMappedNumber].empty()){
                numberToIndices.erase(currMappedNumber);
            }
        }
        indexToNumbers[index] = number;
        numberToIndices[number].insert(index);
    }

    int find(int number) {
       if(numberToIndices.find(number) != numberToIndices.end()){
            return *numberToIndices[number].begin();
       }
        return -1;
    }

private:
    // Map from number to set of indices for min index return, kinda like heap logic
    unordered_map<int, set<int>> numberToIndices;
    unordered_map<int, int> indexToNumbers;
};

/**
 * Your NumberContainers object will be instantiated and called as such:
 * NumberContainers* obj = new NumberContainers();
 * obj->change(index,number);
 * int param_2 = obj->find(number);
 */