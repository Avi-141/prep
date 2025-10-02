/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */
var maximumScore = function(a, b, c) {
    let maxHeap = new PriorityQueue((a,b) => b - a);
    maxHeap.push(a);
    maxHeap.push(b);
    maxHeap.push(c);
    let count = 0;
    while(maxHeap.size() > 1){
        let pile1 = maxHeap.pop();
        let pile2 = maxHeap.pop();
        count ++;
        pile1--
        pile2--
        if(pile1>0) maxHeap.push(pile1)
        if(pile2>0) maxHeap.push(pile2)
    }
    return count;
};

var maximumScore = function(a, b, c) {
    const pileSum = a+b+c;
    const arr = [a,b,c]
    const maxPile = Math.max(...arr)
    return Math.min(Math.floor(pileSum/2), pileSum - maxPile)
}