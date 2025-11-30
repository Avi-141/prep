if (!Array.prototype.myFilter) {
  /**
   * @template T
   * @param {(value: T, index: number, array: T[]) => boolean} callbackFn
   * @param {*} [thisArg]
   * @return {T[]}
   */
  Array.prototype.myFilter = function (callbackFn, thisArg) {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.myFilter called on null or undefined",
      );
    }

    if (typeof callbackFn !== "function") {
      throw new TypeError(callbackFn + " is not a function");
    }

    // Step 1: ToObject(this)
    const O = Object(this);

    // Step 2: ToLength(O.length)
    const len = O.length >>> 0;

    const result = [];
    let to = 0;

    for (let k = 0; k < len; k++) {
      if (Object.hasOwn(O, k)) {
        const kValue = O[k];
        // Important: thisArg is used as `this` inside callbackFn
        if (callbackFn.call(thisArg, kValue, k, O)) {
          result[to++] = kValue;
        }
      }
    }

    return result;
  };
}
