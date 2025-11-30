/*

By using _.throttle, we don’t allow to our function to execute more than once every X milliseconds.

The main difference between this and debouncing is that throttle guarantees the execution of the function regularly, 
at least every X milliseconds. The same way than debounce, throttle technique is covered by underscore.js and lodash.
*/

/*
Infinite scrolling
A quite common example. The user is scrolling down your infinite-scrolling page. 
You need to check how far from the bottom the user is. 
If the user is near the bottom, we should request via Ajax more content and append it to the page.

Here our beloved _.debounce wouldn’t be helpful. 
It only would trigger only when the user stops scrolling....and we need to start fetching the content BEFORE the user reaches the bottom.

With _.throttle we can warranty that we are checking constantly how far we are from the bottom.
*/

// Simple throttle implementation
/**
 * @callback func
 * @param {number} wait
 * @return {Function}
 */


export default function throttle(func, wait) {
  // throttled function can be in two states
  // idle or active
  let shouldThrottle = false;
  // let lastArgs = null;
  // let lastContext = null
  // we need to set a timeout for wait until it can be invoked again

  return function (...args) {
    if (!shouldThrottle) return;

    shouldThrottle = true;
    setTimeout(function () {
      shouldThrottle = false;
    }, wait);

    func.apply(this, args);
  };
}

function throttleLeading(func, delay) {
  let lastRan = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastRan >= delay) {
      func.apply(this, args);
      lastRan = now;  // Record execution time
    }
  };
}

function throttleTrailing(func, delay) {
  let timeoutId = null;
  let lastArgs = null;
  
  return function(...args) {
    lastArgs = args;
    
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, lastArgs);
        timeoutId = null;
      }, delay);
    }
  };
}

function throttle(func, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  
  let timeoutId = null;
  let lastRan = 0;
  let lastArgs = null;
  
  return function(...args) {
    const now = Date.now();
    const timeSinceLastRan = now - lastRan;
    
    lastArgs = args;
    
    // Leading edge
    if (leading && timeSinceLastRan >= delay) {
      func.apply(this, args);
      lastRan = now;
      return;
    }
    
    // Trailing edge
    if (trailing) {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        func.apply(this, lastArgs);
        lastRan = Date.now();
        timeoutId = null;
      }, delay - timeSinceLastRan);
    }
  };
}

// Usage:
const leadingOnly = throttle(fn, 1000, { trailing: false });
const trailingOnly = throttle(fn, 1000, { leading: false });
const both = throttle(fn, 1000); // Default




export default function throttle(func, wait = 0) {
  let lastCallTime = 0;
  let timeoutID = null;
  let lastArgs = null;
  let lastThis = null;

  // later is called by setTimeout for trailing edge calls
  // later() is called by the timer (setTimeout) that was scheduled during the throttle window. 
  // It fires automatically after the delay expires.
  function later() {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall >= wait) {
      // Execute trailing call
      timeoutID = null;
      if (lastArgs) {
        lastCallTime = now;
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      }
    } else {
      // Not enough time passed, reschedule
      timeoutID = setTimeout(later, wait - timeSinceLastCall);
    }
  }

  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    // Store latest args for trailing call
    lastArgs = args;
    lastThis = this;

    if (timeSinceLastCall >= wait) {
      // LEADING EDGE PATH
      // Enough time passed - execute immediately (leading edge)
      lastCallTime = now;
      func.apply(this, args);
      
       // Clear any pending trailing call
       // Cancel any pending timer (edge case: timer from previous burst)
      // This is the first call after silence, or a call after the wait period.

      if (timeoutID !== null) {
        clearTimeout(timeoutID);
        timeoutID = null;
      }
    } else if (timeoutID === null) {
      // Within wait period and no timer set - schedule trailing call
      // No timer running yet - start one!
      timeoutID = setTimeout(later, wait - timeSinceLastCall);
    } // This schedules later() to fire at exactly wait ms after the lastFunctionTimestamp execution
    // else: within wait period and timer already running - just update lastArgs
  };
}

// https://css-tricks.com/debouncing-throttling-explained-examples/