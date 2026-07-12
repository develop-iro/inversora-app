import type { CatalogFund } from '@/core/domain/catalog';
import { parseInvestmentTheme } from '@/core/domain/investment-theme';
import type {
  FundCatalogFilters,
  FundCatalogFiltersState,
} from '@/features/funds/types/fund-catalog-filters';
import { toServiceFilters } from '@/features/funds/types/fund-catalog-filters';
import { matchesFundSearch } from '@/features/funds/utils/fund-search';

function matchesCategory(fund: CatalogFund, categoryLabel: string | undefined): boolean {
  if (categoryLabel === undefined || categoryLabel === 'all') {
    return true;
  }

  const trimmed = categoryLabel.trim();

  if (trimmed.length === 0) {
    return true;
  }

  const theme = parseInvestmentTheme(trimmed);

  if (theme !== null) {
    return fund.investmentTheme === theme;
  }

  return fund.categoryLabel.trim().toLowerCase() === trimmed.toLowerCase();
}

function matchesMinimumReturn(fund: CatalogFund, filters: FundCatalogFilters): boolean {
  if (filters.minReturnPercent == null) {
    return true;
  }

  const returnValue =
    filters.returnPeriod === '3y' ? fund.returns.threeYear : fund.returns.oneYear;

  return returnValue != null && returnValue >= filters.minReturnPercent;
}

function compareCatalogFunds(
  left: CatalogFund,
  right: CatalogFund,
  filters: FundCatalogFilters,
): number {
  const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

  switch (filters.sortBy) {
    case 'ter':
      return (left.terPercent - right.terPercent) * sortOrder;
    case 'return1y': {
      const leftReturn = left.returns.oneYear ?? Number.NEGATIVE_INFINITY;
      const rightReturn = right.returns.oneYear ?? Number.NEGATIVE_INFINITY;
      return (leftReturn - rightReturn) * sortOrder;
    }
    case 'score':
    default:
      return (left.inversoraScore - right.inversoraScore) * sortOrder;
  }
}

function matchesCatalogFilters(fund: CatalogFund, filters: FundCatalogFilters): boolean {
  if (fund.catalogVisibility !== 'visible') {
    return false;
  }

  if (filters.query?.trim() && !matchesFundSearch(fund, filters.query)) {
    return false;
  }

  if (!matchesCategory(fund, filters.categoryLabel)) {
    return false;
  }

  if (filters.riskLevel !== undefined && filters.riskLevel !== 'all') {
    if (fund.riskLevel !== filters.riskLevel) {
      return false;
    }
  }

  if (filters.maxTerPercent != null && fund.terPercent > filters.maxTerPercent) {
    return false;
  }

  if (filters.minScore != null && fund.inversoraScore < filters.minScore) {
    return false;
  }

  if (filters.idealForBeginnersOnly && !fund.idealForBeginners) {
    return false;
  }

  return matchesMinimumReturn(fund, filters);
}

/**
 * Normalizes draft sheet filters before preview counting.
 */
export function buildCatalogPreviewServiceFilters(
  draft: FundCatalogFiltersState,
): FundCatalogFilters {
  return toServiceFilters(draft);
}

/**
 * Applies catalog filters against an in-memory catalog slice for draft previews.
 */
export function filterCatalogFunds(
  funds: readonly CatalogFund[],
  filters: FundCatalogFilters,
): CatalogFund[] {
  return funds
    .filter((fund) => matchesCatalogFilters(fund, filters))
    .sort((left, right) => compareCatalogFunds(left, right, filters));
}

/**
 * Counts catalog matches without making preview UI depend on a committed API response.
 */
export function countCatalogFunds(
  funds: readonly CatalogFund[],
  filters: FundCatalogFilters,
): number {
  return funds.reduce(
    (count, fund) => (matchesCatalogFilters(fund, filters) ? count + 1 : count),
    0,
  );
}
