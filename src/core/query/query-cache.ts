type CacheEntry<T> = {
  readonly value: T;
  readonly expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Reads a cached value when still fresh.
 *
 * @param key - Cache key.
 */
export function getCachedValue<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

/**
 * Stores a value with a TTL in milliseconds.
 *
 * @param key - Cache key.
 * @param value - Cached payload.
 * @param ttlMs - Time-to-live in milliseconds.
 */
export function setCachedValue<T>(key: string, value: T, ttlMs: number): void {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Removes cache entries, optionally filtered by key prefix.
 *
 * @param keyPrefix - Optional prefix filter.
 */
export function invalidateCache(keyPrefix?: string): void {
  if (keyPrefix === undefined) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Fetches data with in-memory TTL caching.
 *
 * @param key - Cache key.
 * @param ttlMs - Time-to-live in milliseconds.
 * @param fetcher - Async loader when cache misses.
 */
export async function fetchWithCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = getCachedValue<T>(key);

  if (cached !== null) {
    return cached;
  }

  const value = await fetcher();
  setCachedValue(key, value, ttlMs);
  return value;
}

/** Default TTL for catalog list pages (5 minutes). */
export const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;

/** Default TTL for fund detail payloads (2 minutes). */
export const FUND_DETAIL_CACHE_TTL_MS = 2 * 60 * 1000;
