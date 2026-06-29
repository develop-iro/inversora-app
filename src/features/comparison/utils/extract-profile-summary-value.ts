import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';

/**
 * Reads a summary row value from a fund profile by row id.
 *
 * @param profile - Fund detail profile block.
 * @param rowId - Summary row identifier (e.g. `currency`, `vehicle`).
 */
export function extractProfileSummaryValue(
  profile: FundDetailProfile,
  rowId: string,
): string | null {
  const row = profile.summaryRows.find((entry) => entry.id === rowId);

  if (row === undefined || row.value.trim().length === 0) {
    return null;
  }

  return row.value.trim();
}

/**
 * Parses the currency code from `currencyNote` when summary rows omit it.
 *
 * @param currencyNote - Profile currency note (e.g. `* Calculada en USD`).
 */
export function parseCurrencyFromNote(currencyNote: string): string | null {
  const match = currencyNote.match(/en\s+([A-Z]{3})\b/i);

  if (match === null) {
    return null;
  }

  return match[1].toUpperCase();
}
