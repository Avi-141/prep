/*
You are given a binary string s, and two integers num1 and num2. 
num1 and num2 are coprime numbers.
A ratio substring is a substring of s where the ratio between the number of 0's and the number of 1's in the substring is exactly num1 : num2.

For example, if num1 = 2 and num2 = 3, then "01011" and "1110000111" are ratio substrings, while "11000" is not.
Return the number of non-empty ratio substrings of s.

num1 = zeroes
num2 = ones

min num1+num2 length substring.

*/

// Brute Force Solution - O(n²) Time Complexity
var fixedRatioBruteForce = function(s, num1, num2) {
    const n = s.length;
    let count = 0;

    for (let i = 0; i < n; i++) {
        let zeroes = 0;
        let ones = 0;

        for (let j = i; j < n; j++) {
            if (s[j] === '0') {
                zeroes++;
            } else {
                ones++;
            }

            // Check if the current substring maintains the ratio
            if (zeroes * num2 === ones * num1) {
                count++;
            }
        }
    }

    return count;
};

// Optimal Solution using Prefix Sum - O(n) Time Complexity
/**
 * @param {string} s
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var fixedRatio = function(s, num1, num2) {
  const counts = {};
  const n = num1 + num2;
  let ones = 0;
  counts[0] = 1;

  // zero/one = num1/num2
  // zero·num2 - one·num1 = 0
  // (total zero up to i)·num2 - (total one up to i)·num1
  // D(i) = (total zero up to i)·num2 - (total one up to i)·num1
  // if D(i) == D(j) then substring between i and j has required ratio

  for (let i = 0; i < s.length; i++) {
    ones += s[i] === '1' ? 1 : 0;
    const key = (i + 1) * num2 - ones * n;
    counts[key] = (counts[key] || 0) + 1;
  }

  let ans = 0;
  for (const k in counts) {
    const x = counts[k];
    ans += x * (x - 1) / 2;
  }

  return ans;
};

/*

Keep a running count of 1’s in ones.
At prefix length i, zeros = i – ones.
Your key
key = zeros·num2 − ones·num1
expands to
key = i·num2 − ones·(num1+num2),
which is exactly what you compute as
i * num2 - ones * n where n = num1+num2.

So then, tally how many prefixes share each key in d.
In the end, each group of size x contributes “x choose 2” valid substrings,
so summing x*(x-1)/2 over all counts gives the total.
*/



/*
The key insight is to reframe the problem geometrically.

Imagine walking along the string and plotting progress in a simple 2D grid:

x-axis = how many 0’s you’ve seen so far
y-axis = how many 1’s you’ve seen so far
Each prefix of the string is now a point Pk = (zerosₖ, onesₖ). 
A substring from j+1 to i has exactly num1 : num2 zeros : ones 
if and only if the line connecting Pj to Pi has slope = num2/num1.

All lines of the same slope differ only by how “high” or “low” they sit—their intercept. 
If two prefix-points lie on the same slope-num2/num1 line, then the substring between them has exactly that ratio.

So we:

Compute, for each prefix Pk, a single number (the “intercept key”) = num1·onesₖ − num2·zerosₖ
Keep a map counting how often each key has appeared.
Every time the current prefix has a key you’ve seen before, it means there are that many earlier prefix-points on the same slope line—hence that many valid substrings ending here. This turns the geometric picture into a simple O(n) hash-map count.

https://leetcode.com/problems/number-of-substrings-with-fixed-ratio/solutions/2870932/animated-solution-count-lines-with-slope-that-pass-this-current-point/
*/