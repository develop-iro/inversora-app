import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';

/**
 * Returns whether loaded fund entries still reflect the current ISIN selection.
 *
 * @param selectedIsins - ISINs selected for comparison, in display order.
 * @param entries - Hydrated comparison entries for the current selection.
 */
export function areCompareFundsOutOfSync(
  selectedIsins: readonly string[],
  entries: readonly CompareFundEntry[],
): boolean {
  if (selectedIsins.length === 0) {
    return false;
  }

  if (entries.length !== selectedIsins.length) {
    return true;
  }

  return selectedIsins.some(
    (isin) => !entries.some((entry) => entry.isin === isin),
  );
}
