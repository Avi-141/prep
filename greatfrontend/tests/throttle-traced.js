// throttle-traced.js
// Heavily instrumented version showing when later() is called

function throttle(func, wait = 0) {
  let lastCallTime = 0;
  let timeoutID = null;
  let lastArgs = null;
  let lastThis = null;
  let callNumber = 0; // for tracking

  function later() {
    console.log(`    [later() EXECUTED] timeoutID fired!`);
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    console.log(`      now=${now % 100000}, lastCallTime=${lastCallTime % 100000}, timeSinceLastCall=${timeSinceLastCall}ms, wait=${wait}ms`);
    
    if (timeSinceLastCall >= wait) {
      console.log(`      ✓ Enough time passed (${timeSinceLastCall} >= ${wait})`);
      // Execute trailing call
      timeoutID = null;
      if (lastArgs) {
        console.log(`      → Executing trailing edge with lastArgs`);
        lastCallTime = now;
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      } else {
        console.log(`      → No lastArgs, skip execution`);
      }
    } else {
      console.log(`      ✗ Not enough time (${timeSinceLastCall} < ${wait}), rescheduling`);
      // Not enough time passed, reschedule
      timeoutID = setTimeout(later, wait - timeSinceLastCall);
      console.log(`      → setTimeout(later, ${wait - timeSinceLastCall}ms)`);
    }
  }

  return function(...args) {
    callNumber++;
    const callNum = callNumber;
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    console.log(`\n  Call #${callNum} at t=${now % 100000}ms (${timeSinceLastCall}ms since last exec)`);
    
    // Store latest args for trailing call
    lastArgs = args;
    lastThis = this;
    console.log(`    Stored lastArgs=${JSON.stringify(args)}`);

    if (timeSinceLastCall >= wait) {
      console.log(`    ✓ timeSinceLastCall (${timeSinceLastCall}) >= wait (${wait})`);
      // Enough time passed - execute immediately (leading edge)
      console.log(`    → LEADING EDGE: Execute immediately`);
      lastCallTime = now;
      func.apply(this, args);
      
      // Clear any pending trailing call
      if (timeoutID !== null) {
        console.log(`    → Clearing old timeout`);
        clearTimeout(timeoutID);
        timeoutID = null;
      }
    } else if (timeoutID === null) {
      console.log(`    ✗ timeSinceLastCall (${timeSinceLastCall}) < wait (${wait})`);
      console.log(`    ✗ No timer running (timeoutID === null)`);
      // Within wait period and no timer set - schedule trailing call
      const delay = wait - timeSinceLastCall;
      console.log(`    → Schedule later() in ${delay}ms`);
      timeoutID = setTimeout(later, delay);
    } else {
      console.log(`    ✗ timeSinceLastCall (${timeSinceLastCall}) < wait (${wait})`);
      console.log(`    ✓ Timer already running (timeoutID !== null)`);
      console.log(`    → Just update lastArgs, timer will fire later`);
    }
    // else: within wait period and timer already running - just update lastArgs
  };
}

console.log('=== THROTTLE TRACE DEMO ===\n');
console.log('Scenario: Rapid calls with 100ms throttle\n');

let execCount = 0;
const traced = throttle((msg) => {
  execCount++;
  console.log(`      *** FUNC EXECUTED: "${msg}", execCount=${execCount} ***`);
}, 100);

console.log('Timeline:');
console.log('t=0:   Call #1');
console.log('t=30:  Call #2');
console.log('t=60:  Call #3');
console.log('t=90:  Call #4 (LAST call)');
console.log('t=100: later() should fire (90 + (100-90) = 100)');
console.log('\nExecution:\n');

traced('Call 1'); // t=0

setTimeout(() => {
  traced('Call 2'); // t=30
}, 30);

setTimeout(() => {
  traced('Call 3'); // t=60
}, 60);

setTimeout(() => {
  traced('Call 4 - LAST'); // t=90
}, 90);

setTimeout(() => {
  console.log('\n\n=== ANALYSIS ===');
  console.log(`Total executions: ${execCount}`);
  console.log(`Expected: 2 (leading at t=0, trailing at t=100)`);
  console.log(`Result: ${execCount === 2 ? '✅ CORRECT' : '❌ BUG'}`);
  
  console.log('\n=== KEY INSIGHT ===');
  console.log('later() is called BY THE TIMER (setTimeout)');
  console.log('It is NOT called directly by your code.');
  console.log('\nWhen is setTimeout(later, ...) created?');
  console.log('  → When a call arrives DURING the throttle window');
  console.log('  → AND no timer is already running (timeoutID === null)');
  console.log('\nWhat does later() do?');
  console.log('  → Checks if enough time has passed');
  console.log('  → If yes: executes the TRAILING EDGE with lastArgs');
  console.log('  → If no: reschedules itself (edge case)');
}, 200);
