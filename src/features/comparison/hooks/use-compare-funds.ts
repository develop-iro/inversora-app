import { useEffect, useMemo, useState } from 'react';

import type { FundDetail } from '@/core/domain/catalog';
import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';

const LOAD_ERROR_MESSAGE = 'No se pudo cargar la ficha de este fondo.';

export type UseCompareFundsResult = {
  readonly entries: readonly CompareFundEntry[];
  readonly loadedDetails: readonly FundDetail[];
  readonly notFoundIsins: readonly string[];
  readonly isLoading: boolean;
  readonly hasPartialErrors: boolean;
};

/**
 * Loads fund detail payloads for the current comparison selection.
 *
 * @param selectedIsins - ISINs selected for comparison, in display order.
 */
export function useCompareFunds(selectedIsins: readonly string[]): UseCompareFundsResult {
  const [entries, setEntries] = useState<readonly CompareFundEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (selectedIsins.length === 0) {
        if (!cancelled) {
          setEntries([]);
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setIsLoading(true);
        setEntries(
          selectedIsins.map((isin) => ({
            isin,
            detail: null,
            errorMessage: null,
          })),
        );
      }

      const results = await Promise.all(
        selectedIsins.map(async (isin) => {
          try {
            const detail = await getFundByIsin(isin);

            if (detail === null) {
              return {
                isin,
                detail: null,
                errorMessage: LOAD_ERROR_MESSAGE,
              } satisfies CompareFundEntry;
            }

            return {
              isin,
              detail,
              errorMessage: null,
            } satisfies CompareFundEntry;
          } catch {
            return {
              isin,
              detail: null,
              errorMessage: LOAD_ERROR_MESSAGE,
            } satisfies CompareFundEntry;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setEntries(results);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedIsins]);

  const loadedDetails = useMemo(
    () =>
      selectedIsins
        .map((isin) => entries.find((entry) => entry.isin === isin)?.detail ?? null)
        .filter((detail): detail is FundDetail => detail !== null),
    [entries, selectedIsins],
  );

  const notFoundIsins = useMemo(
    () => entries.filter((entry) => entry.detail === null).map((entry) => entry.isin),
    [entries],
  );

  const hasPartialErrors = notFoundIsins.length > 0 && loadedDetails.length > 0;

  return {
    entries,
    loadedDetails,
    notFoundIsins,
    isLoading,
    hasPartialErrors,
  };
}
