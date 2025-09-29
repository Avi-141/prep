function tree(h) {
    const width = 2 * h - 1;
    const rows = [];
    // 2k-1
    for (let i = 1; i <= h; i++) {
        const stars = 2 * i - 1;
        const pad = (width - stars) / 2;
        rows.push(" ".repeat(pad) + "#".repeat(stars) + " ".repeat(pad))
    }
    return rows
}

function trunk(h) {
    const width = 2*h-1;
    const leaves = tree(h);
    // trunk: odd width, proportionate to tree height, at least 1×1
    const trunkHeight = Math.max(1, Math.floor(h / 3));
    let trunkWidth = Math.max(1, Math.floor(h / 3));
    if (trunkWidth % 2 === 0) trunkWidth++;           // make it odd
    trunkWidth = Math.min(trunkWidth, width);         // never wider than the tree

    const trunkPad = Math.floor((width - trunkWidth) / 2);
    for (let i = 0; i < trunkHeight; i++) {
        leaves.push(" ".repeat(trunkPad) + "|".repeat(trunkWidth) + " ".repeat(trunkPad));
    }
    return leaves;
}

console.log(trunk(5))
console.log(trunk(10))

/*
h=3
    #
   ###
  #####  
*/


/*

With trunk:
    *    
   ***   
  *****  
 ******* 
*********
   |||   
   |||   

*/