var ans = function (A) {
    const ans = [];
    if (!A) return ans;

    const q = [A]; // queue of nodes that start diagonals

    while (q.length) {
      let node = q.shift();

      // Walk along the right chain (same diagonal)
      while (node) {
        ans.push(node.data);
        if (node.left) q.push(node.left); // left child starts the next diagonal
        node = node.right;                 // stay on current diagonal
      }
    }
    return ans;
}


var ans = function(A){
  let diagonals = new Map();
  function diagonalTraversal(node, diagonal){
    if(!node) return;
    if(!diagonals.has(diagonal)){
      diagonals.set(diagonal, [])
    }

    diagonals.get(diagonal.push(node.data))
    diagonalTraversal(node.left, diagonal + 1) // new diagonal
    // complete all lest, keep in call stack
    diagonalTraversal(node.right, diagonal)// same diagonal
    // unwind
   }
   diagonalTraversal(A, 0)
   return Array.from(diagonals.values()).flat()
}