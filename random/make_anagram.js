/*
Given two strings, that may or may not be of the same length, 
determine the minimum number of character deletions required to make an anagram. Any characters can be deleted from either of the strings

make_anagram("fcrxzwscanmligyxyvym", "jxwtrhvujlmrpdoqbisbwhmgpmeoke") ➞ 30
make_anagram("showman", "woman") ➞ 2
make_anagram("cde", "abc") ➞ 4

*/

function make_anagram(s1, s2) {
    // Array to track net counts of each letter
    const counts = new Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    const maxLen = Math.max(s1.length, s2.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < s1.length) {
            counts[s1.charCodeAt(i) - aCode]++;
        }
        if (i < s2.length) {
            counts[s2.charCodeAt(i) - aCode]--;
        }
    }
    // Sum the absolute differences
    return counts.reduce((sum, val) => sum + Math.abs(val), 0);
}

// Example usage:
console.log(make_anagram("fcrxzwscanmligyxyvym", "jxwtrhvujlmrpdoqbisbwhmgpmeoke")); // 30
console.log(make_anagram("showman", "woman")); // 2
console.log(make_anagram("cde", "abc")); // 4

