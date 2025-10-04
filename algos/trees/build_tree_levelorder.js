// build a binary tree from level-order array
class TreeNode {
    constructor(){
    this.val = (val === undefined ? 0 : val);
    this.left = left;
    this.right = right;
    }
}
   

function buildTree(arr) {
    if (!arr || arr.length === 0) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    // let head = 0, tail = 0;
    while (i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] != null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] != null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}