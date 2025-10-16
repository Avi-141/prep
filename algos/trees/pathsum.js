const dfs = (node, sum) => {
    if (!node) return false;
    if (!node.left && !node.right) return sum === node.data;
    const remain = sum - node.data;
    return dfs(node.left, remain) || dfs(node.right, remain);
};

return dfs(root, targetSum) ? 1 : 0;
// Given a binary tree and a sum, determine if the tree has a root-to-leaf path such that adding up all the values along the path equals the given sum.