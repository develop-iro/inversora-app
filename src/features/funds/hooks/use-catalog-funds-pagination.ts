import { useCallback, useEffect, useRef, useState } from 'react';

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
  | 'refreshing'
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

const CATALOG_VISIBLE_BATCH_SIZE = 7;

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
  const [fetchedFunds, setFetchedFunds] = useState<CatalogFund[]>([]);
  const [visibleCount, setVisibleCount] = useState(CATALOG_VISIBLE_BATCH_SIZE);
  const [meta, setMeta] = useState<FundListMeta | null>(null);
  const [status, setStatus] = useState<CatalogFundsPaginationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [loadedPageCount, setLoadedPageCount] = useState(0);

  const requestIdRef = useRef(0);
  const hasLoadedOnceRef = useRef(false);
  const lastReloadTokenRef = useRef(reloadToken);

  const loadInitialPage = useCallback(async (options?: { signal?: AbortSignal; soft?: boolean }) => {
    const requestId = ++requestIdRef.current;
    const soft = options?.soft === true && hasLoadedOnceRef.current;

    if (soft) {
      setStatus('refreshing');
    } else {
      setStatus('loading');
      setFetchedFunds([]);
      setVisibleCount(CATALOG_VISIBLE_BATCH_SIZE);
      setMeta(null);
      setLoadedPageCount(0);
    }

    setError(null);

    try {
      const response = await getFundsPage(filters, 1, options?.signal);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setFetchedFunds(response.data);
      setVisibleCount(Math.min(CATALOG_VISIBLE_BATCH_SIZE, response.data.length));
      setMeta(response.meta);
      setLoadedPageCount(1);
      setStatus('ready');
      hasLoadedOnceRef.current = true;
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!soft) {
        setFetchedFunds([]);
        setVisibleCount(CATALOG_VISIBLE_BATCH_SIZE);
        setMeta(null);
        setLoadedPageCount(0);
      }

      setError(resolveFundApiErrorMessage(loadError));
      setStatus('error');
    }
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const forceHard = reloadToken !== lastReloadTokenRef.current;
    lastReloadTokenRef.current = reloadToken;
    const soft = !forceHard && hasLoadedOnceRef.current;

    void (async () => {
      await Promise.resolve();
      if (cancelled) {
        return;
      }

      await loadInitialPage({ signal: controller.signal, soft });
    })();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
      controller.abort();
    };
  }, [loadInitialPage, reloadToken]);

  const loadMore = useCallback(async () => {
    if (status === 'loading' || status === 'refreshing' || status === 'loading-more') {
      return;
    }

    if (visibleCount < fetchedFunds.length) {
      setVisibleCount((current) =>
        Math.min(current + CATALOG_VISIBLE_BATCH_SIZE, fetchedFunds.length),
      );
      return;
    }

    if (meta === null || loadedPageCount >= meta.totalPages) {
      return;
    }

    const requestId = requestIdRef.current;
    setStatus('loading-more');

    try {
      let page = loadedPageCount;
      let nextMeta = meta;
      let nextFunds = fetchedFunds;

      while (page < nextMeta.totalPages && nextFunds.length <= visibleCount) {
        page += 1;
        const response = await getFundsPage(filters, page);
        nextMeta = response.meta;
        nextFunds = mergeUniqueFunds(nextFunds, response.data);
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      setFetchedFunds(nextFunds);
      setVisibleCount((current) =>
        Math.min(current + CATALOG_VISIBLE_BATCH_SIZE, nextFunds.length),
      );
      setMeta(nextMeta);
      setLoadedPageCount(page);
      setStatus('ready');
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(resolveFundApiErrorMessage(loadError));
      setStatus('ready');
    }
  }, [fetchedFunds, filters, loadedPageCount, meta, status, visibleCount]);

  const funds = fetchedFunds.slice(0, visibleCount);
  const hasMore =
    visibleCount < fetchedFunds.length || (meta !== null && loadedPageCount < meta.totalPages);

  return {
    funds,
    meta,
    status,
    error,
    hasMore,
    loadMore,
    reload: () => loadInitialPage({ soft: false }),
  };
}
