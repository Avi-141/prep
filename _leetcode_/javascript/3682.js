var numOfSubsequences = function(s) {
    let N = s.length;
    
    // Prefix count of 'L': LCount[i] = # of L's before position i
    let LCount = new Array(N + 1).fill(0);
    for (let i = 0; i < N; i++) {
        LCount[i + 1] = LCount[i] + (s[i] === 'L' ? 1 : 0);
    }
    
    // Suffix count of 'T': TCount[i] = # of T's from position i onwards
    let TCount = new Array(N + 1).fill(0);
    for (let i = N - 1; i >= 0; i--) {
        TCount[i] = TCount[i + 1] + (s[i] === 'T' ? 1 : 0);
    }
    
    // Calculate original count of LCT subsequences
    let originalCount = 0;
    for (let i = 0; i < N; i++) {
        if (s[i] === 'C') {
            originalCount += LCount[i] * TCount[i + 1];
        }
    }
    
    // Option 1: Insert 'L' at the beginning
    let insertL = 0;
    for (let i = 0; i < N; i++) {
        if (s[i] === 'C') {
            insertL += TCount[i + 1];
        }
    }
    
    // Option 2: Insert 'T' at the end
    let insertT = 0;
    for (let i = 0; i < N; i++) {
        if (s[i] === 'C') {
            insertT += LCount[i];
        }
    }
    
    // Option 3: Insert 'C' - try all positions and find max
    let maxInsertC = 0;
    for (let p = 0; p <= N; p++) {
        maxInsertC = Math.max(maxInsertC, LCount[p] * TCount[p]);
    }
    
    return originalCount + Math.max(insertL, insertT, maxInsertC);
};

// "CTTCCLCLLTTC"
