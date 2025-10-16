// infinite-scroll-comparison.js
// Comparing throttle strategies for infinite scroll

console.log('=== INFINITE SCROLL: WHICH THROTTLE STRATEGY? ===\n');

// Setup: Three different throttle implementations
function throttleLeadingOnly(func, wait) {
  let timeoutID = null;
  return function(...args) {
    if (timeoutID) return;
    func.apply(this, args);
    timeoutID = setTimeout(() => { timeoutID = null; }, wait);
  };
}

function throttleTrailingOnly(func, wait) {
  let timeoutID = null;
  let lastArgs = null;
  let lastThis = null;
  return function(...args) {
    lastArgs = args;
    lastThis = this;
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      func.apply(lastThis, lastArgs);
      timeoutID = null;
    }, wait);
  };
}

function throttleBothEdges(func, wait) {
  let lastCallTime = 0;
  let timeoutID = null;
  let lastArgs = null;
  let lastThis = null;

  function later() {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    if (timeSinceLastCall >= wait) {
      timeoutID = null;
      if (lastArgs) {
        lastCallTime = now;
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      }
    } else {
      timeoutID = setTimeout(later, wait - timeSinceLastCall);
    }
  }

  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    lastArgs = args;
    lastThis = this;

    if (timeSinceLastCall >= wait) {
      lastCallTime = now;
      func.apply(this, args);
      if (timeoutID !== null) {
        clearTimeout(timeoutID);
        timeoutID = null;
      }
    } else if (timeoutID === null) {
      timeoutID = setTimeout(later, wait - timeSinceLastCall);
    }
  };
}

// ============================================================================
// SCENARIO: Infinite Scroll Implementation
// ============================================================================

const THRESHOLD = 300; // pixels from bottom to trigger load
const THROTTLE_WAIT = 200; // ms

console.log('📜 SCENARIO: User scrolls down a feed (Twitter, Instagram, etc.)\n');
console.log(`Settings: Trigger when ${THRESHOLD}px from bottom, throttle ${THROTTLE_WAIT}ms\n`);

// Simulate scroll positions
const scrollEvents = [
  { time: 0,   scrollY: 0,    distFromBottom: 1000 },
  { time: 50,  scrollY: 200,  distFromBottom: 800 },
  { time: 100, scrollY: 400,  distFromBottom: 600 },
  { time: 150, scrollY: 600,  distFromBottom: 400 },
  { time: 200, scrollY: 700,  distFromBottom: 300 }, // AT THRESHOLD
  { time: 250, scrollY: 750,  distFromBottom: 250 }, // PAST THRESHOLD
  { time: 280, scrollY: 780,  distFromBottom: 220 }, // FINAL (stops scrolling)
];

console.log('User scroll pattern:');
scrollEvents.forEach(e => {
  const marker = e.distFromBottom <= THRESHOLD ? '⚠️  SHOULD LOAD' : '';
  console.log(`  t=${e.time}ms: ${e.distFromBottom}px from bottom ${marker}`);
});
console.log('');

// ============================================================================
// TEST 1: LEADING ONLY
// ============================================================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 1: LEADING EDGE ONLY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let leadingChecks = [];
const checkScrollLeading = throttleLeadingOnly((distFromBottom) => {
  leadingChecks.push(distFromBottom);
  const shouldLoad = distFromBottom <= THRESHOLD;
  console.log(`  ✓ Checked: ${distFromBottom}px from bottom ${shouldLoad ? '→ LOADING MORE' : ''}`);
}, THROTTLE_WAIT);

console.log('Simulating scroll events:\n');
scrollEvents.forEach((e, i) => {
  setTimeout(() => {
    checkScrollLeading(e.distFromBottom);
  }, e.time);
});

setTimeout(() => {
  console.log(`\nResult: Checked positions: [${leadingChecks.join(', ')}]px`);
  const loadedAtCorrectTime = leadingChecks.some(d => d <= THRESHOLD);
  console.log(`Did we trigger load? ${loadedAtCorrectTime ? '✅ Yes' : '❌ No'}`);
  console.log('\n❌ PROBLEM: Only checked at t=0 (1000px) and t=200 (300px)');
  console.log('   If user scrolls PAST threshold and stops, we might miss it!');
  console.log('   Example: If they scroll to 250px at t=250 but we already');
  console.log('   checked at t=200, we won\'t check again until t=400.\n');

  // ============================================================================
  // TEST 2: TRAILING ONLY
  // ============================================================================
  setTimeout(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: TRAILING EDGE ONLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let trailingChecks = [];
    const checkScrollTrailing = throttleTrailingOnly((distFromBottom) => {
      trailingChecks.push(distFromBottom);
      const shouldLoad = distFromBottom <= THRESHOLD;
      console.log(`  ✓ Checked: ${distFromBottom}px from bottom ${shouldLoad ? '→ LOADING MORE' : ''}`);
    }, THROTTLE_WAIT);

    console.log('Simulating scroll events:\n');
    scrollEvents.forEach((e) => {
      setTimeout(() => {
        checkScrollTrailing(e.distFromBottom);
      }, e.time);
    });

    setTimeout(() => {
      console.log(`\nResult: Checked positions: [${trailingChecks.join(', ')}]px`);
      const loadedAtCorrectTime = trailingChecks.some(d => d <= THRESHOLD);
      console.log(`Did we trigger load? ${loadedAtCorrectTime ? '✅ Yes' : '❌ No'}`);
      console.log('\n⚠️  PROBLEM: Waits until user STOPS scrolling');
      console.log('   If user is actively scrolling through content, no checks happen!');
      console.log('   User sees: "Where\'s the content? Is it loading?"');
      console.log('   Bad UX: Appears laggy/unresponsive during scroll.\n');

      // ============================================================================
      // TEST 3: BOTH EDGES (RECOMMENDED)
      // ============================================================================
      setTimeout(() => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('TEST 3: BOTH EDGES (RECOMMENDED)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        let bothChecks = [];
        const checkScrollBoth = throttleBothEdges((distFromBottom) => {
          bothChecks.push(distFromBottom);
          const shouldLoad = distFromBottom <= THRESHOLD;
          console.log(`  ✓ Checked: ${distFromBottom}px from bottom ${shouldLoad ? '→ LOADING MORE' : ''}`);
        }, THROTTLE_WAIT);

        console.log('Simulating scroll events:\n');
        scrollEvents.forEach((e) => {
          setTimeout(() => {
            checkScrollBoth(e.distFromBottom);
          }, e.time);
        });

        setTimeout(() => {
          console.log(`\nResult: Checked positions: [${bothChecks.join(', ')}]px`);
          const loadedAtCorrectTime = bothChecks.some(d => d <= THRESHOLD);
          console.log(`Did we trigger load? ${loadedAtCorrectTime ? '✅ Yes' : '❌ No'}`);
          console.log('\n✅ PERFECT: Checks immediately during scroll (leading)');
          console.log('   AND captures final position (trailing).');
          console.log('   - Responsive: Detects threshold crossing quickly');
          console.log('   - Accurate: Doesn\'t miss final position');
          console.log('   - Efficient: Throttles to avoid excessive checks\n');

          // ============================================================================
          // SUMMARY & RECOMMENDATIONS
          // ============================================================================
          setTimeout(() => {
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('                    SUMMARY & RECOMMENDATION');
            console.log('═══════════════════════════════════════════════════════════════\n');

            console.log('┌─────────────────────────────────────────────────────────────┐');
            console.log('│ LEADING ONLY                                                │');
            console.log('├─────────────────────────────────────────────────────────────┤');
            console.log('│ ❌ Misses position updates between throttle windows         │');
            console.log('│ ❌ Can fail to detect threshold crossing                    │');
            console.log('│ ✓  Low overhead                                             │');
            console.log('│                                                             │');
            console.log('│ Verdict: NOT RECOMMENDED for infinite scroll               │');
            console.log('└─────────────────────────────────────────────────────────────┘\n');

            console.log('┌─────────────────────────────────────────────────────────────┐');
            console.log('│ TRAILING ONLY                                               │');
            console.log('├─────────────────────────────────────────────────────────────┤');
            console.log('│ ❌ Delays detection until user STOPS scrolling              │');
            console.log('│ ❌ Feels laggy and unresponsive                             │');
            console.log('│ ✓  Always captures final position                          │');
            console.log('│                                                             │');
            console.log('│ Verdict: NOT RECOMMENDED for infinite scroll               │');
            console.log('└─────────────────────────────────────────────────────────────┘\n');

            console.log('┌─────────────────────────────────────────────────────────────┐');
            console.log('│ BOTH EDGES ⭐ RECOMMENDED                                   │');
            console.log('├─────────────────────────────────────────────────────────────┤');
            console.log('│ ✅ Detects threshold quickly (leading edge)                 │');
            console.log('│ ✅ Captures final position (trailing edge)                  │');
            console.log('│ ✅ Responsive UX during active scrolling                    │');
            console.log('│ ✅ Accurate final state when scroll stops                   │');
            console.log('│ ✅ Throttles to prevent performance issues                  │');
            console.log('│                                                             │');
            console.log('│ Verdict: BEST CHOICE for infinite scroll ⭐                │');
            console.log('└─────────────────────────────────────────────────────────────┘\n');

            console.log('💡 TYPICAL IMPLEMENTATION:\n');
            console.log('```javascript');
            console.log('const checkScroll = throttle(() => {');
            console.log('  const distFromBottom = document.body.scrollHeight -');
            console.log('                         window.scrollY -');
            console.log('                         window.innerHeight;');
            console.log('  ');
            console.log('  if (distFromBottom < 300) {');
            console.log('    loadMoreContent();');
            console.log('  }');
            console.log('}, 200); // 200ms throttle with BOTH edges');
            console.log('');
            console.log('window.addEventListener("scroll", checkScroll);');
            console.log('```\n');

            console.log('🎯 ALTERNATIVE: Intersection Observer API');
            console.log('   For modern browsers, consider IntersectionObserver instead.');
            console.log('   It\'s more efficient and purpose-built for this use case:\n');
            console.log('```javascript');
            console.log('const observer = new IntersectionObserver((entries) => {');
            console.log('  if (entries[0].isIntersecting) {');
            console.log('    loadMoreContent();');
            console.log('  }');
            console.log('});');
            console.log('observer.observe(document.querySelector("#sentinel"));');
            console.log('```\n');

            console.log('📊 REAL-WORLD EXAMPLES:');
            console.log('   - Twitter/X: Uses throttled scroll + IntersectionObserver');
            console.log('   - Instagram: Throttled scroll with both edges');
            console.log('   - Reddit: IntersectionObserver for modern browsers');
            console.log('   - Facebook: Complex hybrid approach\n');

            console.log('═══════════════════════════════════════════════════════════════\n');
          }, 100);
        }, 550);
      }, 100);
    }, 550);
  }, 100);
}, 350);
