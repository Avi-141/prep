/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} node
 * @return {number}
 */
var minCameraCover = function (node) {
    let numCameras = 0
    let Camera = { HAS_CAMERA: 0, COVERED: 1, PLEASE_COVER: 2 }
    return cover(node) === Camera.PLEASE_COVER ? ++numCameras : numCameras

    function cover(node){
        if(node === null) return Camera.COVERED; // leaf, already covered by its parent

        // try to cover left and right children's subtree
        let left = cover(node.left);
        let right = cover(node.right)

        if(left === Camera.PLEASE_COVER || right === Camera.PLEASE_COVER){
            numCameras ++
            return Camera.HAS_CAMERA; //
        }

        // now if any of left or right has a cam, then current is also covered as given
        if(left === Camera.HAS_CAMERA || right === Camera.HAS_CAMERA){
            return Camera.COVERED // 1 , already covered
        }

        return Camera.PLEASE_COVER;
    }
};

/*

Consider a node in the tree.
It can be covered by its parent, itself, its two children.
Four options.

Consider the root of the tree.
It can be covered by left child, or right child, or itself.
Three options.

Consider one leaf of the tree.
It can be covered by its parent or by itself.
Two options.

If camera at leaf, leaf and parent covered
If camera at parent, leaf, parent, and sibling covered..
// better to do option 2..

Here is our greedy solution:

Set cameras on all leaves' parents, thenremove all covered nodes.
Repeat step 1 until all nodes are covered.

If any child is uncovered (PLEASE_COVER), the current node MUST install a camera.
This is non-negotiable — otherwise, that child remains uncovered (violates problem constraint).

If a child has a camera, then current node is automatically covered.
So we return COVERED — no camera needed here.

Both children are COVERED (but have no cameras).
So current node is not covered, and can’t cover itself → asks parent via PLEASE_COVER.
*/