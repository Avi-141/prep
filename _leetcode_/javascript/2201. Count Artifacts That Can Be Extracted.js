/**
 * @param {number} n
 * @param {number[][]} artifacts
 * @param {number[][]} dig
 * @return {number}
 */

// Approach 1: Grid-based brute force extraction
const canExtract = (grid, artifact) => {
    const [r1, c1, r2, c2] = artifact;
    for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
            if (!grid[r][c]) return false;
        }
    }
    return true;
};

var digArtifacts = function(n, artifacts, dig) {
    let grid = new Array(n).fill(0).map(() => Array(n).fill(0));
    for (let [x, y] of dig) grid[x][y] = 1;
    let excavateCount = 0;
    for (let artifact of artifacts) {
        if (canExtract(grid, artifact)) excavateCount++;
    }
    return excavateCount;
};

// Approach 2: Hashset-based extraction
var digArtifacts = function(n, artifacts, dig) {
    // Map each cell to its artifact index and count remaining cells per artifact
    const cell2idx = new Map();
    const remCount = new Array(artifacts.length).fill(0);
    for (let idx = 0; idx < artifacts.length; idx++) {
        const [r1, c1, r2, c2] = artifacts[idx];
        for (let i = r1; i <= r2; i++) {
            for (let j = c1; j <= c2; j++) {
                const key = `${i},${j}`;
                cell2idx.set(key, idx);
                remCount[idx]++;
            }
        }
    }
    let extractCount = 0;
    // Process dig operations
    for (const [x, y] of dig) {
        const key = `${x},${y}`;
        if (cell2idx.has(key)) {
            const idx = cell2idx.get(key);
            // Decrement remaining count and remove cell to avoid duplicate processing
            remCount[idx]--;
            cell2idx.delete(key);
            // If all cells of artifact are dug, count it as extracted
            if (remCount[idx] === 0) {
                extractCount++;
            }
        }
    }
    return extractCount;
};