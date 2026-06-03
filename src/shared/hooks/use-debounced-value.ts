import { useEffect, useState } from 'react';

/** Returns a debounced copy of `value` after `delayMs` without further changes. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [delayMs, value]);

  return debouncedValue;
}
