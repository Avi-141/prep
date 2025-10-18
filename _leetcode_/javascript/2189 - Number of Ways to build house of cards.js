/**
 * @param {number} n
 * @return {number}
 */
var houseOfCards = function(n) {
    // base can be 2, 5 ,8 ans so on..
    let cards = new Array(n+1).fill(0);
    cards[0] = 1;
    for(let base=2;base<=n;base+=3){
        for(let top = n; top >=base; top --){
            cards[top] += cards[top - base]
        }
    }
    return cards[n]
};

/*

Items = possible base sizes: 2, 5, 8, 11, ... <= n
Each item can be used at most once
Count number of subsets that sum to n

We loop backwards in the inner loop to ensure:
Each base size (2, 5, 8, ...) is used at most once per combination.
This matches the physical constraint: each layer in the house of cards has a unique size.

In 0/1 knapsack, to ensure each item is used only once, we iterate the capacity from high to low.

i = the amount of cards used in your foundation, and j = the number of cards you have to place. so to find the number of combinations with j cards, you find the number of combinations you can make on top of your static foundation of i cards, which is the number of combinations you can make with j - i cards, which is dp[j - i]
*/