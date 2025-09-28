
#ifndef CP_TEMPLATE_H
#define CP_TEMPLATE_H

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

// Type definitions for shorter coding
typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef vector<int> vi;
typedef vector<ll> vll;
typedef vector<pii> vpii;
typedef vector<pll> vpll;
typedef vector<string> vs;
typedef vector<vector<int>> vvi;
typedef vector<vector<ll>> vvll;
typedef unordered_map<int, int> umii;
typedef unordered_map<string, int> umsi;
typedef map<int, int> mii;
typedef map<string, int> msi;

// Constants
const int MOD = 1000000007;
const int INF = 1e9;
const ll LLINF = 1e18;
const double EPS = 1e-9;

// Fast I/O
#define fastio ios_base::sync_with_stdio(false); cin.tie(nullptr); cout.tie(nullptr)

// Macros
#define rep(i, a, b) for(int i = a; i < b; i++)
#define repd(i, a, b) for(int i = a; i > b; i--)
#define all(x) begin(x), end(x)
#define sz(x) (int)(x).size()
#define pb push_back
#define mp make_pair
#define F first
#define S second

// Debug macros
#define debug(x) cerr << #x << " = " << x << endl

// ========================== VECTOR HELPER FUNCTIONS ==========================

// Read a vector of integers
vi readVector(int n) {
    vi v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    return v;
}

// Print a vector of any type
template<typename T>
void printVector(const vector<T>& v, string sep = " ") {
    for (int i = 0; i < v.size(); i++) {
        cout << v[i];
        if (i < v.size() - 1) cout << sep;
    }
    cout << endl;
}

// Sum of all elements in a vector
template<typename T>
T vectorSum(const vector<T>& v) {
    return accumulate(v.begin(), v.end(), T(0));
}

// Find maximum element in a vector
template<typename T>
T vectorMax(const vector<T>& v) {
    return *max_element(v.begin(), v.end());
}

// Find minimum element in a vector
template<typename T>
T vectorMin(const vector<T>& v) {
    return *min_element(v.begin(), v.end());
}

// Find the frequency of each element in a vector
template<typename T>
unordered_map<T, int> countFrequency(const vector<T>& v) {
    unordered_map<T, int> freq;
    for (const T& elem : v) {
        freq[elem]++;
    }
    return freq;
}

// ========================== ARRAY HELPER FUNCTIONS ==========================

// Read an array of integers
void readArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
}

// Print an array of any type
template<typename T>
void printArray(T arr[], int n, string sep = " ") {
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << sep;
    }
    cout << endl;
}

// Find maximum element in an array
template<typename T>
T arrayMax(T arr[], int n) {
    return *max_element(arr, arr + n);
}

// Find minimum element in an array
template<typename T>
T arrayMin(T arr[], int n) {
    return *min_element(arr, arr + n);
}

// Sum of all elements in an array
template<typename T>
T arraySum(T arr[], int n) {
    return accumulate(arr, arr + n, T(0));
}

// ========================== STRING HELPER FUNCTIONS ==========================

// Convert string to uppercase
string toUpper(string s) {
    transform(s.begin(), s.end(), s.begin(), ::toupper);
    return s;
}

// Convert string to lowercase
string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

// Split string by delimiter
vector<string> split(const string& s, char delimiter) {
    vector<string> tokens;
    string token;
    istringstream tokenStream(s);
    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

// Join string vector with delimiter
string join(const vector<string>& v, string delimiter) {
    string result = "";
    for (int i = 0; i < v.size(); i++) {
        result += v[i];
        if (i < v.size() - 1) result += delimiter;
    }
    return result;
}

// Check if string is palindrome
bool isPalindrome(const string& s) {
    int n = s.length();
    for (int i = 0; i < n / 2; i++) {
        if (s[i] != s[n - i - 1]) return false;
    }
    return true;
}

// Count frequency of characters in a string
unordered_map<char, int> charFrequency(const string& s) {
    unordered_map<char, int> freq;
    for (char c : s) {
        freq[c]++;
    }
    return freq;
}

// ========================== HASHMAP HELPER FUNCTIONS ==========================

// Print a map (any key-value pair)
template<typename K, typename V>
void printMap(const unordered_map<K, V>& m) {
    for (const auto& [key, value] : m) {
        cout << key << ": " << value << endl;
    }
}

// Get keys from a map
template<typename K, typename V>
vector<K> getKeys(const unordered_map<K, V>& m) {
    vector<K> keys;
    for (const auto& [key, _] : m) {
        keys.push_back(key);
    }
    return keys;
}

// Get values from a map
template<typename K, typename V>
vector<V> getValues(const unordered_map<K, V>& m) {
    vector<V> values;
    for (const auto& [_, value] : m) {
        values.push_back(value);
    }
    return values;
}

// Check if a key exists in a map
template<typename K, typename V>
bool keyExists(const unordered_map<K, V>& m, const K& key) {
    return m.find(key) != m.end();
}

// ========================== 2D VECTOR HELPER FUNCTIONS ==========================

// Read a 2D vector of integers
vvi read2DVector(int rows, int cols) {
    vvi v(rows, vi(cols));
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            cin >> v[i][j];
        }
    }
    return v;
}

// Print a 2D vector of any type
template<typename T>
void print2DVector(const vector<vector<T>>& v) {
    for (const auto& row : v) {
        for (int j = 0; j < row.size(); j++) {
            cout << row[j];
            if (j < row.size() - 1) cout << " ";
        }
        cout << endl;
    }
}

// Initialize a 2D vector with a default value
template<typename T>
vector<vector<T>> init2DVector(int rows, int cols, T defaultValue) {
    return vector<vector<T>>(rows, vector<T>(cols, defaultValue));
}

// Get the transpose of a 2D vector
template<typename T>
vector<vector<T>> transpose(const vector<vector<T>>& matrix) {
    if (matrix.empty()) return {};
    int rows = matrix.size();
    int cols = matrix[0].size();
    vector<vector<T>> result(cols, vector<T>(rows));
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

// Rotate a 2D vector 90 degrees clockwise
template<typename T>
vector<vector<T>> rotate90Clockwise(const vector<vector<T>>& matrix) {
    if (matrix.empty()) return {};
    int rows = matrix.size();
    int cols = matrix[0].size();
    vector<vector<T>> result(cols, vector<T>(rows));
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[j][rows - 1 - i] = matrix[i][j];
        }
    }
    return result;
}

// Rotate a 2D vector 90 degrees counter-clockwise
template<typename T>
vector<vector<T>> rotate90CounterClockwise(const vector<vector<T>>& matrix) {
    if (matrix.empty()) return {};
    int rows = matrix.size();
    int cols = matrix[0].size();
    vector<vector<T>> result(cols, vector<T>(rows));
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[cols - 1 - j][i] = matrix[i][j];
        }
    }
    return result;
}

// Get a specific row from a 2D vector
template<typename T>
vector<T> getRow(const vector<vector<T>>& matrix, int rowIndex) {
    if (rowIndex < 0 || rowIndex >= matrix.size()) return {};
    return matrix[rowIndex];
}

// Get a specific column from a 2D vector
template<typename T>
vector<T> getColumn(const vector<vector<T>>& matrix, int colIndex) {
    if (matrix.empty() || colIndex < 0 || colIndex >= matrix[0].size()) return {};
    vector<T> column;
    for (const auto& row : matrix) {
        column.push_back(row[colIndex]);
    }
    return column;
}

// Find the maximum element in a 2D vector
template<typename T>
T max2DVector(const vector<vector<T>>& matrix) {
    T maxVal = numeric_limits<T>::lowest();
    for (const auto& row : matrix) {
        for (const T& val : row) {
            maxVal = max(maxVal, val);
        }
    }
    return maxVal;
}

// Find the minimum element in a 2D vector
template<typename T>
T min2DVector(const vector<vector<T>>& matrix) {
    T minVal = numeric_limits<T>::max();
    for (const auto& row : matrix) {
        for (const T& val : row) {
            minVal = min(minVal, val);
        }
    }
    return minVal;
}

// Sum all elements in a 2D vector
template<typename T>
T sum2DVector(const vector<vector<T>>& matrix) {
    T sum = T(0);
    for (const auto& row : matrix) {
        sum += accumulate(row.begin(), row.end(), T(0));
    }
    return sum;
}

// Check if coordinates are valid in a matrix
template<typename T>
bool isValidCoordinate(const vector<vector<T>>& matrix, int row, int col) {
    return row >= 0 && row < matrix.size() && col >= 0 &&
           (matrix.empty() ? false : col < matrix[0].size());
}

// ========================== GRAPH HELPER FUNCTIONS ==========================

// Read an undirected graph
vector<vector<int>> readUndirectedGraph(int n, int m) {
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    return adj;
}

// Read a directed graph
vector<vector<int>> readDirectedGraph(int n, int m) {
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }
    return adj;
}

// ========================== MATH HELPER FUNCTIONS ==========================

// Greatest Common Divisor
ll gcd(ll a, ll b) {
    return b == 0 ? a : gcd(b, a % b);
}

// Least Common Multiple
ll lcm(ll a, ll b) {
    return a / gcd(a, b) * b;
}

// Check if a number is prime
bool isPrime(ll n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (ll i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

// Calculate factorial
ll factorial(ll n) {
    ll result = 1;
    for (ll i = 2; i <= n; i++) {
        result = (result * i) % MOD;
    }
    return result;
}

// Calculate power with modulo
ll power(ll base, ll exponent, ll modulus = MOD) {
    ll result = 1;
    base %= modulus;
    while (exponent > 0) {
        if (exponent & 1) result = (result * base) % modulus;
        exponent >>= 1;
        base = (base * base) % modulus;
    }
    return result;
}

// Calculate modular inverse
ll modInverse(ll a, ll m = MOD) {
    return power(a, m - 2, m);
}

// Calculate nCr with modulo
ll nCr(ll n, ll r, ll m = MOD) {
    if (r < 0 || r > n) return 0;
    if (r == 0 || r == n) return 1;
    ll numerator = 1, denominator = 1;
    for (ll i = 0; i < r; i++) {
        numerator = (numerator * (n - i)) % m;
        denominator = (denominator * (i + 1)) % m;
    }
    return (numerator * modInverse(denominator, m)) % m;
}

// Find prime factors of a number
vector<ll> primeFactors(ll n) {
    vector<ll> factors;
    while (n % 2 == 0) {
        factors.push_back(2);
        n /= 2;
    }
    for (ll i = 3; i * i <= n; i += 2) {
        while (n % i == 0) {
            factors.push_back(i);
            n /= i;
        }
    }
    if (n > 2) factors.push_back(n);
    return factors;
}

#endif // CP_TEMPLATE_H