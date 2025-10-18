/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */

/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
// Brute force ... what if we did not have a unique solution?
// then we have to brute force
// greedy only works for single soln 
var canCompleteCircuit = function (gas, cost) {
    const totalGas = gas.reduce((sum, val) => sum + val, 0);
    const totalCost = cost.reduce((sum, val) => sum + val, 0);

    if (totalGas < totalCost) {
        return -1;
    }

    const n = gas.length;

    // Outer loop: try every station as a starting point
    for (let i = 0; i < n; i++) {
        let tank = 0;
        let possible = true;

        // Inner loop: simulate the journey of n steps from start i
        for (let j = 0; j < n; j++) {
            const currentStation = (i + j) % n;
            tank += gas[currentStation] - cost[currentStation];

            // If tank drops below zero, this starting point is invalid
            if (tank < 0) {
                possible = false;
                break;
            }
        }

        // If the inner loop completed without the tank going negative, we found the answer
        if (possible) {
            return i;
        }
    }

    return -1; // Should be unreachable because of the initial total gas check
};

// if current become negative at some i it means that all stations between that index and starting of jounrye will not be reachable and so we gotta start somewhere else.
// If car starts at A and can not reach B. Any station between A and B 
// can not reach B.(B is the first station that A can not reach.)
// there can be at most one valid station
var canCompleteCircuit = function (gas, cost) {
    const totalGas = gas.reduce((sum, val) => sum + val, 0);
    const totalCost = cost.reduce((sum, val) => sum + val, 0);

    if (totalGas < totalCost) return -1 // can never complete circuit

    let tankCapacity = 0;
    let startStation = 0

    for (let i = 0; i < gas.length; i++) {
        tankCapacity += gas[i] - cost[i]
        // If we run out of gas, the current startStation not viable. 
        // The new potential start must be after the current station i.
        if (tankCapacity < 0) {
            startStation = i + 1;
            tankCapacity = 0; // reset tank for new journey attempt
        }
    }
    return startStation;
}


// Variant to find all best stations
// best stations means one where we have maximum tank capacity left at the end of the trip

/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number[]} An array [start_index, max_fuel]
 */
var findBestCircuit = function(gas, cost) {
    const n = gas.length;
    let best_start_index = -1;
    let max_fuel_at_end = -1;

    // Optimization: if total gas is less than total cost, no solution exists.
    const totalGas = gas.reduce((sum, val) => sum + val, 0);
    const totalCost = cost.reduce((sum, val) => sum + val, 0);
    if (totalGas < totalCost) {
        return [-1, -1];
    }
    
    // Outer loop: Try every station as a starting point
    for (let i = 0; i < n; i++) {
        let tank = 0;
        let possible = true;
        
        // Inner loop: Simulate the journey of n steps from start i
        for (let j = 0; j < n; j++) {
            const currentStation = (i + j) % n;
            tank += gas[currentStation] - cost[currentStation];
            
            // If tank drops below zero, this starting point is invalid
            if (tank < 0) {
                possible = false;
                break;
            }
        }
        
        // If the inner loop completed, we have a valid starting point
        if (possible) {
            // Check if this solution is better than our best one so far
            if (tank > max_fuel_at_end) {
                max_fuel_at_end = tank;
                best_start_index = i;
            }
            // The tie-breaking rule (smallest index) is handled automatically
            // because we iterate i from 0 to n-1. The first time we find a max,
            // we'll record it. Any later start with the same fuel won't overwrite it.
        }
    }
    
    return [best_start_index, max_fuel_at_end];
};