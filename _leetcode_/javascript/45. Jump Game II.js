
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    const n = nums.length;
    // This is like BFS as we need min jumps or shortest path..
    if (n <= 1) return 0;

    const queue = [[0, 0]]
    const visited = new Set([0])

    while (queue.length > 0) {
        const [currPosition, jumps] = queue.shift();
        if (currPosition === n - 1) return jumps;
        const maxReachablePosition = currPosition + nums[currPosition]

        const upperBoundOfJump = Math.min(maxReachablePosition, n - 1)
        for (let nextPos = currPosition + 1; nextPos <= upperBoundOfJump; nextPos++) {
            if (!visited.has(nextPos)) {
                visited.add(nextPos);
                queue.push([nextPos, jumps + 1])
            }
        }
    }
};


// Greedy solution.. Intuition not directly clear
var jump = function (nums) {
    const N = nums.length;
    // nums = 2 3 1 1 4
    for (let i = 1; i < N; i++) {
        nums[i] = Math.max(nums[i] + i, nums[i - 1])
    }
    // nums = 2 4 4 4 8

    let start = 0, jumps = 0;
    while (start < N -1) {
        jumps++;
        start = nums[start] // we have reached here..
    }

    return jumps

}