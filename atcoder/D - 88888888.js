// binary exponentiation or exponentiation by squaring
/*
    instead of mult(base, exp_times) -> O(exp)
    we reduce to O(log exp) operations

    13 = 2^3+2^2+2^0; == 1101 base 2
    5^13 = 5^(2^3+2^2+2^0) = 5^(2^3) + ...

*/
function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod; // avoid overflow.
    while (exp > 0) {
        // check if current bit of exp is 1
        // // last bit odd.
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        // square base for next bit position, as we are moving to next bit
        // move to next bit, right shift
        exp >>= 1;
    }
    return result
}

function modInv(a, mod) {
    return modPow(a, mod - 2, mod) // fermat little theorem.
}

function modPowBigInt(base, exp, mod) {
    let result = 1n
    base = base % mod
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1n
    }
    return result
}

function modInvBigInt(a, mod) {
    return modPowBigInt(a, mod - 2n, mod)
}

function solve() {
    const fs = require('fs')
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim()
    const N = BigInt(input)  // N can be up to 10^18
    const mod = 998244353n   // BigInT
    const digitCount = input.length

    // V_N = N * (10^(d*(N-1)) + 10^(d*(N-2)) + ... + 10^d + 1)
    // This is a geometric series with first term = 1, ratio = 10^d, count = N
    // Sum = (10^(d*N) - 1) / (10^d - 1)
    //For N with d digits:
    // Each copy of N takes up d positions
    
    const power10d = modPowBigInt(10n, BigInt(digitCount), mod)
    const power10dN = modPowBigInt(power10d, N, mod)
    
    const numerator = (power10dN - 1n + mod) % mod
    const denominator = (power10d - 1n + mod) % mod
    const denominatorInv = modInvBigInt(denominator, mod)
    
    const geometricSum = (numerator * denominatorInv) % mod
    const result = (N % mod * geometricSum) % mod
    
    return Number(result)
}

const ans = solve();
console.log(ans)