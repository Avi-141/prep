/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
export default function debounce(func, wait) {
    let timer = null;
    // Using func(...args) won’t preserve the this context from the caller
    //  which is important if func is a method depending on this. So:
    // we gotta use apply or call
    // const debouncedLog = debounce(console.log, 500);
    // debouncedLog("Hi"); // Will log "Hi" after 500ms
    return function (...args) {
        const context = this;
        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}



// debounce with immediate execution
// Many debounce implementations allow for leading edge execution 
// // (i.e., the function is called immediately, then debounced after).
// Useful for things like search input debouncing vs. click debouncing.
export default function debounce(func, wait = 0, immediate = false) {
  let timeoutID = null;

  return function (...args) {
    const callNow = immediate && !timeoutID;

    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      timeoutID = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

// with cancel method
// Can cancel a debounced call, e.g., on component unmount.
export default function debounce(func, wait = 0, immediate = false) {
  let timeoutID = null;

  const debounced = function (...args) {
    const callNow = immediate && !timeoutID;

    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      timeoutID = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };

  debounced.cancel = function() {
    clearTimeout(timeoutID);
    timeoutID = null;
  };

  return debounced;
}


// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
// https://medium.com/@griffinmichl/implementing-debounce-in-javascript-eab51a12311e