/**
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
    const countD = (moves.match(/D/g) || []).length;
    const countU = (moves.match(/U/g) || []).length;
    const countL = (moves.match(/L/g) || []).length;
    const countR = (moves.match(/R/g) || []).length;
    if(countD === countU && countL === countR) return true
    return false

};