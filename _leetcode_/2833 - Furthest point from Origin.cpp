
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

int furthestDistanceFromOrigin(string moves) {
        int sLen = moves.length();
        int countL =0;
        int countR =0;
        int countFree =0;
        for(int i=0;i<sLen;i++){
            if(moves[i] == 'L') countL+=1;
            if(moves[i] == 'R') countR+=1;
            if(moves[i]=='_') countFree+=1;
        }
        return abs(countL - countR) + countFree;
}