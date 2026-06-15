import type { CatalogFund } from '@/core/domain/catalog';
import type { RiskLevel } from '@/core/domain/fund';

import { apiGet } from '@/core/api/client';
import {
  mapCatalogFiltersToApiQuery,
  type FundListApiQuery,
} from '@/core/api/map-catalog-filters-to-query';
import { parseFundListResponse } from '@/core/api/parse-fund-list-response';
import { AppError } from '@/core/errors/app-error';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';

export type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';

let browseIndexCache: CatalogFund[] | null = null;
let browseIndexPromise: Promise<CatalogFund[]> | null = null;

/**
 * Fetches all pages for a fund list query.
 *
 * @param baseQuery - Validated API query parameters.
 * @param signal - Optional abort signal.
 */
async function fetchFundListPages(
  baseQuery: FundListApiQuery,
  signal?: AbortSignal,
): Promise<CatalogFund[]> {
  const funds: CatalogFund[] = [];
  let page = baseQuery.page;
  let totalPages = 1;

  while (page <= totalPages) {
    const payload = await apiGet<unknown>({
      path: '/funds',
      searchParams: {
        ...baseQuery,
        page,
      },
      signal,
    });

    const response = parseFundListResponse(payload);
    funds.push(...response.data);
    totalPages = response.meta.totalPages;
    page += 1;
  }

  return filterCatalogVisible(funds);
}

/**
 * Applies filters that the API cannot express (risk ranges).
 *
 * @param funds - Funds returned by the API.
 * @param filters - Active catalog filters.
 */
export function applyClientOnlyCatalogFilters(
  funds: CatalogFund[],
  filters?: FundCatalogFilters,
): CatalogFund[] {
  if (!filters?.riskLevel || filters.riskLevel === 'all') {
    return [...funds].sort((left, right) => right.inversoraScore - left.inversoraScore);
  }

  const riskLevel: RiskLevel = filters.riskLevel;

  return funds
    .filter((fund) => fund.riskLevel === riskLevel)
    .sort((left, right) => right.inversoraScore - left.inversoraScore);
}

/**
 * Loads the unfiltered browse index used for category tabs and search suggestions.
 *
 * @param signal - Optional abort signal.
 */
export async function getCatalogBrowseIndex(signal?: AbortSignal): Promise<CatalogFund[]> {
  if (browseIndexCache) {
    return browseIndexCache;
  }

  browseIndexPromise ??= (async () => {
    try {
      const loaded = await fetchFundListPages(mapCatalogFiltersToApiQuery(), signal);
      browseIndexCache = loaded;
      return loaded;
    } catch (error) {
      browseIndexPromise = null;
      throw error instanceof AppError
        ? error
        : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar el catálogo de fondos.', error);
    }
  })();

  return browseIndexPromise;
}

/** Clears the browse index cache (retry flows). */
export function resetCatalogBrowseIndex(): void {
  browseIndexCache = null;
  browseIndexPromise = null;
}

/**
 * @deprecated Use `getCatalogBrowseIndex` for suggestions/categories and `getFunds` for results.
 */
export async function getCatalogFunds(signal?: AbortSignal): Promise<CatalogFund[]> {
  return getCatalogBrowseIndex(signal);
}

/**
 * Returns catalog funds with optional filters via `GET /funds`.
 *
 * Server-side: search, benchmark/category, TER, score, beginners.
 * Client-side: risk level ranges.
 *
 * @param filters - Optional catalog filters.
 * @param signal - Optional abort signal.
 */
export async function getFunds(
  filters?: FundCatalogFilters,
  signal?: AbortSignal,
): Promise<CatalogFund[]> {
  try {
    const apiQuery = mapCatalogFiltersToApiQuery(filters);
    const funds = await fetchFundListPages(apiQuery, signal);
    return applyClientOnlyCatalogFilters(funds, filters);
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar el catálogo de fondos.', error);
  }
}
