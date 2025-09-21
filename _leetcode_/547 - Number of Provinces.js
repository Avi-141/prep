/**
 * @param {number[][]} isConnected
 * @return {number}
 */


function numberOfProvinces(isConnected, visited, u, N){
    visited[u] = true;
    for(let v =0;v<N;v++){
        if(!visited[v] && isConnected[u][v]){
            numberOfProvinces(isConnected, visited, v, N)
        }
    }

}
  
var findCircleNum = function(matrix) {
    const N = matrix.length
    const nodes = N
    const visited = Array(nodes).fill(false);
    let ans = 0;
    for(let i=0;i<N;i++){
        if(!visited[i]){ 
            numberOfProvinces(matrix, visited, i, N)
            ans+=1;
        }
    }
    return ans
}