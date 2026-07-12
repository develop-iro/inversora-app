import { useEffect, useState } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import { getCatalogFundsIndex } from '@/features/funds/services/get-funds';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';

export type CatalogFundsIndexStatus = 'idle' | 'loading' | 'ready' | 'error';

export type UseCatalogFundsIndexResult = {
  funds: CatalogFund[];
  status: CatalogFundsIndexStatus;
  error: string | null;
  reload: () => void;
};

/**
 * Loads the full visible catalog once for client-side filter previews and category cards.
 */
export function useCatalogFundsIndex(): UseCatalogFundsIndexResult {
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [status, setStatus] = useState<CatalogFundsIndexStatus>('loading');
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
