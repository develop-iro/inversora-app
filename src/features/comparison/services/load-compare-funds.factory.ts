import type { FundDetail } from '@/core/domain/catalog';
import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';

const LOAD_ERROR_MESSAGE = 'No se pudo cargar la ficha de este fondo.';

/**
 * Dependencies for the compare-funds loader.
 */
export type CompareFundsServiceDeps = {
  getFundByIsin: (isin: string, signal?: AbortSignal) => Promise<FundDetail | null>;
};

/**
 * Merges the current selection into previously loaded compare entries.
 *
 * @param selectedIsins - ISINs selected for comparison, in display order.
 * @param currentEntries - Previously hydrated compare entries.
 */
export function mergeCompareEntries(
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
export function resolveIsinsToFetch(
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

/**
 * Creates the compare-funds loader without React Native imports.
 *
 * @param deps - Fund detail loader port.
 */
export function createCompareFundsService(deps: CompareFundsServiceDeps) {
  const { getFundByIsin } = deps;

  async function loadCompareFundEntry(
    isin: string,
    signal?: AbortSignal,
  ): Promise<CompareFundEntry> {
    try {
      const detail = await getFundByIsin(isin, signal);

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
   * Loads or refreshes compare entries for the current selection.
   *
   * @param selectedIsins - ISINs selected for comparison, in display order.
   * @param currentEntries - Previously hydrated compare entries.
   * @param options - Optional force-retry and abort signal.
   */
  async function loadCompareFunds(
    selectedIsins: readonly string[],
    currentEntries: readonly CompareFundEntry[] = [],
    options?: { forceFailed?: boolean; signal?: AbortSignal },
  ): Promise<CompareFundEntry[]> {
    if (selectedIsins.length === 0) {
      return [];
    }

    const forceFailed = options?.forceFailed === true;
    const mergedEntries = mergeCompareEntries(selectedIsins, currentEntries).map((entry) => {
      if (!forceFailed || entry.detail !== null || entry.errorMessage === null) {
        return entry;
      }

      return { ...entry, errorMessage: null };
    });
    const isinsToFetch = resolveIsinsToFetch(mergedEntries, forceFailed);

    if (isinsToFetch.length === 0) {
      return mergedEntries;
    }

    const fetchedEntries = await Promise.all(
      isinsToFetch.map((isin) => loadCompareFundEntry(isin, options?.signal)),
    );
    const fetchedByIsin = new Map(
      fetchedEntries.map((entry) => [entry.isin, entry] as const),
    );

    return mergedEntries.map((entry) => fetchedByIsin.get(entry.isin) ?? entry);
  }

  return {
    loadCompareFunds,
    loadCompareFundEntry,
  };
}
