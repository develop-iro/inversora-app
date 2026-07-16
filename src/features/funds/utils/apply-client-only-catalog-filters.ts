import type { CatalogFund } from '@/core/domain/catalog';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';

/**
 * Returns true when the active sort is return-based.
 */
function isReturnBasedCatalogSort(filters?: FundCatalogFilters): boolean {
  return filters?.sortBy === 'return1y';
}

/**
 * Applies post-fetch catalog shaping that the API does not perform.
 *
 * @param funds - Funds returned by the API.
 * @param filters - Active catalog filters.
 */
export function applyClientOnlyCatalogFilters(
  funds: CatalogFund[],
  filters?: FundCatalogFilters,
): CatalogFund[] {
  if (isReturnBasedCatalogSort(filters) || filters?.minReturnPercent != null) {
    return [...funds];
  }

  return [...funds].sort((left, right) => right.inversoraScore - left.inversoraScore);
}
