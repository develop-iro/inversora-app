import { useCallback, useEffect, useState } from 'react';

import { fetchWithCache } from '@/core/query/query-cache';

type UseCachedQueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Loads async data with shared in-memory TTL caching.
 *
 * @param cacheKey - Stable cache key; refetch when it changes.
 * @param ttlMs - Cache TTL in milliseconds.
 * @param fetcher - Async data loader.
 */
export function useCachedQuery<T>(
  cacheKey: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): UseCachedQueryState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseCachedQueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await fetchWithCache(cacheKey, ttlMs, fetcher);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Query failed'),
      });
    }
  }, [cacheKey, fetcher, ttlMs]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [load]);

  return {
    ...state,
    refetch: load,
  };
}
