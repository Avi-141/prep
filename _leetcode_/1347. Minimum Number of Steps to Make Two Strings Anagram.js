/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var minSteps = function(s, t) {
    let count = Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        count[t.charCodeAt(i) - 97]++;
        console.log(count);
        count[s.charCodeAt(i) - 97]--;
        console.log(count)
    }

    // SUM if t > s occurences
    let ans = 0;
    // if t count > s count, get that diff, thats ans
    for(let i=0;i<26;i+=1){
        if(count[i] > 0) ans+=count[i]
    }
    return ans;
};