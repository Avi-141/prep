/**
 * @param {number} n
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var minSensors = function (n, m, k) {
    const sensorLength = 2 * k + 1;
    const rowCover = Math.ceil(n / sensorLength)
    const colCover = Math.ceil(m / sensorLength)
    return rowCover * colCover
};