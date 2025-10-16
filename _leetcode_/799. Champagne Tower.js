/**
 * @param {number} poured
 * @param {number} query_row
 * @param {number} query_glass
 * @return {number}
 */
var champagneTower = function (poured, query_row, query_glass) {
    let memo = Array(100).fill(0).map(() => Array(100).fill(0))
    memo[0][0] = poured;

    for (let row = 0; row < query_row; row++) {
        for (let glass = 0; glass <= row; glass++) {
            const extra = parseFloat((memo[row][glass] - 1)/2)
            if (extra > 0) {
                memo[row + 1][glass] += extra
                memo[row + 1][glass + 1] += extra
            }
        }
    }

    const ans = memo[query_row][query_glass]
    return Math.min(1, ans)
}