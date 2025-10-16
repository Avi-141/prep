/**
 * @param {string} s
 * @param {string} locked
 * @return {boolean}
 */
var canBeValid = function (s, locked) {
    if (s.length & 1) return false;
    let balance = 0;
    let len = s.length;

    for(let i=0;i<len;i++){
        if(s[i] === '(' || locked[i] === '0') balance +=1;
        else balance -=1; // 1 or )

        if(balance < 0) return false
    }

    balance = 0;
    for(let i=len-1;i >=0;i--){
        if(s[i] === ')' || locked[i] === '0') balance +=1
        else balance -=1
        if(balance < 0) return false
    }

    return true;
}