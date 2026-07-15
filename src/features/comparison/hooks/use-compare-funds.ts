import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  readonly reloadToken: number;
  readonly refetch: () => void;
};

/**
 * Merges the current selection into previously loaded compare entries.
 *
 * @param selectedIsins - ISINs selected for comparison, in display order.
 * @param currentEntries - Previously hydrated compare entries.
 */
function mergeCompareEntries(
  selectedIsins: readonly string[],
  currentEntries: readonly CompareFundEntry[],
): CompareFundEntry[] {
  return selectedIsins.map((isin) => {
    const existing = currentEntries.find((entry) => entry.isin === isin);

    return existing ?? { isin, detail: null, errorMessage: null };
  });
}

/**
 * Returns ISINs that still need a network fetch.
 *
 * @param entries - Merged compare entries for the current selection.
 * @param forceFailed - When true, retries entries that previously failed.
 */
function resolveIsinsToFetch(
  entries: readonly CompareFundEntry[],
  forceFailed: boolean,
): string[] {
  return entries
    .filter((entry) => {
      if (entry.detail !== null) {
        return false;
      }

      if (entry.errorMessage === null) {
        return true;
      }

      return forceFailed;
    })
    .map((entry) => entry.isin);
}

async function loadCompareFundEntry(isin: string): Promise<CompareFundEntry> {
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
}

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

      const mergedEntries = mergeCompareEntries(selectedIsins, entriesRef.current).map(
        (entry) => {
          if (!forceFailed || entry.detail !== null || entry.errorMessage === null) {
            return entry;
          }

          return { ...entry, errorMessage: null };
        },
      );
      const isinsToFetch = resolveIsinsToFetch(mergedEntries, forceFailed);

      if (!cancelled) {
        setEntries(mergedEntries);
      }

      if (isinsToFetch.length === 0) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setIsLoading(true);
      }

      const fetchedEntries = await Promise.all(
        isinsToFetch.map((isin) => loadCompareFundEntry(isin)),
      );

      if (cancelled) {
        return;
      }

      const fetchedByIsin = new Map(
        fetchedEntries.map((entry) => [entry.isin, entry] as const),
      );

      setEntries(mergedEntries.map((entry) => fetchedByIsin.get(entry.isin) ?? entry));
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
