/*
Given the root of a binary tree, return the length of the longest consecutive sequence path.
A consecutive sequence path is a path where the values increase by one along the path.
Note that the path can start at any node in the tree, and you cannot go from a node to its parent in the path.
*/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */


/*
Given the root of a binary tree, return the length of the longest consecutive sequence path.
A consecutive sequence path is a path where the values increase by one along the path.
Note that the path can start at any node in the tree, and you cannot go from a node to its parent in the path.
*/

/**
 * @param {TreeNode} root
 * @return {number}
 */
// [1,null,3,2,4,null,null,null,5]
// root, left, right, left, right ...
// its always longest increase sequence btw... bad description
var longestConsecutive = function(root) {
    let maxLength = 0;
    // closure
    function dfs(node, sequence = 0, previous){
        if(!node) return;
        if(node.val - 1 === previous) sequence +=1
        else sequence = 1;
        maxLength = Math.max(maxLength, sequence);
        dfs(node.left, sequence, node.val)
        dfs(node.right, sequence, node.val)
    }
    dfs(root);
    return maxLength;
};


var longestConsecutive = function(root){
    if(!root) return;
    let stack = [[root, 1]] // node, size
    let ans = 0;
    while(stack.length > 0){
        let node, length, top;
        top = stack.pop()
        node = top[0]
        length = top[1]
        ans = Math.max(ans, length)
        if(node.right){
            let runningLength = node.right.val - 1 === node.val ? length + 1: 1
            stack.push([node.right, runningLength])
        }
         if(node.left){
            let runningLength = node.left.val - 1 === node.val ? length + 1: 1
            stack.push([node.left, runningLength])
        }
    }
    return ans;
}