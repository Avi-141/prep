# IntersectionObserver API - Complete Guide

## 📖 What is IntersectionObserver?

IntersectionObserver is a browser API that lets you observe when an element enters or exits the viewport (or another element).

### Key Benefits
- ✓ Runs asynchronously (off main thread)
- ✓ No scroll event listeners needed
- ✓ No manual position calculations
- ✓ Better performance than scroll + getBoundingClientRect()
- ✓ Automatically handles edge cases

---

## 1. Basic Syntax

```javascript
const observer = new IntersectionObserver(callback, options);
observer.observe(element);
```

**Parameters:**
- `callback`: Function called when intersection changes
- `options`: Configuration object (optional)

---

## 2. Callback Function

The callback receives two arguments:

```javascript
function callback(entries, observer) {
  entries.forEach(entry => {
    // entry.isIntersecting - is element visible?
    // entry.intersectionRatio - how much is visible? (0 to 1)
    // entry.target - the observed element
    // entry.boundingClientRect - element dimensions
    // entry.intersectionRect - visible portion dimensions
    // entry.rootBounds - root/viewport dimensions
    // entry.time - timestamp of intersection change
  });
}
```

### IntersectionObserverEntry Properties

| Property | Description |
|----------|-------------|
| `isIntersecting` | Boolean: is element visible? |
| `intersectionRatio` | 0-1: percentage visible |
| `target` | The DOM element being observed |
| `boundingClientRect` | Element's bounding box |
| `intersectionRect` | Visible portion's bounding box |
| `rootBounds` | Root/viewport bounding box |
| `time` | Timestamp (DOMHighResTimeStamp) |

---

## 3. Options Object

```javascript
const options = {
  root: null,              // Element to use as viewport (null = browser viewport)
  rootMargin: "0px",       // Margin around root (like CSS margin)
  threshold: 0             // When to trigger (0-1 or array of values)
};
```

### Option Details

#### a) `root`
- **Default:** `null` (viewport)
- **Can be:** any ancestor element
- **Use case:** Scrollable container

#### b) `rootMargin`
- **Default:** `"0px"`
- **Syntax:** Like CSS margin (top, right, bottom, left)
- **Examples:**
  - `"50px"` → 50px margin all sides
  - `"100px 0px"` → 100px top/bottom
  - `"0px 0px -100px"` → Trigger 100px before bottom
  - `"-100px"` → Shrink observable area
- **Use case:** Trigger before/after element enters viewport

#### c) `threshold`
- **Default:** `0` (fires as soon as 1px is visible)
- **Can be:** Number (0-1) or Array of numbers
- **Examples:**
  - `0` → Trigger when any part enters
  - `0.5` → Trigger when 50% visible
  - `1` → Trigger when 100% visible
  - `[0, 0.25, 0.5, 0.75, 1]` → Multiple thresholds
- **Use case:** Trigger at specific visibility percentages

---

## 4. Practical Examples

### Example 1: Lazy Loading Images

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load actual image
      img.classList.add("loaded");
      imageObserver.unobserve(img); // Stop observing
    }
  });
}, {
  rootMargin: "50px" // Start loading 50px before visible
});

// HTML: <img data-src="real-image.jpg" src="placeholder.jpg">
document.querySelectorAll("img[data-src]").forEach(img => {
  imageObserver.observe(img);
});
```

### Example 2: Infinite Scroll

```javascript
const sentinelObserver = new IntersectionObserver((entries) => {
  const [entry] = entries;
  if (entry.isIntersecting && !isLoading && hasMore) {
    loadMoreContent();
  }
}, {
  rootMargin: "200px" // Trigger 200px before reaching sentinel
});

const sentinel = document.querySelector("#load-more-trigger");
sentinelObserver.observe(sentinel);
```

### Example 3: Fade-in Animations

```javascript
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in");
      animateObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // Trigger when 10% visible
});

document.querySelectorAll(".animate-on-scroll").forEach(el => {
  animateObserver.observe(el);
});
```

### Example 4: Analytics/Tracking View Time

```javascript
const viewTracker = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element became visible
      startTimer(entry.target.id);
    } else {
      // Element left viewport
      endTimer(entry.target.id);
      sendAnalytics(entry.target.id, getElapsedTime());
    }
  });
}, {
  threshold: 0.5 // Count as "viewed" when 50% visible
});
```

### Example 5: Pause Video When Not Visible

```javascript
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  });
}, {
  threshold: 0.5 // Play when at least 50% visible
});

document.querySelectorAll("video").forEach(video => {
  videoObserver.observe(video);
});
```

---

## 5. Observer Methods

```javascript
// Start observing an element
observer.observe(element);

// Stop observing a specific element
observer.unobserve(element);

// Stop observing all elements
observer.disconnect();

// Get all current entries (rarely used)
const entries = observer.takeRecords();
```

### Best Practices
- `unobserve()` after one-time actions (lazy load, animations)
- `disconnect()` when component unmounts (React cleanup)
- Reuse observers when possible (observe multiple elements)

---

## 6. rootMargin Visual Guide

### Default (rootMargin: "0px")
```
┌─────────────────────┐
│    Viewport         │ ← Observable area = viewport
│                     │
│  ┌──────────┐       │
│  │ Element  │ ✓     │ ← Triggers when element enters
│  └──────────┘       │
│                     │
└─────────────────────┘
```

### Expanded (rootMargin: "100px")
```
  ┌─────────────────────┐
  │ Observable area     │ ← 100px larger on all sides
  │ ┌─────────────────┐ │
  │ │   Viewport      │ │
  │ │                 │ │
┌─┼─┼─────────────────┼─┼─┐
│ │ │                 │ │ │
│ └─┼─────────────────┼─┘ │
│   │  ┌──────────┐   │   │
│   │  │ Element  │ ✓ │   │ ← Triggers 100px BEFORE entering viewport
│   │  └──────────┘   │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

### Shrunk (rootMargin: "-50px")
```
┌─────────────────────┐
│    Viewport         │
│ ╔═════════════════╗ │ ← Observable area 50px smaller
│ ║                 ║ │
│ ║  ┌──────────┐   ║ │
│ ║  │ Element  │ ✓ ║ │ ← Triggers only when 50px INSIDE viewport
│ ║  └──────────┘   ║ │
│ ║                 ║ │
│ ╚═════════════════╝ │
└─────────────────────┘
```

### Bottom only (rootMargin: "0px 0px 200px 0px")
```
┌─────────────────────┐
│    Viewport         │
│                     │
│                     │
└─────────────────────┘
│ Extended 200px down │ ← Useful for infinite scroll
│  ┌──────────┐       │
│  │ Element  │ ✓     │ ← Triggers 200px before reaching bottom
│  └──────────┘       │
└─────────────────────┘
```

---

## 7. Threshold Examples

### threshold: 0 (default)
- Fires as soon as **any** pixel is visible
- Most common for lazy loading

### threshold: 0.5
- Fires when **50%** of element is visible
- Good for analytics ("viewed" = half visible)

### threshold: 1.0
- Fires when **100%** of element is visible
- Strict visibility requirement

### threshold: [0, 0.25, 0.5, 0.75, 1]
- Fires at 0%, 25%, 50%, 75%, 100% visibility
- Use `entry.intersectionRatio` to check which threshold
- Good for progress tracking, animations

### Example with Multiple Thresholds

```javascript
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const ratio = entry.intersectionRatio;
    if (ratio === 0) console.log("Not visible");
    else if (ratio === 0.25) console.log("25% visible");
    else if (ratio === 0.5) console.log("50% visible");
    else if (ratio === 0.75) console.log("75% visible");
    else if (ratio === 1) console.log("Fully visible");
  });
}, { threshold: [0, 0.25, 0.5, 0.75, 1] });
```

---

## 8. Common Patterns

### Pattern 1: One-time Trigger (lazy load, animate)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      doSomething(entry.target);
      observer.unobserve(entry.target); // ← Stop observing after trigger
    }
  });
});
```

### Pattern 2: Toggle on Enter/Exit (video play/pause)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onEnter(entry.target);
    } else {
      onExit(entry.target);
    }
  });
});
```

### Pattern 3: Batch Observe Multiple Elements
```javascript
const observer = new IntersectionObserver(callback);
document.querySelectorAll(".observe-me").forEach(el => {
  observer.observe(el);
});
```

### Pattern 4: React Cleanup
```javascript
useEffect(() => {
  const observer = new IntersectionObserver(callback);
  if (ref.current) observer.observe(ref.current);
  
  return () => observer.disconnect(); // ← Cleanup on unmount
}, []);
```

---

## 9. Performance Tips

### ✓ DO
- Reuse observers (one observer, many elements)
- `unobserve()` elements after one-time actions
- Use `rootMargin` to trigger early (better UX)
- `disconnect()` when component unmounts
- Use threshold wisely (more thresholds = more callbacks)

### ✗ DON'T
- Create new observer for each element (wasteful)
- Perform heavy calculations in callback (keep it light)
- Forget to disconnect (memory leaks)
- Use too many threshold values (0.01 increments = 100 callbacks!)

---

## 10. Browser Support

### Supported In
- ✓ Chrome 51+
- ✓ Firefox 55+
- ✓ Safari 12.1+
- ✓ Edge 15+
- ✗ IE 11 (needs polyfill)

### Polyfill
```bash
npm install intersection-observer
```

```javascript
import "intersection-observer"; // In entry file
```

### Feature Detection
```javascript
if ("IntersectionObserver" in window) {
  // Use IntersectionObserver
} else {
  // Fallback to scroll listener
}
```

---

## 11. VS Alternatives

### IntersectionObserver vs scroll + getBoundingClientRect()

| IntersectionObserver | Scroll + getBoundingClientRect |
|---------------------|-------------------------------|
| ✓ Runs asynchronously (better performance) | ✗ Runs on main thread (can block rendering) |
| ✓ No throttling/debouncing needed | ✗ Needs throttling (performance) |
| ✓ Handles edge cases automatically | ✗ More code, more bugs |
| ✓ Less code | ✗ More code |
| ✗ Requires polyfill for IE11 | ✓ Works in IE11 without polyfill |

---

## Summary

IntersectionObserver is the **MODERN** way to detect element visibility.

### Use It For
- 📸 Lazy loading images/videos
- ♾️ Infinite scroll
- ✨ Scroll animations
- 📊 Analytics/view tracking
- 🎬 Auto-play/pause videos
- 🎯 Sticky headers/navigation
- 📱 Progressive image loading

### Key Takeaways
1. Async & performant (runs off main thread)
2. No manual calculations needed
3. Configure with `rootMargin` & `threshold`
4. `unobserve()` for one-time, `disconnect()` for cleanup
5. Widely supported (polyfill for IE11)

### Remember
- **rootMargin**: expand/shrink observable area (like CSS margin)
- **threshold**: when to trigger (0 = any pixel, 1 = fully visible)
- **isIntersecting**: is element visible right now?
- **intersectionRatio**: how much is visible? (0-1)
