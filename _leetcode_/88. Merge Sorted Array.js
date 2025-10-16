/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */


var merge = function(nums1, m, nums2, n){
    // start, deleteCount, items
    nums1.splice(m, nums1.length - m, ...nums2)
    nums1.sort((a, b) => a - b)
}

var merge = function (nums1, m, nums2, n) {
    // let a = 0, b = 0;
    const result = [];
    let p1 = m - 1;
    let p2 = n - 1;
    // m + n for nums1
    // first m elements to merge, last n elements to ignore 
    // nums2 len n
    for (let p = m + n - 1; p >= 0; p--) {
        // for all possible elements in m+n size;
        if (p2 < 0) break;
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[p] = nums1[p1]
            p1--;
        } else {
            nums1[p] = nums2[p2]
            p2--;
        }
    }
    /*while (a < m && b < n && nums1[a] !== 0 && nums2[b] !== 0) {
        if (nums1[a] === nums2[b]) {
            a++
            b++
        }
        if (nums1[a] < nums2[b]) {
            result.push(nums1[a])
            a++
        } else {
            result.push(nums2[b])
            b++;
        }
    }

    while (a < m) {
        result.push(nums1[a])
        a++
    }

    while (b < n) {
        result.push(nums2[b])
        b++
    }
    */
};

