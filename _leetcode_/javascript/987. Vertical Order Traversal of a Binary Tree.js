/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
// sort by column (L to R)
// then sort by row (T to D)
// if row is same, sort by value

var verticalTraversal = function (root) {
    const queue = [[root, 0, 0]] // root is at 0,0 (row, col)
    const map = new Map(); // col : {row, value}
    let head = 0;
    let left = 0, right = 0;
    const result = [];

    while (head < queue.length) {
        const [node, row, col] = queue[head++]

        if (!map.has(col)) map.set(col, []) // all nodes of this column 'X'
        map.get(col).push([row, node.val])

        left = Math.min(left, col); // leftmost is min col
        right = Math.max(right, col) // rightmost is max col
        // if we do dfs then TC depends on Width, height, Log(height)

        if (node.left) queue.push([node.left, row + 1, col - 1])
        if (node.right) queue.push([node.right, row + 1, col + 1])
    }

    for (let c = left; c <= right; c++) {
        // for every column (verticals)
        // check if in same row, then sort by value
        const currentColumn = map.get(c) || [];
        // a[0] is row 
        // a[1] is value
        let currPath = [];
        currentColumn.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])
        for(const [row, val] of currentColumn){
            currPath.push(val)
        }
        result.push(currPath)
    }
    return result;
};