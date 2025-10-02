/**
 * @param {number[]} arr
 * @return {boolean}
 */

// Brute O(n^2)
var checkIfExist = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (i != j && arr[i] === 2 * arr[j]) {
                return true
            }
        }
    }
    return false
};

// Set O(n) space time
var checkIfExist = function (arr) {
    const seen = new Set();
    for (const num of arr) {
        // important condition of num%2
        if (seen.has(2 * num) || (num % 2 === 0 && seen.has(num / 2))) return true
        seen.add(num)
    }
    return false;
};


// Sort and binary search
// Array can have negeative numbers as well

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

var checkIfExist = function (arr) {
    arr.sort((a, b) => a - b);
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        const target = 2 * arr[i];
        const idx = binarySearch(arr, target);
        if (idx >= 0 && idx !== i) {
            return true;
        }
    }
    return false;
};


var checkIfExist = function (arr) {
    const freqMap = new Map();
    for (const num of arr) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1)
    }
    for(const num of arr){
        if(num !== 0 && freqMap.has(2*num)) return true;
        else if (freqMap.get(0) > 1) return true;
    }
    return false;

};

