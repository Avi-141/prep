/**
 * @param {string} s
 * @return {boolean}
 */

function isPalindrome(newStr, left, right) {
    while (left < right) {
        if (newStr[left] !== newStr[right]) return false
        left++;
        right--;
    }
    return true;
};

// We can delete atmost one character..
// so just use left right to iterate from both ends
// if we find a mismatch, we can either skip left or right and check if the rest is palindrome
// if we find no mismatches, then its already a palindrome
var validPalindrome = function (s) {
    let left = 0;
    let right = s.length - 1;

    while(left < right){
        if(s[left] !== s[right]){
            return isPalindrome(s, left, right - 1) || isPalindrome(s, left+1, right)
        }
        left ++;
        right --
    }

    return true;
};

