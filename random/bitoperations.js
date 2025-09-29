function dec2bin(num) {
    return num.toString(2);
}
// naive approach using bit shifts and max bit length
function bitwise(n1, n2, op) {
    const len = Math.max(n1.toString(2).length, n2.toString(2).length);
    let result = 0;
    for (let i = 0; i < len; i++) {
        const b1 = (n1 >> i) & 1;
        const b2 = (n2 >> i) & 1;
        if (op(b1, b2)) {
            result |= (1 << i);
        }
    }
    return result;
}

function bitwiseAND(n1, n2) {
    return bitwise(n1, n2, (b1, b2) => b1 === 1 && b2 === 1);
}

function bitwiseOR(n1, n2) {
    return bitwise(n1, n2, (b1, b2) => b1 === 1 || b2 === 1);
}

function bitwiseXOR(n1, n2) {
    return bitwise(n1, n2, (b1, b2) => (b1 === 1) !== (b2 === 1));
}

// String-based implementation: binary string padding approach
function bitwiseANDStr(n1, n2) {
    let s1 = dec2bin(n1);
    let s2 = dec2bin(n2);
    const maxLen = Math.max(s1.length, s2.length);
    s1 = s1.padStart(maxLen, '0');
    s2 = s2.padStart(maxLen, '0');
    let result = '';
    for (let i = 0; i < maxLen; i++) {
        result += (s1[i] === '1' && s2[i] === '1') ? '1' : '0';
    }
    // Remove leading zeros
    result = result.replace(/^0+/, '');
    const bin = result === '' ? '0' : result;
    return parseInt(bin, 2);
}

function bitwiseORStr(n1, n2) {
    let s1 = dec2bin(n1);
    let s2 = dec2bin(n2);
    const maxLen = Math.max(s1.length, s2.length);
    s1 = s1.padStart(maxLen, '0');
    s2 = s2.padStart(maxLen, '0');
    let result = '';
    for (let i = 0; i < maxLen; i++) {
        result += (s1[i] === '1' || s2[i] === '1') ? '1' : '0';
    }
    result = result.replace(/^0+/, '');
    const bin = result === '' ? '0' : result;
    return parseInt(bin, 2);
}

function bitwiseXORStr(n1, n2) {
    let s1 = dec2bin(n1);
    let s2 = dec2bin(n2);
    const maxLen = Math.max(s1.length, s2.length);
    s1 = s1.padStart(maxLen, '0');
    s2 = s2.padStart(maxLen, '0');
    let result = '';
    for (let i = 0; i < maxLen; i++) {
        result += (s1[i] !== s2[i]) ? '1' : '0';
    }
    result = result.replace(/^0+/, '');
    const bin = result === '' ? '0' : result;
    return parseInt(bin, 2);
}