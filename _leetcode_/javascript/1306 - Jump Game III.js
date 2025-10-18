/**
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
var canReach = function (steps, start) {
    const isVisited = steps[start] < 0
    if (start < 0 || start >= steps.length || isVisited) return false

    if (steps[start] === 0) return true
    const jump = steps[start];
    steps[start] *= -1; // mark as visited
    return canReach(steps, jump + start) || canReach(steps, start - jump)
};


var canReach = function (steps, start) {
    const N = steps.length;
    const queue = [];
    const visited = new Set();
    queue.push(start)
    visited.add(start)

    while (queue.length > 0) {
        const curr = queue.shift()
        if (steps[curr] === 0) return true
        
        const jump = steps[curr];
        const fwdJump = curr + jump;
        const bcwJump = curr - jump;
        if(fwdJump < N && !visited.has(fwdJump)){
            visited.add(fwdJump)
            queue.push(fwdJump)
        }

        if(bcwJump < N && !visited.has(bcwJump)){
            visited.add(bcwJump)
            queue.push(bcwJump)
        }
    }

    return false;
}