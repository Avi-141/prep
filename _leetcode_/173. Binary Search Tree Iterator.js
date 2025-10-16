
function BSTIterator(root) {
  var stack = [];
  return {hasNext, next};

  function hasNext() {
    return root || stack.length;
  }

    /*
    The iterator does an in-order traversal lazily:
    Push the current node’s left chain.
    Pop the top (current smallest).
    Move to its right subtree (whose leftmost will be next)
    */

  function next() {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    var result = root.val;
    root = root.right;
    return result;
  }
}