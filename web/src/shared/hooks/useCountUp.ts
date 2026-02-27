import { useEffect, useState } from "react";

/**
 * A custom hook that animates a number from 0 to a target value.
 *
 * @param target - The number to count up to
 * @param duration - The duration of the animation in milliseconds (default: 1000ms)
 * @returns The current animated count value
 *
 * @example
 * const count = useCountUp(100);
 * // count will animate from 0 to 100 over 1000ms
 *
 */
export function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const steps = 30;
    const increment = target / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}
