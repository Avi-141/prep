// compose(f1, f2, f3)(...args) => f1(f2(f3(...args)))
const compose = (...fns) => (...args) => {
  // (A) Identity: if no functions, just return the first argument unchanged.
  if (fns.length === 0) return args[0]; // identity for no fns

  // (B) Helper: detect Promises so we can chain async and sync seamlessly.
  const isThenable = v => v && typeof v.then === 'function';

    // (C) Start: call the RIGHTMOST function with ALL original args.
    // Every other function only gets ONE value (the previous result).
  let acc = fns[fns.length - 1](...args);

  // (D) Thread the result leftwards: each fn consumes the previous output.
  for (let i = fns.length - 2; i >= 0; i--) {
    const fn = fns[i];
    acc = isThenable(acc) ? acc.then(fn) : fn(acc);
  }
  return acc; // Value or Promise, depending on the chain
};


const add = (a, b) => a + b;
const double = x => x * 2;
const square = x => x * x;

const f = compose(square, double, add);
console.log(f(2, 3))

const fetchUser = async (id) => ({ id, name: "Avi" });
const getName = u => u.name;
const shout = s => s.toUpperCase();

const g = compose(shout, getName, fetchUser);
g(42).then(console.log); // "AVI"


// LEFT TO RIGHT VERSIONs
const pipe = (...fns) => (...args) =>
  compose(...fns.reverse())(...args);