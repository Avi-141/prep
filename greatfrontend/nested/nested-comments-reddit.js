/*

Build a tree from a flat list like:
{id, parentId: null|id, body, score, createdAt, ...}


Render nested comments (often React).
Flatten a tree for things like search or virtualized lists.
Compute something over the tree (max depth, count, best path by score, etc.).
Handle “more” placeholders (lazy loads), deleted comments, or very deep tree
*/

function buildTree(comments) {
    const byId = new Map();
    const roots = [];

    // prime nodes and children arrays
    for (const c of comments) byId.set(c.id, { ...c, children: [] });

    // link children
    for (const c of byId.values()) {
        if (c.parentId == null) {
            roots.push(c);
        } else if (byId.has(c.parentId)) {
            byId.get(c.parentId).children.push(c);
        } else {
            // parent missing .. single node/comment, either push to roots or collect separately
            roots.push(c);
        }
    }

    // sort siblings (by score/time)
    const sortSiblings = node => {
        node.children.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);
        node.children.forEach(sortSiblings);
    };
    roots.forEach(sortSiblings);

    return roots;
}



function flattenTree(root) {
    const flat = [];
    // node, depth
    // const stack = root.slice().reverse().map((node) => [node, 0])
    function flatten(node, depth = 0) {
        return [
            { node, depth },
            ...node.children.flatMap(child => flatten(child, depth + 1))
        ]
    }

    return root.flatMap(root => flatten(root, 0))
}

function flattenTree(roots) {
    const flat = [];
    function traverse(node, depth) {
        flat.push({ node, depth })
        for (const child of node.children || []) {
            traverse(child, depth + 1)
        }
    }

    for (const root of roots) {
        traverse(root, 0);
    }
    return flat

}