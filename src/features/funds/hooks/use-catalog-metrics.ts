import { useEffect, useState } from 'react';

import {
  getCatalogMetrics,
  type CatalogMetricsResponse,
  type FundCatalogFilters,
} from '@/features/funds/services/get-funds';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';

export type CatalogMetricsStatus = 'idle' | 'loading' | 'ready' | 'error';

export type UseCatalogMetricsResult = {
  metrics: CatalogMetricsResponse | null;
  status: CatalogMetricsStatus;
  error: string | null;
};

function hasReturnFilter(filters?: FundCatalogFilters): boolean {
  return filters?.minReturnPercent != null;
}

/**
 * Loads lightweight catalog counts/facets for UI labels.
 */
export function useCatalogMetrics(
  filters?: FundCatalogFilters,
  options?: { enabled?: boolean },
): UseCatalogMetricsResult {
  const enabled = options?.enabled !== false && !hasReturnFilter(filters);
  const [metrics, setMetrics] = useState<CatalogMetricsResponse | null>(null);
  const [status, setStatus] = useState<CatalogMetricsStatus>(
    enabled ? 'loading' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      await Promise.resolve();

      if (cancelled) {
        return;
      }

      setStatus('loading');
      setError(null);

      try {
        const response = await getCatalogMetrics(filters, controller.signal);

        if (cancelled) {
          return;
        }

        setMetrics(response);
        setStatus('ready');
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setMetrics(null);
        setError(resolveFundApiErrorMessage(loadError));
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, filters]);

  if (!enabled) {
    return { metrics: null, status: 'idle', error: null };
  }

  return { metrics, status, error };
}
