

/*

The hook accepts an object with the following properties:

countStart: number: The initial value of the countdown
countStop: number: The value at which the countdown should stop. This defaults to 0
intervalMs: number: The interval (in milliseconds) at which the countdown should decrease. This defaults to 1000
isIncrement: boolean: A flag to indicate whether the countdown should increment instead of decrement, defaults to false
Returns
The hook returns an object with the following properties:

count: number: The current value of the countdown
start: () => void: A function that starts the countdown
stop: () => void: A function that stops the countdown
reset: () => void: A function that resets the countdown to countStart

*/



/**
 * @param {Object} options
 * @param {number} options.countStart
 * @param {number} [options.countStop=0]
 * @param {number} [options.intervalMs=1000]
 * @param {boolean} [options.isIncrement=false]
 */

import { useCallback, useEffect, useState } from "react";
export default function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}) {
  const [count, setCount] = useState(countStart);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    setRunning(false);
    setCount(countStart);
  }, [countStart]);

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      // for every intervalMs we gotta start, increment, stop based on conditions
      if (count === countStop) return stop();
      if (isIncrement) {
        setCount((prev) => prev + 1);
      } else {
        setCount((prev) => prev - 1);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [count, countStop, intervalMs, isIncrement, running]);

  return { count, start, stop, reset };
}
