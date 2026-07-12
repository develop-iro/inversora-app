import type { CatalogFund } from '@/core/domain/catalog';
import { parseInvestmentTheme } from '@/core/domain/investment-theme';
import { extractBenchmarkFromCategoryLabel } from '@/core/api/map-catalog-filters-to-query';
import { BEGINNER_MIN_SCORE } from '@/features/funds/utils/beginner-eligibility';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { matchesFundSearch } from '@/features/funds/utils/fund-search';

/**
 * Returns true when a fund matches the catalog free-text search (`q`).
 *
 * Mirrors the backend `GET /funds` search fields available on {@link CatalogFund}.
 *
 * @param fund - Catalog fund candidate.
 * @param rawQuery - Debounced search query from the browse screen.
 */
export function matchesCatalogSearchQuery(
  fund: CatalogFund,
  rawQuery: string | undefined,
): boolean {
  const trimmed = rawQuery?.trim() ?? '';

  if (trimmed.length === 0) {
    return true;
  }

  if (matchesFundSearch(fund, trimmed)) {
    return true;
  }

  const query = trimmed.toLowerCase();

  return (
    fund.symbol.toLowerCase().includes(query) ||
    fund.categoryLabel.toLowerCase().includes(query) ||
    fund.themeLabel.toLowerCase().includes(query)
  );
}

/**
 * Returns true when a fund matches the selected category or investment theme.
 *
 * Category ids follow {@link buildCatalogCategoryOptions}: `investmentTheme ?? categoryLabel`.
 *
 * @param fund - Catalog fund candidate.
 * @param categoryLabel - Selected category id or `'all'`.
 */
export function matchesCatalogCategoryFilter(
  fund: CatalogFund,
  categoryLabel: string | 'all' | undefined,
): boolean {
  if (!categoryLabel || categoryLabel === 'all') {
    return true;
  }

  const groupId = fund.investmentTheme ?? fund.categoryLabel.trim();

  if (groupId === categoryLabel) {
    return true;
  }

  const investmentTheme = parseInvestmentTheme(categoryLabel);

  if (investmentTheme !== null) {
    return fund.investmentTheme === investmentTheme;
  }

  const benchmark = extractBenchmarkFromCategoryLabel(categoryLabel);

  if (benchmark === undefined) {
    return false;
  }

  return fund.categoryLabel.toLowerCase().includes(benchmark.toLowerCase());
}

/**
 * Returns true when a fund satisfies all catalog filter predicates.
 *
 * @param fund - Catalog fund candidate.
 * @param filters - Normalized catalog filters (service shape).
 */
export function matchesCatalogFundFilters(
  fund: CatalogFund,
  filters: FundCatalogFilters | undefined,
): boolean {
  if (filters === undefined) {
    return true;
  }

  if (!matchesCatalogSearchQuery(fund, filters.query)) {
    return false;
  }

  if (!matchesCatalogCategoryFilter(fund, filters.categoryLabel)) {
    return false;
  }

  if (filters.riskLevel && filters.riskLevel !== 'all' && fund.riskLevel !== filters.riskLevel) {
    return false;
  }

  if (filters.maxTerPercent != null && fund.terPercent > filters.maxTerPercent) {
    return false;
  }

  const effectiveMinScore = filters.idealForBeginnersOnly
    ? Math.max(filters.minScore ?? 0, BEGINNER_MIN_SCORE)
    : filters.minScore;

  if (effectiveMinScore != null && fund.inversoraScore < effectiveMinScore) {
    return false;
  }

  if (filters.idealForBeginnersOnly && !fund.idealForBeginners) {
    return false;
  }

  if (filters.minReturnPercent != null) {
    const returnValue =
      filters.returnPeriod === '3y' ? fund.returns.threeYear : fund.returns.oneYear;

    if (returnValue == null || returnValue < filters.minReturnPercent) {
      return false;
    }
  }

  return true;
}

/**
 * Filters an in-memory catalog slice with the normalized filter model.
 *
 * @param funds - Cached catalog funds loaded client-side.
 * @param filters - Normalized catalog filters (service shape).
 */
export function filterCatalogFunds(
  funds: readonly CatalogFund[],
  filters: FundCatalogFilters | undefined,
): CatalogFund[] {
  return funds.filter((fund) => matchesCatalogFundFilters(fund, filters));
}

/**
 * Counts funds matching catalog filters without issuing HTTP requests.
 *
 * @param funds - Cached catalog funds loaded client-side.
 * @param filters - Normalized catalog filters (service shape).
 */
export function countCatalogFunds(
  funds: readonly CatalogFund[],
  filters: FundCatalogFilters | undefined,
): number {
  if (funds.length === 0) {
    return 0;
  }

  let count = 0;

  for (const fund of funds) {
    if (matchesCatalogFundFilters(fund, filters)) {
      count += 1;
    }
  }

  return count;
}
