// useThrottle.js
// Custom React hook for throttling callbacks

import { useEffect, useRef, useState } from 'react';

/**
 * Throttles a callback function - returns a throttled version of the callback
 * 
 * @param {Function} callback - The function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @param {Array} dependencies - Dependency array for the callback
 * @returns {Function} - The throttled callback function
 * 
 * @example
 * const handleScroll = useThrottleCallback(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 200, []);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 */

export function useThrottleCallback(callback, wait = 500, dependencies = []) {
  const lastCallTime = useRef(0);
  const timeoutID = useRef(null);
  const lastArgs = useRef(null);

  // Memoize the callback
  const savedCallback = useRef(callback);
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
      }
    };
  }, []);

  const throttledCallback = useRef((...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime.current;

    // Store latest args for trailing edge
    lastArgs.current = args;

    if (timeSinceLastCall >= wait) {
      // Enough time passed - execute immediately (leading edge)
      lastCallTime.current = now;
      savedCallback.current(...args);

      // Clear any pending trailing call
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
        timeoutID.current = null;
      }
    } else if (!timeoutID.current) {
      // Within wait period and no timer set - schedule trailing call
      timeoutID.current = setTimeout(() => {
        lastCallTime.current = Date.now();
        savedCallback.current(...lastArgs.current);
        timeoutID.current = null;
      }, wait - timeSinceLastCall);
    }
    // else: within wait period and timer already running - just update lastArgs
  }).current;

  return throttledCallback;
}

export default useThrottle;



import { useState, useEffect, useRef } from "react";
export function useThrottle_Hook(value, interval = 500) {
  const [throttledValued, setThrottledValue] = useState(value);
  const lastUpdated = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
      // we can exec now
    } else {
      const timerid = setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
        // do after interval
      }, interval);
    }
  }, [value, interval]);

  return throttledValued;
}
