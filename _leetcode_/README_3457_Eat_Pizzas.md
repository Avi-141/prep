# LeetCode 3457: Eat Pizzas! 🍕

## Problem Statement

You are given an integer array `pizzas` where `pizzas[i]` represents the weight of the `i`th pizza. Every day, you eat exactly 4 pizzas.

Due to your incredible metabolism, when you eat pizzas of weights `W ≤ X ≤ Y ≤ Z`, you gain weight based on the day:
- **Odd days (1, 3, 5, ...)**: You gain weight `Z` (largest pizza)
- **Even days (2, 4, 6, ...)**: You gain weight `Y` (second largest pizza)

**Goal**: Find the maximum total weight you can gain by eating all pizzas optimally.

## Key Insights 🔑

### The Core Challenge
- We must eat pizzas in groups of 4
- We can't control which day we eat (alternates odd/even)
- We want to maximize `Z` values on odd days and `Y` values on even days

### The Solution Strategy
1. **Sort the pizzas** in ascending order
2. **Allocate optimally**: Give the biggest pizzas to odd days first
3. **For even days**: Use remaining pizzas, but position them as `Y` (second largest in groups)

## Algorithm Approaches

### Approach 1: Mathematical Grouping
```javascript
var maxWeight = function(pizzas) {
    pizzas.sort((a, b) => a - b);
    
    const n = pizzas.length;
    const totalDays = n / 4;
    const oddDays = Math.ceil(totalDays / 2);
    const evenDays = totalDays - oddDays;
    
    let weight = 0;
    
    // Take largest 'oddDays' pizzas for odd days
    for (let i = 0; i < oddDays; i++) {
        weight += pizzas[n - 1 - i];
    }
    
    // From remaining pizzas, take 2nd largest from each group of 4
    for (let i = 0; i < evenDays; i++) {
        const groupStart = i * 4;
        weight += pizzas[groupStart + 2]; // 3rd index = 2nd largest
    }
    
    return weight;
};
```

### Approach 2: Elegant Pointer Method ⭐
```javascript
var maxWeightPointer = function(p) {
    p.sort((a, b) => a - b);
    let n = p.length;
    let m = Math.floor(n / 4);
    let odd = Math.floor((m + 1) / 2); 
    let even = m - odd; 

    let sum = 0;
    let l = n - 1; // Start from largest pizza

    // Odd days: take the biggest available pizzas
    for (let i = 0; i < odd; i++) {
        sum += p[l]; 
        l--;
    }

    // Even days: skip Z, take Y, skip consumed pizzas
    for (let i = 0; i < even; i++) {
        l--; // Skip (this becomes Z but we don't gain its weight)
        sum += p[l]; // Take (this becomes Y - what we gain)
        l--; // Move past consumed pizzas
    }

    return sum; 
};
```

## Why the Pointer Approach Works 🎯

The pointer method is brilliant because it simulates the optimal allocation:

### For Odd Days:
- Take the absolute largest available pizza
- This pizza becomes `Z` in its group of 4
- We gain its full weight

### For Even Days:
- **Skip** the largest available (sacrifice it as `Z`)
- **Take** the next largest (this becomes `Y` - what we actually gain)
- **Skip** again (move past consumed pizzas)

## Example Walkthrough

**Input**: `[1,2,3,4,5,6,7,8]`

**After sorting**: `[1,2,3,4,5,6,7,8]`

**Days calculation**:
- Total days: 8/4 = 2 days
- Odd days: 1, Even days: 1

**Pointer approach**:
1. `l = 7` (pointing at 8)
2. **Odd day 1**: Take `pizzas[7] = 8`, `l = 6`
3. **Even day 1**: 
   - Skip `pizzas[6] = 7` (becomes Z), `l = 5`
   - Take `pizzas[5] = 6` (becomes Y), `l = 4`

**Result**: 8 + 6 = 14

**Actual groups formed**:
- Day 1 (odd): `[1,2,3,8]` → gain 8 (Z)
- Day 2 (even): `[4,5,6,7]` → gain 6 (Y)

## Time & Space Complexity

- **Time**: O(n log n) - dominated by sorting
- **Space**: O(1) - only using constant extra space

## Key Takeaways

1. **Global optimization beats local decisions** - you need to see all pizzas to allocate optimally
2. **Day-by-day simulation doesn't work** - requires global knowledge for optimal strategy
3. **The pointer approach elegantly models the allocation** - walking backwards through sorted array
4. **Even days require "sacrifice"** - skip the biggest to position the next biggest as Y

## Why Other Approaches Fail

❌ **Greedy day-by-day**: Doesn't have global knowledge to reserve best pizzas for odd days

❌ **Taking 3rd smallest on even days**: Suboptimal - should take from largest available pizzas

✅ **Pre-allocation strategy**: Reserve biggest pizzas for odd days first, then optimize even days