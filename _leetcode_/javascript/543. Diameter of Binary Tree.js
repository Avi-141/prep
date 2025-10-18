/**
 * Definition for a binary tree node.
 * function TreeNode(val, leftDepth, rightDepth) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.leftDepth = (leftDepth===undefined ? null : leftDepth)
 *     this.rightDepth = (rightDepth===undefined ? null : rightDepth)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */

/*
Why dfs for maxDepth works?
It adds the heights of computer heights of subtrees as well
to find max diameter that passes through given node = root;
if this height, is global maximum, update max till now
*/

var diameterOfBinaryTree = function (root) {
    let diameter = 0;

    function dfs(node) {
        if (node === null) return 0;          
        // base: height of empty subtree
        const left = dfs(node.left);
        const right = dfs(node.right);
        // Why does left + right measure edges?
        diameter = Math.max(diameter, left + right); 
        // edges through this node
        // left + right is the number of edges from deepest left leaf to deepest right leaf through u.

        // The parent doesn’t need the child’s diameter;
        // it needs the child’s height to form its own candidate left + right.
        // dfs returns the height (to be used by the parent): 1 + max(left, right).
        // dfs returns height upward; diameter accumulates the best cross-node path
        // 
    // Return height upward so the parent can compute its candidate.
    // Update a global diameter at each node to track the best path anywhere.

        return 1 + Math.max(left, right);     
        // height in nodes
    }

    dfs(root);
    return diameter;
};