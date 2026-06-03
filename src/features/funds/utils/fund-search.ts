/** Debounce applied before filtering the catalog (keeps perceived latency under 500 ms). */
export const CATALOG_SEARCH_DEBOUNCE_MS = 150;

export type FundSearchTarget = {
  name: string;
  isin: string;
};

export function normalizeFundSearchQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeIsin(value: string): string {
  return value.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Matches a fund by partial name or ISIN (case-insensitive, ignores spaces in ISIN).
 */
export function matchesFundSearch(fund: FundSearchTarget, rawQuery: string): boolean {
  const query = normalizeFundSearchQuery(rawQuery);

  if (!query) {
    return true;
  }

  if (fund.name.toLowerCase().includes(query)) {
    return true;
  }

  const isinQuery = normalizeIsin(rawQuery);
  const fundIsin = normalizeIsin(fund.isin);

  if (isinQuery.length > 0 && fundIsin.includes(isinQuery)) {
    return true;
  }

  return fundIsin.toLowerCase().includes(query);
}
