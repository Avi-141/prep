
/*
F - Two Sequence Queries
Use atcoder lazy segment tree template.
For each node in segment tree maintain sum of ai, sum of bi, sum of ai*bi, and length of node.

Lets say for a particular node we want to add each ai by X, and each bi by Y

sum ai changes to sum ai + X*len
sum bi changes to sum bi + Y*len
len remains same.

See how does sum ai*bi changes.
(ai+X)*(bi+Y) = ai*bi + X*bi + Y*ai + X*Y

So new value of sum ai*bi will be
old value + X * sum bi + Y * sum ai + X*Y*len

*/