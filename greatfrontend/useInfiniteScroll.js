// useInfiniteScroll.js
// Simple infinite scroll hook using IntersectionObserver

import { useEffect, useRef } from 'react';

/**
 * Custom hook for implementing infinite scroll with IntersectionObserver
 * 
 * @param {Function} onLoadMore - Callback function to load more content
 * @param {Object} options - Configuration options
 * @param {boolean} options.hasMore - Whether there's more content to load
 * @param {boolean} options.isLoading - Whether content is currently loading
 * @param {string} options.rootMargin - Margin around root (e.g., '300px' to trigger early)
 * @param {number} options.threshold - Intersection threshold (0 to 1)
 * @returns {Object} - Returns ref to attach to sentinel element
 * 
 * @example
 * const { sentinelRef } = useInfiniteScroll(loadMoreItems, {
 *   hasMore: hasMoreItems,
 *   isLoading: loading,
 *   rootMargin: '300px'
 * });
 * 
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef}>Loading...</div>
 *   </div>
 * );
 */
export default function useInfiniteScroll(onLoadMore, options = {}) {
  const {
    hasMore = true,
    isLoading = false,
    rootMargin = '300px',
    threshold = 0.1,
  } = options;

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Don't observe if no more content or currently loading
    if (!hasMore || isLoading) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    // Create IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // When sentinel becomes visible, load more
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin,
        threshold,
      }
    );

    // Start observing
    observerRef.current.observe(sentinel);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, hasMore, isLoading, rootMargin, threshold]);

  return { sentinelRef };
}

import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for infinite scrolling using Intersection Observer API
 * 
 * @param {Function} onLoadMore - Callback function to load more items
 * @param {Object} options - Configuration options
 * @param {boolean} options.hasMore - Whether there are more items to load
 * @param {boolean} options.isLoading - Current loading state
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early triggering
 * @returns {Function} - Ref callback to attach to sentinel element
 */
function useInfiniteScroll(onLoadMore, options = {}) {
  const {
    hasMore = true,
    isLoading = false,
    threshold = 1.0,
    rootMargin = '0px'
  } = options;

  const observerRef = useRef(null);

  const sentinelRef = useCallback(
    (node) => {
      // Don't observe if loading or no more items
      if (isLoading || !hasMore) return;

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // When sentinel element is visible, load more
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        },
      );

      // Start observing the sentinel element
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [onLoadMore, isLoading, hasMore]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return sentinelRef;
}
