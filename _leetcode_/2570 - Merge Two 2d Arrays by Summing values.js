/**
 * @param {number[][]} nums1
 * @param {number[][]} nums2
 * @return {number[][]}
 */
var mergeArrays = function (nums1, nums2) {
    // const maxLen = Math.max(nums1.length, nums2.length);
    let ptr1 = 0, ptr2 = 0;
    const N = nums1.length;
    const M = nums2.length;
    const result = [];
    while (ptr1 < N && ptr2 < M) {
        const id1 = nums1[ptr1][0];
        const id2 = nums2[ptr2][0];
        const val1 = nums1[ptr1][1] || 0;
        const val2 = nums2[ptr2][1] || 0;
        // console.log(id1, id2, val1, val2)
        if (id1 === id2) {
            result.push([id1, val1 + val2])
            ptr1++;
            ptr2++;
        } else if (id1 < id2) {
            result.push([id1, val1])
            ptr1++;
        } else {
            result.push([id2, val2])
            ptr2++;
        }
    }

    while (ptr1 < N) {
        result.push(nums1[ptr1])
        ptr1++;
    }

    while (ptr2 < M) {
        result.push(nums2[ptr2])
        ptr2++;
    }

    // console.log(result)
    return result
};

/*
var mergeArrays = function (nums1, nums2) {
    // JS special.
    const combined = [...nums1, ...nums2];
    const summedMap = combined.reduce((accumulator, [id, value]) => {
        accumulator.set(id, (accumulator.get(id) || 0) + value);
        return accumulator;
    }, new Map())

    const result = [...summedMap].sort((a, b) => a[0] - b[0])
    return result;
}*/