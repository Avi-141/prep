import { useEffect, useRef } from "react";

function useInterval(callback, delay) {
    const savedCallback = useRef()

    // remember latest callback
    /*
        IF WE DONT USE USEREF
        Interval gets recreated on every callback change: If the parent component re-renders and passes a new callback function (which happens often in React), the effect runs again The interval is cleared and restarted.. This resets timing and Unnecessary cleanup and setup
    */
   // in JS each function is an object..
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])


    useEffect(() => {
        if (!delay) return;
        const id = setInterval(() => {
            savedCallback.current()
        }, delay)

        return () => clearInterval(id)
    }, [delay])
}
/*

WITHOUT useRef:
t=0      1000    2000    3000    4000
|--------|-------|-------|-------|
start    fire    fire    fire    fire
         ↓       ↓       ↓       ↓
         render  render  render  render
         ↓       ↓       ↓       ↓
         RESET!  RESET!  RESET!  RESET!
         start   start   start   start
                 (timing gets irregular!)

WITH useRef:
t=0      1000    2000    3000    4000
|--------|-------|-------|-------|
start    fire    fire    fire    fire
(one continuous timer, perfect rhythm)
         ↓       ↓       ↓       ↓
         render  render  render  render
         ↓       ↓       ↓       ↓
         update  update  update  update
         ref     ref     ref     ref
         (timer untouched!)


Why this matters:
Timing accuracy: Your interval fires at exact intervals, not with drift
Performance: No unnecessary teardown/setup of timers
Predictability: The behavior matches what you'd expect from a simple setInterval
The useRef pattern lets us separate the interval timing (stable) from the callback logic (can update).
*/