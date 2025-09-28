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


//two-pointer
bool isPalindrome(string s) {
    int l = 0;              // left
    int r = s.length() - 1; // right
    
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++;
        r--;
    }
    return true;
}

// String comparision
bool isPalindrome(string s) {
    string newStr = "";
    
    for (char c : s) {
        if (isalnum(c)) {
            newStr += tolower(c);
        }
    }
    
    string reversed = newStr;
    reverse(reversed.begin(), reversed.end());
    
    return newStr == reversed;
}