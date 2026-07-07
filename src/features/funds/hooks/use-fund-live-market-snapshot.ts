import { useCallback, useEffect, useMemo, useState } from 'react';

import type { FundLiveMarketSnapshot } from '@/core/domain/fund-live-market';
import { getFundLiveMarketSnapshot } from '@/features/funds/services/get-fund-live-market-snapshot';

type UseFundLiveMarketSnapshotResult = {
  snapshot: FundLiveMarketSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Loads a fund market snapshot on screen mount without session-wide caching.
 *
 * @param isin - Fund ISIN to resolve.
 */
export function useFundLiveMarketSnapshot(
  isin: string | undefined,
): UseFundLiveMarketSnapshotResult {
  const normalizedIsin = useMemo(
    () => isin?.trim().toUpperCase() ?? '',
    [isin],
  );
  const hasIsin = normalizedIsin.length > 0;

  const [snapshot, setSnapshot] = useState<FundLiveMarketSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!hasIsin) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const loaded = await getFundLiveMarketSnapshot(normalizedIsin, controller.signal);
        if (!cancelled) {
          setSnapshot(loaded);
        }
      } catch (loadError: unknown) {
        if (!cancelled && !controller.signal.aborted) {
          setSnapshot(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar la cotización.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [hasIsin, normalizedIsin, reloadToken]);

  return {
    snapshot: hasIsin ? snapshot : null,
    isLoading: hasIsin ? isLoading : false,
    error: hasIsin ? error : null,
    refetch,
  };
}
