import type { CatalogFund } from '@/core/domain/catalog';
import type { RiskLevel } from '@/core/domain/fund';

import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import {
  mapCatalogFiltersToApiQuery,
  type FundListApiQuery,
} from '@/core/api/map-catalog-filters-to-query';
import {
  parseFundListResponse,
  type FundListMeta,
  type FundListResponse,
} from '@/core/api/parse-fund-list-response';
import { AppError } from '@/core/errors/app-error';
import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';
import { CATALOG_SUGGESTIONS_LIMIT } from '@/features/funds/utils/fund-search';

export type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';

/** Default page size for catalog infinite scroll (`GET /funds`). */
export const CATALOG_PAGE_SIZE = 20;

/**
 * Fetches a single page from `GET /funds`.
 *
 * @param baseQuery - Validated API query parameters (including `page` and `limit`).
 * @param signal - Optional abort signal.
 */
async function fetchFundListPage(
  baseQuery: FundListApiQuery,
  signal?: AbortSignal,
): Promise<FundListResponse> {
  const payload = await apiGet<unknown>({
    path: '/funds',
    searchParams: baseQuery,
    signal,
  });

  const response = parseFundListResponse(payload);

  return {
    data: filterCatalogVisible(response.data),
    meta: response.meta,
  };
}

function buildMockFundListPage(
  filters: FundCatalogFilters | undefined,
  page: number,
  limit: number,
): FundListResponse {
  const allFunds = applyClientOnlyCatalogFilters(CATALOG_FUNDS_MOCK, filters);
  const start = (page - 1) * limit;
  const data = allFunds.slice(start, start + limit);
  const total = allFunds.length;

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
}

function toFundsFetchError(error: unknown): AppError {
  return error instanceof AppError
    ? error
    : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar el catálogo de fondos.', error);
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

function getMockCatalogFunds(filters?: FundCatalogFilters): CatalogFund[] {
  return applyClientOnlyCatalogFilters(CATALOG_FUNDS_MOCK, filters);
}

/**
 * Loads one paginated slice of the catalog from `GET /funds`.
 *
 * @param filters - Optional catalog filters.
 * @param page - 1-based page index.
 * @param signal - Optional abort signal.
 */
export async function getFundsPage(
  filters: FundCatalogFilters | undefined,
  page: number,
  signal?: AbortSignal,
): Promise<FundListResponse> {
  if (shouldUseMockData()) {
    return buildMockFundListPage(filters, page, CATALOG_PAGE_SIZE);
  }

  try {
    const apiQuery: FundListApiQuery = {
      ...mapCatalogFiltersToApiQuery(filters),
      page,
      limit: CATALOG_PAGE_SIZE,
    };
    const response = await fetchFundListPage(apiQuery, signal);

    return {
      data: applyClientOnlyCatalogFilters(response.data, filters),
      meta: response.meta,
    };
  } catch (error) {
    throw toFundsFetchError(error);
  }
}

/**
 * Loads the first catalog page for lightweight browse helpers.
 *
 * @param signal - Optional abort signal.
 */
export async function getCatalogBrowseIndex(signal?: AbortSignal): Promise<CatalogFund[]> {
  const response = await getFundsPage(undefined, 1, signal);
  return response.data;
}

/** Clears deprecated browse cache (kept for retry flows that still call reset). */
export function resetCatalogBrowseIndex(): void {
  // No-op: browse index is no longer cached client-side.
}

/**
 * @deprecated Use `getCatalogBrowseIndex` for suggestions/categories and `getFundsPage` for results.
 */
export async function getCatalogFunds(signal?: AbortSignal): Promise<CatalogFund[]> {
  return getCatalogBrowseIndex(signal);
}

/**
 * Returns the first page of catalog funds matching optional filters.
 *
 * Prefer `getFundsPage` for infinite scroll flows.
 *
 * @param filters - Optional catalog filters.
 * @param signal - Optional abort signal.
 */
export async function getFunds(
  filters?: FundCatalogFilters,
  signal?: AbortSignal,
): Promise<CatalogFund[]> {
  if (shouldUseMockData()) {
    return getMockCatalogFunds(filters);
  }

  const response = await getFundsPage(filters, 1, signal);
  return response.data;
}

/**
 * Searches catalog funds for typeahead suggestions via `GET /funds?q=…`.
 *
 * @param query - Raw search text.
 * @param options - Optional result limit and abort signal.
 */
export async function searchCatalogFunds(
  query: string,
  options?: { limit?: number; signal?: AbortSignal },
): Promise<CatalogFund[]> {
  const trimmedQuery = query.trim();
  const limit = options?.limit ?? CATALOG_SUGGESTIONS_LIMIT;

  if (trimmedQuery.length === 0) {
    return [];
  }

  if (shouldUseMockData()) {
    const normalized = trimmedQuery.toLowerCase();

    return getMockCatalogFunds({ query: trimmedQuery })
      .filter(
        (fund) =>
          fund.name.toLowerCase().includes(normalized) ||
          fund.isin.toLowerCase().includes(normalized) ||
          fund.categoryLabel.toLowerCase().includes(normalized) ||
          fund.themeLabel.toLowerCase().includes(normalized) ||
          fund.symbol.toLowerCase().includes(normalized),
      )
      .slice(0, limit);
  }

  try {
    const apiQuery: FundListApiQuery = {
      ...mapCatalogFiltersToApiQuery({ query: trimmedQuery }),
      page: 1,
      limit,
    };
    const response = await fetchFundListPage(apiQuery, options?.signal);
    return response.data;
  } catch (error) {
    throw toFundsFetchError(error);
  }
}

export type { FundListMeta };
