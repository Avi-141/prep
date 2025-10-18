/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
    const map = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    };

    const digitsArr = digits.split('');
    const result = [];
    const path = [];

    function backtrack(index, path) {
        for (let i = index; i < digitsArr.length; i++) {
            const digit = digitsArr[i];
            const availableChars = map[digit].split('');
            for (const char of availableChars) {
                const newPath = path + char;
                if (newPath.length === digitsArr.length) {
                    result.push(newPath);
                } else {
                    backtrack(i + 1, newPath)
                }
            }
        }
    }

    function dfs(index) {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }

        const currNum = digits[index]
        const chars = map[currNum];
        
        if (!chars) return; // guard if unexpected digit

        for (const ch of chars) {
            // take
            path.push(ch);
            // dfs
            dfs(index + 1);
            // remove
            path.pop();
        }
    }

    if (digits.length === 0) return [];
    if (digits.length === 1) return map[Number(digits)].split('');

    backtrack(0, '')
    dfs(0)
    return result;
};

// How to trace this?
// letterCombinations("23")
// digitsArr = ['2', '3']
// backtrack(0, '')
// index = 0, path = ''
// digit = '2', availableChars = ['a', 'b', 'c']
// char = 'a', newPath = 'a' (not added to result as length is not 2)
// backtrack(1, 'a')
// index = 1, path = 'a'
// digit = '3', availableChars = ['d', 'e', 'f']
// char = 'd', newPath = 'ad' (added to result as length is 2)
// char = 'e', newPath = 'ae' (added to result as length is 2)
// char = 'f', newPath = 'af' (added to result as length is 2)
// return to previous call
// char = 'b', newPath = 'b' (not added to result as length is not 2)
// backtrack(1, 'b')
// index = 1, path = 'b'
// digit = '3', availableChars = ['d', 'e', 'f']
// char = 'd', newPath = 'bd' (added to result as length is 2)
// char = 'e', newPath = 'be' (added to result as length is 2)
// char = 'f', newPath = 'bf' (added to result as length is 2)
// return to previous call
// char = 'c', newPath = 'c' (not added to result as length is not 2)
// backtrack(1, 'c')
// index = 1, path = 'c'
// digit = '3', availableChars = ['d', 'e', 'f']
// char = 'd', newPath = 'cd' (added to result as length is 2)
// char = 'e', newPath = 'ce' (added to result as length is 2)
// char = 'f', newPath = 'cf' (added to result as length is 2)
// return to previous call
// end of function

// Result: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]