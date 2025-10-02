/**
 * Time Complexity: O(total_milestones * log n)
 * Space Complexity: O(n)
 */

// We must alternate between different projects
// Working on the two biggest projects is optimal (greedy approach)
// Now, How Much to Drain? Check for 3rd largest.
// What is "drain"? It's how many weeks we work on EACH of the top 2 projects
//  Total weeks added = drain * 2 (drain from a, drain from b)
// if (pq.size() > 0) {
    // const c = pq.root(); // Peek at 3rd largest
    // let drain = Math.max(b - c, 1);
    // idea from test case [100, 100, 100]:
    /*
            Heap: [100, 100, 100]
            Pop: a=100, b=100
            Drain ALL of b: drain=100
            count = 200, a=0
            Heap: [100]
            Final: 200 + 1 = 201 WRONG ANS
            
            // but if we peek at 3rd one..
            Heap: [100, 100, 100]
            Pop: a=100, b=100, peek c=100
            drain = max(100-100, 1) = 1
            count = 2, a=99, b=99
            Heap: [100, 99, 99]  so all three stay balanced

            Next iteration:
            Pop: a=100, b=99, peek c=99
            drain = max(99-99, 1) = 1
            count = 4, a=99, b=98
            Heap: [99, 99, 98]

            ... continues until everything is drained → 300! CORRECT
            By only draining until b reaches c, we keep all projects balanced, allowing us to continue alternating efficiently

            Math.max(b - c, 1) why??
            b - c: Drain enough so that b becomes equal to c
            The max(..., 1) ensures we always make progress even when b == c
            Without the 1, we'd be stuck in an infinite loop when all top 3 are equal!
    */

function numberOfWeeks(milestones) {
    const pq = new MaxHeap();
    
    // Add all milestones to the heap
    for (let milestone of milestones) {
        if (milestone > 0) {
            pq.insert(milestone);
        }
    }
    
    let count = 0;
    
    while (pq.size() > 1) {
        // Get top 2 projects
        let a = pq.extractRoot();
        let b = pq.extractRoot();
        
        // Check if there's a 3rd project
        if (pq.size() > 0) {
            const c = pq.root(); // Peek at 3rd largest
            
            // Only drain until b reaches c (to keep things balanced)
            // If b == c, drain at least 1 to make progress
            let drain = Math.max(b - c, 1);
            
            count += drain * 2;
            a -= drain;
            b -= drain;
        } else {
            // No 3rd project, drain all of b
            count += b * 2;
            a -= b;
            b = 0;
        }
        
        // Push back if they still have milestones
        if (a > 0) pq.insert(a);
        if (b > 0) pq.insert(b);
    }
    
    // If one project remains, we can do 1 more week
    if (pq.size() > 0) {
        count += 1;
    }
    
    return count;
}
//For [1000000000, 1, 1, 1], that's ~1 billion operations


// O(1)
function numberOfWeeks(milestones) {
    const total = milestones.reduce((sum, m) => sum + m, 0);
    const maxMilestone = Math.max(...milestones);
    
    // We can complete ALL milestones if and only if
    // the largest project doesn't dominate too much
    // If max <= (total + 1) / 2, we can finish everything
    // Otherwise, we're limited by alternation with the max project
    
    return Math.min(total, 2 * (total - maxMilestone) + 1);
}