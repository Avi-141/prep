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
 * @return {number}
 */

// Great editorial: https://leetcode.com/problems/binary-tree-longest-consecutive-sequence-ii/solutions/127724/binary-tree-longest-consecutive-sequence-ii


var longestConsecutive = function(root) {
    // longestPath tracks the maximum consecutive sequence length found anywhere in the tree
    let longestPath = 0;

    // Recursive helper returns [incLen, decLen] for the subtree rooted at some node.
    // incLen = longest increasing sequence starting at node
    // decLen = longest decreasing sequence starting at node
    const findLongestPaths = node => {
        // null node has no sequences
        if (!node) return [0, 0]; // [incLen, decLen]

        // Start both lengths at 1 to include the current node itself
        let [incLen, decLen] = [1, 1];

        // Explore possible sequences in each child
        for (let child of [node.left, node.right]) {
            if (!child) continue;
            // get child's inc/dec path lengths
            const [childIncLen, childDecLen] = findLongestPaths(child);
            // If child.val == node.val + 1, it extends an increasing run
            if (child.val === node.val + 1) {
                incLen = Math.max(incLen, childIncLen + 1);
            }
            // If child.val == node.val - 1, it extends a decreasing run
            if (child.val === node.val - 1) {
                decLen = Math.max(decLen, childDecLen + 1);
            }
        }

        // Combine inc and dec runs through this node.
        // Subtract 1 to avoid counting this node twice.
        longestPath = Math.max(longestPath, incLen + decLen - 1);

        // Return path lengths including current node for parent
        return [incLen, decLen];
    };

    // Kick off recursion from the root
    findLongestPaths(root);

    // Result is the longest consecutive path found
    return longestPath;
};

var longestConsecutiveIterative = function(root) {
  if (!root) return 0;

  let longestPath = 0;
  const stack = [[root, false]];      // [node, visitedChildrenYet?]
  const memo  = new Map();            // node → [incLen, decLen]

  while (stack.length) {
    const [node, visited] = stack.pop();
    if (!node) continue;

    if (!visited) {
      stack.push([node, true]);
      stack.push([node.right, false]);
      stack.push([node.left,  false]);
    } else {
      // Both children are done so now can compute inc/dec from their memo
      let incLen = 1, decLen = 1;
      for (let child of [node.left, node.right]) {
        if (!child) continue;
        const [cInc, cDec] = memo.get(child);
        if (child.val === node.val + 1) incLen = Math.max(incLen, cInc + 1);
        if (child.val === node.val - 1) decLen = Math.max(decLen, cDec + 1);
      }
      longestPath = Math.max(longestPath, incLen + decLen - 1);
      memo.set(node, [incLen, decLen]);
    }
  }

  return longestPath;
}

// Longest Univalue Path
// same tree-DP + two-pass idea but for “all values equal” instead of ±1.
// Tree Diameter
// classic “longest path in a tree” DP (no value constraint, but same combine-two-sides pattern).
// Codeforces EDU “DP on Trees” (Section 2.4 in the EDU course) walks you through problems like “tree diameter,” “max path with constraints,” etc. Any “Tree and Queries” or “Tree DP” round problems—e.g. combining child results to compute a global optimum, just with different conditions.