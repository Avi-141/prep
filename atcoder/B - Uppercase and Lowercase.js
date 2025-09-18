function solve(){

    const fs = require('fs')
    const S = fs.readFileSync('/dev/stdin', 'utf8').trim()
    let uppercaseCnt = 0;
    let lowercaseCnt = 0;

    for(let char of S){
        if(char >= 'A' && char <='Z') uppercaseCnt+=1
        if(char >= 'a' && char <='z') lowercaseCnt+=1
    }

    if(uppercaseCnt > lowercaseCnt){
        return S.toUpperCase()
    }
    return S.toLowerCase()
}

const ans = solve();
console.log(ans)