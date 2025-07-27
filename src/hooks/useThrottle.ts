import { useCallback, useRef, useState, useEffect } from "react";

/**
 * A custom hook that throttles the execution of a function.
 * It ensures that the function is called at most once in a specified time period.
 *
 * @param callback The function to throttle.
 * @param delay The throttle delay in milliseconds.
 * @returns A tuple containing the throttled function and a boolean indicating if it's currently throttled.
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): [T, boolean] {
  const [isThrottled, setIsThrottled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (isThrottled) return;
      callback(...args);
      setIsThrottled(true);
      timeoutRef.current = setTimeout(() => setIsThrottled(false), delay);
    },
    [callback, delay, isThrottled],
  ) as T;

  return [throttledCallback, isThrottled];
}
