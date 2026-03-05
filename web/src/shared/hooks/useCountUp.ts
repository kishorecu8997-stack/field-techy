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
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const currentCount = Math.floor(progress * target);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}
