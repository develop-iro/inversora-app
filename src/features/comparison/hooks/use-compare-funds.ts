import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FundDetail } from '@/core/domain/catalog';
import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';
import { createCompareFundsService } from '@/features/comparison/services/load-compare-funds.factory';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';

const compareFundsService = createCompareFundsService({
  getFundByIsin,
});

export type UseCompareFundsResult = {
  readonly entries: readonly CompareFundEntry[];
  readonly loadedDetails: readonly FundDetail[];
  readonly notFoundIsins: readonly string[];
  readonly isLoading: boolean;
  readonly hasPartialErrors: boolean;
  readonly reloadToken: number;
  readonly refetch: () => void;
};

/**
 * Loads fund detail payloads for the current comparison selection.
 *
 * @param selectedIsins - ISINs selected for comparison, in display order.
 */
export function useCompareFunds(selectedIsins: readonly string[]): UseCompareFundsResult {
  const [entries, setEntries] = useState<readonly CompareFundEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const entriesRef = useRef(entries);
  const selectionKey = selectedIsins.join(',');

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    let cancelled = false;
    const forceFailed = reloadToken > 0;

    void (async () => {
      if (selectedIsins.length === 0) {
        if (!cancelled) {
          setEntries([]);
          setIsLoading(false);
        }
        return;
      }

      const previousEntries = entriesRef.current;
      const needsFetch = selectedIsins.some((isin) => {
        const existing = previousEntries.find((entry) => entry.isin === isin);
        if (existing?.detail !== null && existing !== undefined) {
          return false;
        }
        if (existing?.errorMessage !== null && existing !== undefined && !forceFailed) {
          return false;
        }
        return true;
      });

      if (!cancelled) {
        setIsLoading(needsFetch);
      }

      const nextEntries = await compareFundsService.loadCompareFunds(
        selectedIsins,
        previousEntries,
        { forceFailed },
      );

      if (cancelled) {
        return;
      }

      setEntries(nextEntries);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectionKey, reloadToken, selectedIsins]);

  const refetch = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const loadedDetails = useMemo(
    () =>
      selectedIsins
        .map((isin) => entries.find((entry) => entry.isin === isin)?.detail ?? null)
        .filter((detail): detail is FundDetail => detail !== null),
    [entries, selectedIsins],
  );

  const notFoundIsins = useMemo(
    () =>
      entries
        .filter((entry) => entry.detail === null && entry.errorMessage !== null)
        .map((entry) => entry.isin),
    [entries],
  );

  const hasPartialErrors = notFoundIsins.length > 0 && loadedDetails.length > 0;

  return {
    entries,
    loadedDetails,
    notFoundIsins,
    isLoading,
    hasPartialErrors,
    reloadToken,
    refetch,
  };
}
