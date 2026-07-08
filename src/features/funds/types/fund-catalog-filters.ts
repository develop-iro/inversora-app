import type { RiskLevel } from '@/core/domain/fund';
import type { CatalogSortState } from '@/features/funds/types/catalog-sort';
import { DEFAULT_CATALOG_SORT } from '@/features/funds/types/catalog-sort';

export type FundCatalogFilters = {
  query?: string;
  riskLevel?: RiskLevel | 'all';
  categoryLabel?: string | 'all';
  maxTerPercent?: number | null;
  minScore?: number | null;
  idealForBeginnersOnly?: boolean;
  sortBy?: CatalogSortState['sortBy'];
  sortOrder?: CatalogSortState['sortOrder'];
};

/** Full catalog filter state used by catalog screens and sheets. */
export type FundCatalogFiltersState = {
  query: string;
  riskLevel: RiskLevel | 'all';
  categoryLabel: string | 'all';
  maxTerPercent: number | null;
  minScore: number | null;
  idealForBeginnersOnly: boolean;
  sortBy: CatalogSortState['sortBy'];
  sortOrder: CatalogSortState['sortOrder'];
};

export const DEFAULT_CATALOG_FILTERS: FundCatalogFiltersState = {
  query: '',
  riskLevel: 'all',
  categoryLabel: 'all',
  maxTerPercent: null,
  minScore: null,
  idealForBeginnersOnly: false,
  sortBy: DEFAULT_CATALOG_SORT.sortBy,
  sortOrder: DEFAULT_CATALOG_SORT.sortOrder,
};

export const DEFAULT_FUND_CATALOG_FILTERS: FundCatalogFilters = {
  sortBy: DEFAULT_CATALOG_SORT.sortBy,
  sortOrder: DEFAULT_CATALOG_SORT.sortOrder,
};

/**
 * Maps UI filter state to the funds service filter shape.
 *
 * @param state - Active catalog filter state.
 */
export function toServiceFilters(state: FundCatalogFiltersState): FundCatalogFilters {
  return {
    query: state.query,
    riskLevel: state.riskLevel,
    categoryLabel: state.categoryLabel,
    maxTerPercent: state.maxTerPercent,
    minScore: state.minScore,
    idealForBeginnersOnly: state.idealForBeginnersOnly,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  };
}
