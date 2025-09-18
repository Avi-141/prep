function solve(){
    const fs = require('fs');
    const A = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
    let p = 0;
    const N = A[p++];
    const M = A[p++];
    const hands = [];
    for(let i=2;i<=N+1;i++){
        hands.push(A[i])
    }
    const prefSum = [];
    prefSum[0] = hands[0]
    for(let i=1;i<N;i++){
        prefSum[i] = hands[i] + prefSum[i-1]
    }

    let aliens = 0;
    for(let i=0;i<prefSum.length;i+=1){
        if(prefSum[i] > M){
            break
        };
        aliens+=1;
    }

    return aliens

}

console.log(solve())