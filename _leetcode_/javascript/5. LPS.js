/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    let result = 0;
    let N = s.length;

    function countPalCenter(left, right) {
        let ans = 0;
        while (left >= 0 && right < N) {
            if (s[left] !== s[right]) break;
            left--;
            right++;
        }
        return s.slice(left + 1, right)
    }

    let LPS = ''
    for (let i = 0; i < s.length; ++i) {
        let odd = countPalCenter(i, i)
        let even = countPalCenter(i, i + 1)

        if (odd.length > LPS.length) LPS = odd;
        if (even.length > LPS.length) LPS = even;
    }
    return LPS
}