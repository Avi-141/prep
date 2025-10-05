/*
You are given two integer arrays prices and strategy, where:

prices[i] is the price of a given stock on the ith day.
strategy[i] represents a trading action on the ith day, where:
-1 indicates buying one unit of the stock.
0 indicates holding the stock.
1 indicates selling one unit of the stock.
You are also given an even integer k, and may perform at most one modification to strategy. A modification consists of:

Selecting exactly k consecutive elements in strategy.
Set the first k / 2 elements to 0 (hold).
Set the last k / 2 elements to 1 (sell).
The profit is defined as the sum of strategy[i] * prices[i] across all days.

Return the maximum possible profit you can achieve.

Note: There are no constraints on budget or stock ownership, so all buy and sell operations are feasible regardless of past actions.
*/


//https://github.com/keineahnung2345/leetcode-cpp-practices/tree/master

/**
 * @param {number[]} prices
 * @param {number[]} strategy
 * @param {number} k
 * @return {number}
 */


var maxProfit = function (prices, strategy, k) {
    const n = prices.length;

    // Build prefix sums for efficient window calculations
    const prefixPrices = new Array(n + 1).fill(0);
    const prefixStrategyPrices = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
        prefixPrices[i + 1] = prefixPrices[i] + prices[i];
        prefixStrategyPrices[i + 1] = prefixStrategyPrices[i] + prices[i] * strategy[i];
    }

    // Base profit from original strategy is the last element in prefixStrategyPrices
    const baseProfit = prefixStrategyPrices[n];
    let maxImprovement = 0; // Track the best improvement we can get from baseProfit

    // Try all possible k-length windows
    for (let start = 0; start <= n - k; start++) {
        const end = start + k;

        // Original profit from window [start, end)
        const originalWindowProfit = prefixStrategyPrices[end] - prefixStrategyPrices[start];

        // New profit from modified window:
        // First k/2 elements become 0 (hold)
        // Last k/2 elements become 1 (sell) which is sum of prices in last k/2
        const mid = start + k / 2;
        const newWindowProfit = prefixPrices[end] - prefixPrices[mid]; // Only last k/2 contribute to the profit

        // Calculate improvement for this window
        const improvement = newWindowProfit - originalWindowProfit;
        maxImprovement = Math.max(maxImprovement, improvement);
    }

    return baseProfit + maxImprovement;
};