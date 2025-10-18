/**
 * @param {number[]} pizzas
 * @return {number}
 */
var maxWeight = function(pizzas) {
    pizzas.sort((a, b) => a - b);
    
    const n = pizzas.length;
    const totalDays = n / 4;
    const oddDays = Math.ceil(totalDays / 2);
    const evenDays = totalDays - oddDays;
    
    let weight = 0;
    
    // For odd days: take the largest pizza from each group of 4
    // We take the biggest 'oddDays' pizzas
    for (let i = 0; i < oddDays; i++) {
        weight += pizzas[n - 1 - i];
    }
    // For even days: take the second largest from remaining groups of 4
    // After removing the top 'oddDays' pizzas, we have groups of 4
    // From each group, we want the 2nd largest (3rd index in sorted group)
    for (let i = 0; i < evenDays; i++) {
        const groupStart = i * 4;
        weight += pizzas[groupStart + 2]; // 3rd element (2nd largest) in the group
    }
    
    return weight;
};

var maxWeightPointer = function(p) {
    p.sort((a, b) => a - b);
    let n = p.length;
    let m = Math.floor(n / 4);
    let odd = Math.floor((m + 1) / 2); 
    let even = m - odd; 

    let sum = 0;
    let l = n - 1; // l = largest pizza

    // odd days,heaviest pizza
    for (let i = 0; i < odd; i++) {
        sum += p[l]; 
        l--; // move back as its picked.
    }

    // even days, second heaviest pizza 
    // I need to sacrifice the biggest available pizza as Z (skip it), 
    // but take the next biggest as Y (gain its weight)
    for (let i = 0; i < even; i++) {
        l--; // move back, dont take z
        sum += p[l]; // eat Y
        l--; // move back again (we have consumed 2 pizzas for this even day)
    }

    return sum; 
};

// day by day simulation will not work.
// it doesnt have global knowledge of all pizzas.

/*
# Intuition
You start by sorting so the largest pizzas sit at the end of the array.

### Compute day counts
m = n/4 total days (because you eat 4 pizzas per day)
odd = ⌊(m+1)/2⌋ odd-numbered days
even = m − odd even-numbered days
Initialize a pointer l = n−1 at the very largest pizza. (last opf array)

### Odd days loop
For each odd day:

You want the “Z” pizza (the largest in its group), so you simply take p[l] and add it to your sum. Then decrement l-- to move past that pizza.

### Even days loop
For each even day:

You must form a 4-pizza group where only the “Y” pizza (the second-largest) counts.
The current p[l] is the next largest pizza—if you ate it, that would be Z, but Z doesn’t count on even days, so you skip it by doing l--.
Now p[l] is the second-largest (“Y”) in that group; add it to your sum.
Finally, l-- again to move past that pizza, having “used up” both Z and Y from this group. THIS IS CRUCIAL.

By marching l backward, you can implicitly allocate the sorted array into optimal odd day picks and even day sacrifices + gains ever slicing or reshuffling subarrays. Each decrement of l corresponds to “using up” one pizza in a perfectly greedy way.
*/