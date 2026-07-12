import { useEffect, useState } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import { getCatalogFundsIndex } from '@/features/funds/services/get-funds';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';

export type CatalogCategoryIndexStatus = 'idle' | 'loading' | 'ready' | 'error';

export type UseCatalogCategoryIndexResult = {
  funds: CatalogFund[];
  status: CatalogCategoryIndexStatus;
  error: string | null;
  reload: () => void;
};

/**
 * Loads a lightweight fund slice used only to derive category filter cards.
 */
export function useCatalogFundsIndex(): UseCatalogCategoryIndexResult {
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [status, setStatus] = useState<CatalogCategoryIndexStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const results = await getCatalogFundsIndex(controller.signal);

        if (cancelled) {
          return;
        }

        setFunds(results);
        setError(null);
        setStatus('ready');
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setFunds([]);
        setError(resolveFundApiErrorMessage(loadError));
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadToken]);

  return {
    funds,
    status,
    error,
    reload: () => {
      setStatus('loading');
      setReloadToken((current) => current + 1);
    },
  };
}

/** @deprecated Use useCatalogFundsIndex for filter previews and category cards. */
export const useCatalogCategoryIndex = useCatalogFundsIndex;
