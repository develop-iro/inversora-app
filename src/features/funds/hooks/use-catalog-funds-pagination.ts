import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import type { FundListMeta } from '@/core/api/parse-fund-list-response';
import {
  getFundsPage,
  type FundCatalogFilters,
} from '@/features/funds/services/get-funds';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';

export type CatalogFundsPaginationStatus =
  | 'idle'
  | 'loading'
  | 'loading-more'
  | 'ready'
  | 'error';

export type UseCatalogFundsPaginationResult = {
  funds: CatalogFund[];
  meta: FundListMeta | null;
  status: CatalogFundsPaginationStatus;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reload: () => Promise<void>;
};

function mergeUniqueFunds(
  current: readonly CatalogFund[],
  incoming: readonly CatalogFund[],
): CatalogFund[] {
  if (incoming.length === 0) {
    return [...current];
  }

  const seen = new Set(current.map((fund) => fund.isin));
  const merged = [...current];

  for (const fund of incoming) {
    if (seen.has(fund.isin)) {
      continue;
    }

    seen.add(fund.isin);
    merged.push(fund);
  }

  return merged;
}

/**
 * Loads catalog funds page-by-page for infinite scroll surfaces.
 *
 * @param filters - Active catalog filters mapped to the funds service.
 * @param reloadToken - Bumps when the screen needs a hard refresh.
 */
export function useCatalogFundsPagination(
  filters: FundCatalogFilters,
  reloadToken = 0,
): UseCatalogFundsPaginationResult {
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [meta, setMeta] = useState<FundListMeta | null>(null);
  const [status, setStatus] = useState<CatalogFundsPaginationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const nextPageRef = useRef(1);
  const isLoadingMoreRef = useRef(false);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const loadInitialPage = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    isLoadingMoreRef.current = false;
    nextPageRef.current = 1;
    setStatus('loading');
    setError(null);
    setFunds([]);
    setMeta(null);

    try {
      const response = await getFundsPage(filters, 1);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setFunds(response.data);
      setMeta(response.meta);
      nextPageRef.current = 2;
      setStatus('ready');
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setFunds([]);
      setMeta(null);
      setError(resolveFundApiErrorMessage(loadError));
      setStatus('error');
    }
  }, [filtersKey, filters]);

  useEffect(() => {
    void loadInitialPage();
  }, [loadInitialPage, reloadToken]);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || status === 'loading') {
      return;
    }

    if (meta === null || nextPageRef.current > meta.totalPages) {
      return;
    }

    const requestId = requestIdRef.current;
    const page = nextPageRef.current;
    isLoadingMoreRef.current = true;
    setStatus('loading-more');

    try {
      const response = await getFundsPage(filters, page);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setFunds((current) => mergeUniqueFunds(current, response.data));
      setMeta(response.meta);
      nextPageRef.current = page + 1;
      setStatus('ready');
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(resolveFundApiErrorMessage(loadError));
      setStatus('ready');
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [filters, filtersKey, meta, status]);

  const hasMore = meta !== null && nextPageRef.current <= meta.totalPages;

  return {
    funds,
    meta,
    status,
    error,
    hasMore,
    loadMore,
    reload: loadInitialPage,
  };
}
