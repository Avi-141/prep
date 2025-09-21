/**
 * @param {string} text
 * @param {string} brokenLetters
 * @return {number}
 */

// Hashmap 
var canBeTypedWords = function (text, brokenLetters) {
    const brokenKeys = new Set(brokenLetters);
    const words = text.split(" ")
    let count = 0;
    for (const word of words) {
        for (const c of word) {
            if (brokenKeys.has(c)) {
                count += 1;
                break;
            }
        }
    }
    return words.length - count;
};
// space and time o(n)
// can also use set.intersection



// using bit map
// o(1) space
function setBit(num, n) {
    return num | (1 << n);
}

var canBeTypedWords = function (text, brokenLetters) {
    // append a space to flush last word automatically
    text += ' ';
    // use 32 bit mask to represent broken letters
    let brokenMask = 0;
    for (let i = 0; i < brokenLetters.length; i++) {
        let charNum = brokenLetters.charCodeAt(i) - 97;
        brokenMask = setBit(brokenMask, charNum); // right shift and or
        // bitmask where 1 set means that is broken letter
    }

    let count = 0;
    let wordMask = 0;
    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch !== ' ') {
            const idx = text.charCodeAt(i) - 97;
            wordMask = setBit(wordMask, idx);
        } else {
            // end of word;
            if ((wordMask & brokenMask) === 0) count += 1; // can type word, no broken overlap
            wordMask = 0; // reset for next word
        }
    }
    return count;
}

// uses o(26) = o(1) memory
// no need of bitmask, can just use boolean array
var canBeTypedWords = function (text, brokenLetters) {
    let count = 0;
    const charBoolMap = Array(26).fill(false);
    for (const c of brokenLetters) {
        charBoolMap[c.charCodeAt(0) - 97] = true;
    }

    const words = text.split(" ");
    for (const w of words) {
        let isTypeable = true;
        for (const c of w) {
            if (charBoolMap[c.charCodeAt(0) - 97]) {
                isTypeable = false;
                break;
            }
        }
        if (isTypeable) count += 1;
    }
    return count;
}
