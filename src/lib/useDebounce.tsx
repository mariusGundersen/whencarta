import { useEffect, useState } from "react";
export function useDebounce<T>(initial: T, delay: number) {
  const [value, setValue] = useState(initial);
  const [delayedValue, setDelayedValue] = useState(initial);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [delayedValue, setValue] as const;
}
