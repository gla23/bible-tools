import { useRef, useEffect } from "react";

type Callback = (...args: unknown[]) => void;
export function useInterval(callback: Callback, delay: number | null) {
  const savedCallback = useRef<Callback>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
