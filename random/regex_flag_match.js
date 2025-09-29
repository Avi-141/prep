/*
Groups and ranges indicate groups and ranges of expression characters. 
The regular expression x|y matches either "x" or "y".

const REGEXP = /blue|red/

"red flag".match(REGEXP)  // red
"blue flag".match(REGEXP)  // blue

// Matches "blue" in "blue flag" and "red" in "red flag".


Create a regular expression to match all red flag and blue flag in a string. 
You must use | in your expression. Flags can come in any order.

"red flag blue flag".match(REGEXP) ➞ ["red flag", "blue flag"]
"yellow flag red flag blue flag green flag".match(REGEXP) ➞ ["red flag", "blue flag"]
"pink flag red flag black flag blue flag green flag red flag ".match(REGEXP) ➞ ["red flag", "blue flag", "red flag"]
*/

const REGEXP = /\b(?:red|blue) flag\b/g;
// Use alternation to capture either color, then the word “flag”
/*
/.../g — regex literal with the global flag, so it finds all matches, not just the first.
\b — word boundary. Ensures we match whole words (so we don’t hit “blueish flag” or “redder flag”).

(?:red|blue) — non-capturing group with alternation:
    | means “or”, so this part matches either "red" or "blue".
    (?: ) is non-capturing (we’re grouping for logic, not for later retrieval). If you do want to capture which color matched, use (red|blue) instead.

    A literal space — requires a space between the color and "flag".
    flag — the word “flag”.

    \b — another word boundary, so we don’t match “flagship”.
*/