/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var largestMerge = function (word1, word2) {
    // char comparision lexo and append
    // take from large string optimal
    // what if chars are equal?
    let result = ''
    let i = 0;
    let j = 0;
    while (i < word1.length && j < word2.length) {
        // direct char comparision
        if (word1[i] > word2[j]) result += word1[i++];
        else if (word2[j] > word2[j]) result += word2[j++];
        // now if chars are equal, check substring length
        else {
            let str1 = word1.slice(i);
            let str2 = word2.slice(j);
            // > allows direct lexo comparision.
            if (str1 > str2) result += word1[i++];
            else result += word2[j++];
        }
    }
    // add remaining hcars...
    result += word1.slice(i);
    result += word2.slice(j)
    return result;
};
