/** Debounce applied before filtering the catalog (keeps perceived latency under 500 ms). */
export const CATALOG_SEARCH_DEBOUNCE_MS = 150;

/** Minimum characters before predictive suggestions are shown. */
export const CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH = 2;

/** Maximum number of inline suggestions rendered at once. */
export const CATALOG_SUGGESTIONS_LIMIT = 5;

export type FundSearchTarget = {
  name: string;
  isin: string;
  categoryLabel?: string;
};

export type FundSearchSuggestion = {
  isin: string;
  name: string;
  categoryLabel: string;
};

export function normalizeFundSearchQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeIsin(value: string): string {
  return value.replace(/[\s-]/g, '').toUpperCase();
}

/** Relevance score for ordering search results (higher = better match). */
export function scoreFundSearchMatch(fund: FundSearchTarget, rawQuery: string): number {
  const query = normalizeFundSearchQuery(rawQuery);

  if (!query) {
    return 0;
  }

  const name = fund.name.toLowerCase();
  const isin = normalizeIsin(fund.isin);
  const isinQuery = normalizeIsin(rawQuery);

  if (name.startsWith(query)) {
    return 100;
  }

  if (isinQuery.length >= 2 && isin.startsWith(isinQuery)) {
    return 95;
  }

  if (name.split(/\s+/).some((word) => word.startsWith(query))) {
    return 85;
  }

  if (name.includes(query)) {
    return 70;
  }

  if (isinQuery.length >= 2 && isin.includes(isinQuery)) {
    return 60;
  }

  return 0;
}

/**
 * Returns ranked fund suggestions for inline typeahead (sync, non-blocking).
 */
export function getFundSearchSuggestions<T extends FundSearchTarget>(
  funds: T[],
  rawQuery: string,
  limit = CATALOG_SUGGESTIONS_LIMIT,
): FundSearchSuggestion[] {
  const query = normalizeFundSearchQuery(rawQuery);

  if (query.length < CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH) {
    return [];
  }

  return funds
    .map((fund) => ({
      fund,
      score: scoreFundSearchMatch(fund, rawQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.fund.name.localeCompare(b.fund.name, 'es'))
    .slice(0, limit)
    .map(({ fund }) => ({
      isin: fund.isin,
      name: fund.name,
      categoryLabel: fund.categoryLabel ?? '',
    }));
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
