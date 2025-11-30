import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook that observes a sentinel element and calls `onLoadMore` when it becomes visible.
 *
 * @param {Function} onLoadMore - Trigger to load the next page of data.
 * @param {Object} options - Behavior knobs.
 * @param {boolean} options.hasMore - Whether another page exists.
 * @param {boolean} options.isLoading - Whether a page is already being fetched.
 * @param {string} options.rootMargin - IntersectionObserver root margin to trigger early.
 * @param {number} options.threshold - Intersection threshold from 0 to 1.
 * @returns {{ sentinelRef: import('react').RefCallback<Element> }} ref to attach to a sentinel element.
 */
export default function useInfiniteScroll(onLoadMore, options = {}) {
  const {
    hasMore = true,
    isLoading = false,
    rootMargin = '200px',
    threshold = 0.1,
  } = options;

  const observerRef = useRef(null);
  const [sentinel, setSentinel] = useState(null);

  /*
     useCallback to catch the latest node, clear the old observer, store the node in state, and then useEffect reacts to that state change and creates a fresh observer tied to the new sentinel. 
     So we still disconnect before re-observing, but now the observer lifecycle stays aligned with the actual DOM element instead of relying on a ref that never causes the hook’s effect to re-run.
  */
  const sentinelRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    setSentinel(node);
  }, []);

  useEffect(() => {
    if (!sentinel || isLoading || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [sentinel, onLoadMore, hasMore, isLoading, rootMargin, threshold]);

  return { sentinelRef };
}


/*
 API around a callback ref (sentinelRef) that first disconnects any existing observer, stores the current sentinel via useState, and lets the useEffect rebuild the observer whenever that sentinel or any option changes; 
  the old version returned a plain ref and only created the observer once per effect run, which could keep stale nodes or miss reconnecting when the sentinel changed.
  - Using useState for the sentinel means React re-renders and re-runs the useEffect as soon as the callback ref receives a DOM node, so we always observe the latest sentinel; a useRef alone wouldn’t trigger the effect when the node changes, so the observer might keep
    observing a stale node (or none at all if the ref assignment happens outside the effect’s lifecycle).
  - Overall this approach ensures the observer lifecycle stays in sync with the DOM (clean teardown + re-creation) and avoids duplicate fetches by respecting isLoading/hasMore while keeping the onLoadMore trigger precise.

*/


/*

if you’re targeting
  chat/reel-style UX with very long histories or “reverse” scrolling, we’ll want to layer in a couple refinements:

  1. Reverse or paged scrolls: Chats usually load older messages when the scroll position hits the top rather than the bottom. 
  You can still use this hook by placing the sentinel at the top of the message list and adjusting rootMargin/threshold so it triggers when the top sentinel comes into view.
  2. Performance: For high-frequency scrolls (reels), the observer itself is lightweight, but you still need to ensure onLoadMore batches or debounces incoming data, avoids re-rendering the entire feed (virtualization helps), and limits DOM nodes.
     The hook simply fires once per intersection; you should make sure the list rendering strategy can handle the new items without layout thrashing.
  3. Sentinel lifecycle: Because the hook re-instantiates the observer whenever the sentinel changes, it stays in sync even if your sentinel node is destroyed/recreated (common in conditional rendering of chat windows). If you end up observing multiple scroll
     containers (e.g., nested scroll elements), you could extend the hook to accept a root option or even return a setter for the observed container.
  So yes, functionally it supports infinite chat/reel scrolls; for heavy UIs you just need to combine it with virtualization, careful loading logic, and possibly a root option for custom scroll containers.

*/