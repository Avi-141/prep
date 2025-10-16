function verticalOrder(root) {
  if (!root) return [];
  const colMap = new Map();           // col -> array of values
  let left = 0, right = 0;

  const queue = [[root, 0]];
  let head = 0;
  while (head < queue.length) {
    const [node, col] = queue[head++];

    if (!colMap.has(col)) colMap.set(col, []);
    colMap.get(col).push(node.val);

    left = Math.min(left, col);
    right = Math.max(right, col);

    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }

  const res = [];
  for (let c = left; c <= right; c++) {
    res.push(colMap.get(c) || []);
  }
  return res;
}