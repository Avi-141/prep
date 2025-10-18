/**
 * @param {number} n
 * @return {number[]}
 */
var sumZero = function (n) {
    let arr = []
    let eachSide = Math.floor(n / 2);
    for (let i = 1; i <= eachSide; i++) arr.push(i, -i);
    if (n & 1) arr.push(0)
    return arr;
};