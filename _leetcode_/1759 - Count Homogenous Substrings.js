// In a string of length n, there are n substrings that end with the final character.
// In general, we lock in the final character, and then have n choices for the first character. Thus, the answer is always the length of the string.

/* Let's derive formula for no of possible substrings of string of size n. 
Substrings of s is defined as all possible pairs of (i, j) such that i <= j
   and it consists of all characters from index i to j 
   for i = 0 we have n options to place j. 
   ... i = 1 we have n - 1 options to place j
   ... i = 2 we have n - 2 options to place j
   hence total no of possible substrings are n + n - 1 + n - 2 + ........ + 1 = sum of first n natural numbers i.e (n * (n + 1)) / 2 
*/

/*
Think of expansion of substring size until you find a different character.
For example- s="aaabc"
Keep on increasing the size of substring until your next character is not same as the current character you are looking at.
*/

/**
 * @param {string} s
 * @return {number}
 */

// How can you calculate length of substring?
// Simply
// right - left + 1
var countHomogenous = function (s) {
    let currStreakStart = 0;
    let currStreakEnd = 0;
    let countSubStrings = 0;
    while(currStreakStart < s.length){
        countSubStrings += currStreakEnd - currStreakStart + 1;
        if(s[currStreakEnd]!==s[currStreakEnd+1]){
            currStreakEnd += 1;
            currStreakStart = currStreakEnd;
            continue; // we found a new sub group now.
        }
        currStreakEnd +=1;
    }
    return countSubStrings%(1e9+7)
};