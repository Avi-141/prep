/**
 * @param {Function} fn
 * @param {Array} args
 * @param {number} t
 * @return {Function}
 */
var cancellable = function (fn, args, t) {
    // setInterval(callback, delay) does not execute the callback immediately. 
    // It waits for the delay to pass, then it executes the callback for the first time, and continues to execute it every delay thereafter.
    fn(...args)
    const timer = setInterval(() => fn(...args), t)
    const cancelFn = () => clearInterval(timer);
    return cancelFn
    // The function cancelFn is not called when our cancellable function is first defined. 
    // However, whenever someone calls cancellable, the line return cancelFn, in order to return, will call and execute cancelFn, thereby cancelling the interval
    /* For example, if we define var myFunc = cancellable((num) => 1 + num, 13, 100), the interval will repeatedly call (num) => 1 + num until myFunc() is called. When myFunc() is called, the return line in myFunc is read, which will consequentially make cancelFn execute and return, thereby clearing the interval.
    */
};


/// setInterval using setTimeout recursive calls.
var cancellableRecursive = function (fn, args, t) {
    let timerId = null;
    fn(...args)

    const startInterval = () => {
        timerId = setTimeout(() => {
            fn(...args), startInterval()
        }, t)
    }
    startInterval();

    const cancelInterval = () =>{
        if(timerId) clearTimeout(timerId)
    }

    return cancelInterval;
}

/**
 *  const result = [];
 *
 *  const fn = (x) => x * 2;
 *  const args = [4], t = 35, cancelTimeMs = 190;
 *
 *  const start = performance.now();
 *
 *  const log = (...argsArr) => {
 *      const diff = Math.floor(performance.now() - start);
 *      result.push({"time": diff, "returned": fn(...argsArr)});
 *  }
 *       
 *  const cancel = cancellable(log, args, t);
 *
 *  setTimeout(cancel, cancelTimeMs);
 *   
 *  setTimeout(() => {
 *      console.log(result); // [
 *                           //     {"time":0,"returned":8},
 *                           //     {"time":35,"returned":8},
 *                           //     {"time":70,"returned":8},
 *                           //     {"time":105,"returned":8},
 *                           //     {"time":140,"returned":8},
 *                           //     {"time":175,"returned":8}
 *                           // ]
 *  }, cancelTimeMs + t + 15)    
 */