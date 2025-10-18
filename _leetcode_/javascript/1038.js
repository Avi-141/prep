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
 * @return {TreeNode}
 */
var bstToGst = function (root) {
    let sum = 0;

    function dfs(node) {
        if (!node) return 0;
        // Traverse the right subtree (nodes with larger values)
        if (node.right) dfs(node.right)
        // 2. Visit the current node: add its value to sum and update its value
        sum += node.val; // sum now includes current node and all previously processed (larger) nodes
        node.val = sum;  // Update current node's value to the accumulated sum
        if (node.left) dfs(node.left)
    }

    dfs(root)
    return root

};