import type { CatalogFund } from '@/core/domain/catalog';
import type { FundListResponse } from '@/core/api/parse-fund-list-response';
import { AppError } from '@/core/errors/app-error';
import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';
import {
  matchesFundSearch,
  normalizeFundSearchQuery,
} from '@/features/funds/utils/fund-search';

const DEFAULT_PICKER_LIMIT = 40;

/**
 * Dependencies for the compare-picker funds loader.
 */
export type ComparePickerFundsServiceDeps = {
  shouldUseMockData: () => boolean;
  allowsMockFallback: () => boolean;
  getFundsPage: (
    filters: FundCatalogFilters | undefined,
    page: number,
    signal?: AbortSignal,
  ) => Promise<FundListResponse>;
  searchCatalogFunds: (
    query: string,
    options?: { limit?: number; signal?: AbortSignal },
  ) => Promise<CatalogFund[]>;
};

/**
 * Matches picker search across name, ISIN, category, theme and symbol.
 *
 * @param fund - Catalog fund candidate.
 * @param rawQuery - User search text.
 */
export function matchesComparePickerSearch(
  fund: CatalogFund,
  rawQuery: string,
): boolean {
  const query = normalizeFundSearchQuery(rawQuery);

  if (query.length === 0) {
    return true;
  }

  if (matchesFundSearch(fund, rawQuery)) {
    return true;
  }

  return (
    fund.categoryLabel.toLowerCase().includes(query) ||
    fund.themeLabel.toLowerCase().includes(query) ||
    fund.symbol.toLowerCase().includes(query)
  );
}

function sortPickerFunds(funds: readonly CatalogFund[]): CatalogFund[] {
  return [...funds].sort((left, right) => right.inversoraScore - left.inversoraScore);
}

function filterMockPickerFunds(query: string, limit: number): CatalogFund[] {
  const visibleFunds = filterCatalogVisible(CATALOG_FUNDS_MOCK);

  return sortPickerFunds(visibleFunds.filter((fund) => matchesComparePickerSearch(fund, query))).slice(
    0,
    limit,
  );
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  return error instanceof Error && error.name === 'AbortError';
}

/**
 * Creates the compare-picker funds loader without React Native imports.
 *
 * @param deps - Catalog loaders and environment predicates.
 */
export function createComparePickerFundsService(deps: ComparePickerFundsServiceDeps) {
  const { shouldUseMockData, allowsMockFallback, getFundsPage, searchCatalogFunds } = deps;

  async function loadComparePickerFunds(
    query: string,
    options?: { signal?: AbortSignal; limit?: number },
  ): Promise<CatalogFund[]> {
    const trimmedQuery = query.trim();
    const limit = options?.limit ?? DEFAULT_PICKER_LIMIT;

    if (shouldUseMockData()) {
      return filterMockPickerFunds(trimmedQuery, limit);
    }

    try {
      const loaded =
        trimmedQuery.length > 0
          ? await searchCatalogFunds(trimmedQuery, {
              limit,
              signal: options?.signal,
            })
          : (await getFundsPage(undefined, 1)).data.slice(0, limit);

      if (loaded.length > 0) {
        return loaded;
      }

      if (allowsMockFallback()) {
        return filterMockPickerFunds(trimmedQuery, limit);
      }

      return loaded;
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

      if (allowsMockFallback()) {
        return filterMockPickerFunds(trimmedQuery, limit);
      }

      throw error instanceof AppError
        ? error
        : new AppError(
            'FUNDS_FETCH_FAILED',
            'No se pudo cargar el catálogo para comparar fondos.',
            error,
          );
    }
  }

  return { loadComparePickerFunds };
}
