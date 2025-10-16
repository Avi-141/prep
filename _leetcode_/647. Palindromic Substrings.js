var countSubstrings = function (s) {
    function isPalindrome(l, r) {
        while (l < r) {
            if (s[l++] !== s[r--]) return false;
        }
        return true;
    }
    let ans = 0;
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) { // j starts at i
            ans += isPalindrome(i, j) ? 1 : 0;
        }
    }
    return ans;
};
/*
Shrinking from the ends checks only the full string (or one chosen substring). It can tell you if that single substring is a palindrome, but it won’t enumerate/count all palindromic substrings inside. Many palindromes are not aligned with the outer ends.
*/

/*
Center expansion avoids the extra factor:

    Every palindrome has a center (character or gap). There are 2n − 1 centers.
    From each center, expand outward while s[L] == s[R], counting palindromes as you go.
    In the worst case (e.g., "aaaaa"), total expansions across all centers is O(n^2).
    Total = O(n^2) time, O(1) extra space.

*/

/*
If you want even faster: Manacher’s algorithm runs in O(n) and gives all palindrome radii; summing the radii yields the count. But center expansion is simpler and passes typical constraints
*/

var countSubstrings = function (s) {
    let result = 0;
    let N = s.length;

    function countPalCenter(left, right) {
        let ans = 0;
        while (left >= 0 && right < N) {
            if (s[left] !== s[right]) break;
            left --;
            right ++;
            ans++
        }
        return ans;
    }
    for (let i = 0; i < s.length; ++i) {
        result += countPalCenter(i, i) // odd length has one center
        result += countPalCenter(i, i + 1) // even length has 2 centers
    }

    return result;

}

// https://leetcode.com/problems/palindromic-substrings/editorial/

// O(n) is Manacher's algorithm
// https://leetcode.com/problems/palindromic-substrings/solutions/105831/java-8ms-manacher-s-algorithm-with-detailed-explanation/


// https://leetcode.com/problems/shortest-palindrome/description/