/*

Implement a useIdle hook that detects user inactivity for a specified time. It listens for user interactions like mouse movements, keyboard presses, and touch events, and resets a timer whenever activity is detected.

We consider the user to be idle if there are no events of type events dispatched within ms milliseconds. Additionally, if the user has just switched from another tab to our tab (hint: the visibilitychange event), the user should not be considered idle.


The useIdle hook can be implemented using useState to store the idle state, 
and useEffect to set up the event listeners and the idle timeout. 
To detect if the user is currently on our tab, we can use either document.hidden or document.visibilityState 
when the visibilitychange event is triggered on the document.

*/


import { useEffect, useState } from 'react';

const DEFAULT_EVENTS = [
    'mousemove',
    'mousedown',
    'resize',
    'keydown',
    'touchstart',
    'wheel',
];

export default function useIdle(
    ms = 60_000,
    initialState = false,
    events = DEFAULT_EVENTS,
) {
    const [idle, setIdle] = useState < boolean > (initialState);

    useEffect(() => {
        let timeoutId;

        function handleTimeout() {
            setIdle(true);
        }

        function handleEvent() {
            if (!idle) return;
            setIdle(false);

            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(handleTimeout, ms);
        }

        function handleVisibilityChange() {
            if (document.hidden) {
                return;
            }

            handleEvent();
        }

        timeoutId = setTimeout(handleTimeout, ms);

        events.forEach((event) => window.addEventListener(event, handleEvent));
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(timeoutId);

            events.forEach((event) => window.removeEventListener(event, handleEvent));
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    return idle;
}



/*
in
 the solution above  we are watching the mousemove event. This means that every time the user moves the mouse, handleEvent will be called to reset the idle state! This behaviour also happens for frequently dispatched events like resize or wheel. Can you think of a way to optimize for this?
 -- Throttling
 
*/

export default function useIdle(
    ms = 60_000,
    initialState = false,
    events = DEFAULT_EVENTS,
) {
    const [idle, setIdle] = useState(initialState);
    let timeoutId = null;
    const throttleTimeoutRef = useRef();
    const isThrottledRef = useRef(false);

    useEffect(() => {
        function handleTimeout() {
            setIdle(true);
        }

        function handleEvent() {
            if (isThrottledRef.current) {  // ← THROTTLE CHECK
                return;
            }

            isThrottledRef.current = true;  // ← BLOCK FURTHER CALLS

            throttleTimeoutRef.current = setTimeout(() => {
                isThrottledRef.current = false;  // ← UNBLOCK AFTER 200ms
            }, 200);

            setIdle(false);
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(handleTimeout, ms);
        }

        function handleVisibilityChange() {
            if (document.hidden) {
                return;
            }
            handleEvent();
        }

        timeoutId = setTimeout(handleTimeout, ms);

        events.forEach((event) => window.addEventListener(event, handleEvent));
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(throttleTimeoutRef.current);
            events.forEach((event) => window.removeEventListener(event, handleEvent));
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [ms, events, initialState]);

    return idle;
}


/*

Events:  ████████████████████████████████████████ (100 mouse moves)
Time:    0ms   100ms  200ms  300ms  400ms  500ms

Throttle:
         ┌─────────┐        ┌─────────┐        ┌─────────┐
         │EXECUTE  │        │EXECUTE  │        │EXECUTE  │
         └─────────┘        └─────────┘        └─────────┘
         ↓                  ↓                  ↓
         Gate closes        Gate opens         Gate closes
         for 200ms          Gate closes        for 200ms
                           for 200ms

Result: Only 5 executions per second maximum!
        (1000ms / 200ms = 5)
*/