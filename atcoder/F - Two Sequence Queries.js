// AtCoder Lazy Segment Tree for F - Two Sequence Queries
class LazySegmentTree {
    constructor(n, a, b) {
        this.n = n;
        this.size = 1;
        while (this.size < n) this.size *= 2;
        
        // Node data: [sum_a, sum_b, sum_ab, len]
        this.data = Array(2 * this.size).fill(null).map(() => [0, 0, 0, 0]);
        this.lazy = Array(2 * this.size).fill(null).map(() => [0, 0]); // [lazy_a, lazy_b]
        
        // Initialize leaf nodes
        for (let i = 0; i < n; i++) {
            this.data[this.size + i] = [a[i], b[i], a[i] * b[i], 1];
        }
        
        // Build tree bottom-up
        for (let i = this.size - 1; i >= 1; i--) {
            this.update_node(i);
        }
    }
    
    // Merge two child nodes
    update_node(k) {
        const left = this.data[2 * k];
        const right = this.data[2 * k + 1];
        this.data[k] = [
            left[0] + right[0],     // sum_a
            left[1] + right[1],     // sum_b  
            left[2] + right[2],     // sum_ab
            left[3] + right[3]      // len
        ];
    }
    
    // Apply lazy updates to node k
    apply_lazy(k, x, y, len) {
        if (x === 0 && y === 0) return;
        
        const [sum_a, sum_b, sum_ab, node_len] = this.data[k];
        
        // Update node data
        // new_sum_ab = old_sum_ab + x*sum_b + y*sum_a + x*y*len
        this.data[k] = [
            sum_a + x * len,                    // new sum_a
            sum_b + y * len,                    // new sum_b
            sum_ab + x * sum_b + y * sum_a + x * y * len,  // new sum_ab
            node_len                            // len unchanged
        ];
        
        // Update lazy values
        this.lazy[k][0] += x;
        this.lazy[k][1] += y;
    }
    
    // Push lazy values down to children
    push_down(k, len) {
        if (this.lazy[k][0] === 0 && this.lazy[k][1] === 0) return;
        
        const [lazy_a, lazy_b] = this.lazy[k];
        
        // Apply to left child
        this.apply_lazy(2 * k, lazy_a, lazy_b, Math.floor(len / 2));
        
        // Apply to right child  
        this.apply_lazy(2 * k + 1, lazy_a, lazy_b, len - Math.floor(len / 2));
        
        // Clear parent's lazy values
        this.lazy[k] = [0, 0];
    }
    
    // Range update: add x to all ai, y to all bi in range [l, r)
    update(l, r, x, y) {
        this._update(l, r, x, y, 1, 0, this.size);
    }
    
    _update(l, r, x, y, k, tl, tr) {
        if (r <= tl || tr <= l) return;
        
        if (l <= tl && tr <= r) {
            // Complete overlap - apply lazy update
            this.apply_lazy(k, x, y, tr - tl);
            return;
        }
        
        // Partial overlap - push down and recurse
        this.push_down(k, tr - tl);
        
        const tm = Math.floor((tl + tr) / 2);
        this._update(l, r, x, y, 2 * k, tl, tm);
        this._update(l, r, x, y, 2 * k + 1, tm, tr);
        
        this.update_node(k);
    }
    
    // Range query: get sum of ai*bi in range [l, r)
    query(l, r) {
        return this._query(l, r, 1, 0, this.size);
    }
    
    _query(l, r, k, tl, tr) {
        if (r <= tl || tr <= l) return 0;
        
        if (l <= tl && tr <= r) {
            // Complete overlap - return sum_ab
            return this.data[k][2];
        }
        
        // Partial overlap - push down and recurse
        this.push_down(k, tr - tl);
        
        const tm = Math.floor((tl + tr) / 2);
        const left = this._query(l, r, 2 * k, tl, tm);
        const right = this._query(l, r, 2 * k + 1, tm, tr);
        
        return left + right;
    }
}

function solve() {
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    
    const [n, q] = input[0].split(' ').map(Number);
    const a = input[1].split(' ').map(Number);
    const b = input[2].split(' ').map(Number);
    
    const segtree = new LazySegmentTree(n, a, b);
    const results = [];
    
    for (let i = 0; i < q; i++) {
        const query = input[3 + i].split(' ').map(Number);
        
        if (query[0] === 1) {
            // Type 1: Update range [l-1, r) with x, y (convert to 0-indexed)
            const [, l, r, x, y] = query;
            segtree.update(l - 1, r, x, y);
        } else {
            // Type 2: Query range [l-1, r) (convert to 0-indexed)
            const [, l, r] = query;
            const result = segtree.query(l - 1, r);
            results.push(result);
        }
    }
    
    return results.join('\n');
}

const ans = solve();
console.log(ans);