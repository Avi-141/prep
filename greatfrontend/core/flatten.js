/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten_iterative(value) {
  const result = [];
  const copy = value.slice();

  // console.log("For", value);
  while (copy.length) {
    const item = copy.shift(); // pop it out
    if (Array.isArray(item)) {
      // console.log("Copy before", copy);
      copy.unshift(...item);
      // console.log("Copy after", copy);
    } else {
      result.push(item);
    }
  }
  return result;
}
// using .some operator
export default function flatten_using_some(value) {
  while (value.some(Array.isArray)) {
    value = [].concat(...value);
  }
  return value;
}

export default function flatten_using_reduce(value) {
  return value.reduce(
    (accumulator, current) =>
      accumulator.concat(
        Array.isArray(current) ? flatten_using_reduce(current) : current,
      ),
    [],
  );
}

export default function flattern_using_flatMap(val) {
  return Array.isArray(val)
    ? value.flatMap((item) => flattern_using_flatMap(item))
    : val;
}

export default function flatten(value) {
  return flatten_using_reduce(value);
}
