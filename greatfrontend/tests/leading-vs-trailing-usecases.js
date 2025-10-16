// leading-vs-trailing-usecases.js
// Demonstrates when to use leading edge, trailing edge, or both

console.log('=== LEADING vs TRAILING EDGE USE CASES ===\n');

// ============================================================================
// SCENARIO 1: BUTTON CLICK - LEADING EDGE ONLY
// ============================================================================
console.log('📌 SCENARIO 1: SAVE BUTTON (Leading Edge Only)\n');
console.log('Use case: Prevent double-clicks on a "Save" button');
console.log('Requirement: Execute IMMEDIATELY on first click, ignore rapid follow-ups');
console.log('Why: User expects instant feedback, subsequent clicks are accidental\n');

function throttleLeadingOnly(func, wait) {
  let timeoutID = null;
  return function(...args) {
    if (timeoutID) return; // Still throttling, ignore
    
    // Execute immediately (LEADING EDGE)
    func.apply(this, args);
    
    // Block further calls for wait period
    timeoutID = setTimeout(() => {
      timeoutID = null;
    }, wait);
  };
}

let saveCount = 0;
const saveButton = throttleLeadingOnly(() => {
  saveCount++;
  console.log(`  ✓ Saving... (save #${saveCount})`);
}, 1000);

console.log('User rapidly clicks Save button:');
saveButton(); // t=0
setTimeout(() => saveButton(), 100);  // t=100
setTimeout(() => saveButton(), 200);  // t=200
setTimeout(() => saveButton(), 500);  // t=500

setTimeout(() => {
  console.log(`Result: ${saveCount} saves (expected: 1)`);
  console.log('✅ Prevented accidental double-clicks!\n');
  
  // ============================================================================
  // SCENARIO 2: INFINITE SCROLL - TRAILING EDGE ONLY
  // ============================================================================
  setTimeout(() => {
    console.log('📌 SCENARIO 2: INFINITE SCROLL (Trailing Edge Only)\n');
    console.log('Use case: Check scroll position to load more content');
    console.log('Requirement: Check FINAL scroll position after user stops scrolling');
    console.log('Why: We care about where user ENDS UP, not intermediate positions\n');

    function throttleTrailingOnly(func, wait) {
      let timeoutID = null;
      let lastArgs = null;
      let lastThis = null;

      return function(...args) {
        lastArgs = args;
        lastThis = this;

        // Clear existing timer
        if (timeoutID) {
          clearTimeout(timeoutID);
        }

        // Schedule execution at the end (TRAILING EDGE)
        timeoutID = setTimeout(() => {
          func.apply(lastThis, lastArgs);
          timeoutID = null;
        }, wait);
      };
    }

    let scrollY = 0;
    const checkScroll = throttleTrailingOnly(() => {
      console.log(`  📊 Checking scroll position: ${scrollY}px`);
      if (scrollY >= 400) {
        console.log(`  🔄 Loading more content...`);
      }
    }, 200);

    console.log('User scrolls rapidly then stops:');
    scrollY = 0; checkScroll();   console.log(`t=0:   scrollY = ${scrollY}`);
    setTimeout(() => { scrollY = 100; checkScroll(); console.log(`t=50:  scrollY = ${scrollY}`); }, 50);
    setTimeout(() => { scrollY = 200; checkScroll(); console.log(`t=100: scrollY = ${scrollY}`); }, 100);
    setTimeout(() => { scrollY = 300; checkScroll(); console.log(`t=150: scrollY = ${scrollY}`); }, 150);
    setTimeout(() => { scrollY = 450; checkScroll(); console.log(`t=180: scrollY = ${scrollY} (FINAL)`); }, 180);

    setTimeout(() => {
      console.log('✅ Checked only FINAL position (450px), not intermediate values!\n');

      // ============================================================================
      // SCENARIO 3: WINDOW RESIZE - BOTH EDGES
      // ============================================================================
      setTimeout(() => {
        console.log('📌 SCENARIO 3: WINDOW RESIZE (Both Leading + Trailing)\n');
        console.log('Use case: Recalculate layout when window is resized');
        console.log('Requirement: Respond IMMEDIATELY to start, then capture FINAL size');
        console.log('Why: Instant visual feedback + accurate final calculation\n');

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
              // LEADING EDGE
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

        let width = 1024;
        const recalculateLayout = throttleBothEdges(() => {
          console.log(`  🎨 Recalculating layout for width: ${width}px`);
        }, 150);

        console.log('User resizes window:');
        width = 1024; recalculateLayout(); console.log(`t=0:   width = ${width}`);
        setTimeout(() => { width = 900; recalculateLayout(); console.log(`t=50:  width = ${width}`); }, 50);
        setTimeout(() => { width = 800; recalculateLayout(); console.log(`t=100: width = ${width}`); }, 100);
        setTimeout(() => { width = 768; recalculateLayout(); console.log(`t=120: width = ${width} (FINAL)`); }, 120);

        setTimeout(() => {
          console.log('✅ Calculated at START (1024px) and END (768px)\n');

          // ============================================================================
          // SCENARIO 4: SEARCH INPUT - TRAILING EDGE ONLY
          // ============================================================================
          setTimeout(() => {
            console.log('📌 SCENARIO 4: SEARCH AUTOCOMPLETE (Trailing Edge Only)\n');
            console.log('Use case: Fetch search results as user types');
            console.log('Requirement: Wait until user STOPS typing, then search');
            console.log('Why: Avoid excessive API calls, get final query\n');

            let query = '';
            const searchAPI = throttleTrailingOnly((q) => {
              console.log(`  🔍 Searching API for: "${q}"`);
            }, 300);

            console.log('User types "react hooks":');
            query = 'r'; searchAPI(query); console.log(`t=0:   "${query}"`);
            setTimeout(() => { query = 're'; searchAPI(query); console.log(`t=50:  "${query}"`); }, 50);
            setTimeout(() => { query = 'rea'; searchAPI(query); console.log(`t=100: "${query}"`); }, 100);
            setTimeout(() => { query = 'reac'; searchAPI(query); console.log(`t=150: "${query}"`); }, 150);
            setTimeout(() => { query = 'react'; searchAPI(query); console.log(`t=200: "${query}"`); }, 200);
            setTimeout(() => { query = 'react '; searchAPI(query); console.log(`t=250: "${query}"`); }, 250);
            setTimeout(() => { query = 'react h'; searchAPI(query); console.log(`t=300: "${query}"`); }, 300);
            setTimeout(() => { query = 'react ho'; searchAPI(query); console.log(`t=350: "${query}"`); }, 350);
            setTimeout(() => { query = 'react hoo'; searchAPI(query); console.log(`t=400: "${query}"`); }, 400);
            setTimeout(() => { query = 'react hook'; searchAPI(query); console.log(`t=450: "${query}"`); }, 450);
            setTimeout(() => { query = 'react hooks'; searchAPI(query); console.log(`t=500: "${query}" (FINAL)`); }, 500);

            setTimeout(() => {
              console.log('✅ Only searched FINAL query ("react hooks"), not every keystroke!\n');

              // ============================================================================
              // SCENARIO 5: GAME SHOOTING - LEADING EDGE ONLY
              // ============================================================================
              setTimeout(() => {
                console.log('📌 SCENARIO 5: GAME SHOOT BUTTON (Leading Edge Only)\n');
                console.log('Use case: Limit fire rate in a game');
                console.log('Requirement: Fire IMMEDIATELY when triggered, enforce cooldown');
                console.log('Why: Instant response, prevent rapid-fire exploits\n');

                let bullets = 0;
                const shoot = throttleLeadingOnly(() => {
                  bullets++;
                  console.log(`  💥 BANG! (bullet #${bullets})`);
                }, 500);

                console.log('Player holds down fire button:');
                shoot(); // t=0
                setTimeout(() => shoot(), 100);
                setTimeout(() => shoot(), 200);
                setTimeout(() => shoot(), 300);
                setTimeout(() => shoot(), 400);
                setTimeout(() => shoot(), 600); // After cooldown

                setTimeout(() => {
                  console.log(`Result: ${bullets} bullets fired (expected: 2)`);
                  console.log('✅ Enforced 500ms cooldown between shots!\n');

                  // ============================================================================
                  // SUMMARY
                  // ============================================================================
                  setTimeout(() => {
                    console.log('=== SUMMARY ===\n');
                    console.log('┌─────────────────────────────────────────────────────────────┐');
                    console.log('│ LEADING EDGE ONLY (Execute First, Ignore Rest)             │');
                    console.log('├─────────────────────────────────────────────────────────────┤');
                    console.log('│ ✓ Button clicks (Save, Submit, Like)                       │');
                    console.log('│ ✓ Game actions (Shoot, Jump, Attack)                       │');
                    console.log('│ ✓ Navigation (Route changes)                                │');
                    console.log('│ ✓ Modal/Dialog open                                         │');
                    console.log('│                                                             │');
                    console.log('│ WHY: User expects INSTANT feedback, subsequent calls are    │');
                    console.log('│      accidental or spam. We want the FIRST action only.    │');
                    console.log('└─────────────────────────────────────────────────────────────┘\n');

                    console.log('┌─────────────────────────────────────────────────────────────┐');
                    console.log('│ TRAILING EDGE ONLY (Execute Last, Ignore Intermediate)     │');
                    console.log('├─────────────────────────────────────────────────────────────┤');
                    console.log('│ ✓ Search/Autocomplete (wait until typing stops)            │');
                    console.log('│ ✓ Form validation (validate final input)                   │');
                    console.log('│ ✓ Drag-and-drop position updates (final position)          │');
                    console.log('│ ✓ Text editor autosave (save final state)                  │');
                    console.log('│                                                             │');
                    console.log('│ WHY: We care about the FINAL state after activity stops,   │');
                    console.log('│      not intermediate values. Reduces unnecessary work.    │');
                    console.log('└─────────────────────────────────────────────────────────────┘\n');

                    console.log('┌─────────────────────────────────────────────────────────────┐');
                    console.log('│ BOTH EDGES (Execute First + Last)                          │');
                    console.log('├─────────────────────────────────────────────────────────────┤');
                    console.log('│ ✓ Window resize (instant feedback + final layout)          │');
                    console.log('│ ✓ Scroll handlers (initial + final position)               │');
                    console.log('│ ✓ Mouse move tracking (start + end coordinates)            │');
                    console.log('│ ✓ Slider/Range input (immediate + final value)             │');
                    console.log('│                                                             │');
                    console.log('│ WHY: Need IMMEDIATE visual feedback (leading) AND accurate │');
                    console.log('│      final state (trailing). Best of both worlds.          │');
                    console.log('└─────────────────────────────────────────────────────────────┘\n');

                    console.log('💡 KEY INSIGHT:');
                    console.log('   Leading = "React to the START of user action"');
                    console.log('   Trailing = "React to the END of user action"');
                    console.log('   Both = "React to START and END"\n');

                    console.log('🎯 DEFAULT RECOMMENDATION:');
                    console.log('   Use BOTH edges unless you have a specific reason not to.');
                    console.log('   Most throttle libraries (lodash) default to both edges.\n');

                    console.log('=== END ===');
                  }, 100);
                }, 700);
              }, 900);
            }, 900);
          }, 300);
        }, 300);
      }, 500);
    }, 400);
  }, 600);
}, 600);
