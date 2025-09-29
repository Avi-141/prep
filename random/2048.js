function leftSlide(row) {
    const result = [];
    const tiles = row.filter(v => v !== 0);
    for (let i = 0; i < tiles.length; ) {
        if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
            result.push(tiles[i] * 2);
            i += 2;
        } else {
            result.push(tiles[i]);
            i += 1;
        }
    }
    while (result.length < row.length) {
        // padd zeroes again at end
        result.push(0);
    }
    return result;
}

console.log(leftSlide([2,2,2,0]))


/*

2048 is a game where you need to slide numbered tiles (natural powers of 2) up, down, left or right on a square grid to combine them in a tile with the number 2048.

The sliding procedure is described by the following rules:

Tiles slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the grid.
If two tiles of the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided.
If more than one variant of merging is possible, move direction shows one that will take effect.
Tile cannot merge with another tile more than one time.
Sliding is done almost the same for each direction and for each row/column of the grid, so your task is to implement only the left slide for a single row.

Test.assertSimilar(leftSlide([2, 2, 2, 0]), [4, 2, 0, 0])
Test.assertSimilar(leftSlide([2, 2, 4, 4, 8, 8]), [4, 8, 16, 0, 0, 0])
Test.assertSimilar(leftSlide([0, 2, 0, 2, 4]), [4, 4, 0, 0, 0])
Test.assertSimilar(leftSlide([0, 2, 2, 8, 8, 8]), [4, 16, 8, 0, 0, 0])
Test.assertSimilar(leftSlide([0, 0, 0, 0]), [0, 0, 0, 0])
Test.assertSimilar(leftSlide([0, 0, 0, 2]), [2, 0, 0, 0])
Test.assertSimilar(leftSlide([2, 0, 0, 0]), [2, 0, 0, 0])
Test.assertSimilar(leftSlide([8, 2, 2, 4]), [8, 4, 4, 0])
Test.assertSimilar(leftSlide([1024, 1024, 1024, 512, 512, 256, 256, 128, 128, 64, 32, 32]), [2048, 1024, 1024, 512, 256, 64, 64, 0, 0, 0, 0, 0])
*/

//https://edabit.com/user/BkPgkDQGHm66X4Qai