import type { CatalogFund } from '@/core/domain/catalog';
import type { HttpGetPort } from '@/core/api/http-get-port';
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
import {
  CATALOG_CACHE_TTL_MS,
  fetchWithCache,
  invalidateCache,
} from '@/core/query/query-cache';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { applyClientOnlyCatalogFilters } from '@/features/funds/utils/apply-client-only-catalog-filters';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';
import { filterCatalogFunds } from '@/features/funds/utils/filter-catalog-funds';
import { CATALOG_SUGGESTIONS_LIMIT } from '@/features/funds/utils/fund-search';
import { formatRankingThemeLabel } from '@/features/onboarding/utils/build-ranking-theme-options';

export type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';

export type CatalogMetricsCategory = {
  id: string;
  label: string;
  fundCount: number;
  topScore: number | null;
};

export type CatalogMetricsResponse = {
  total: number;
  categories: CatalogMetricsCategory[];
};

/** Backend page size for catalog infinite scroll (`GET /funds`). */
export const CATALOG_PAGE_SIZE = 100;

/**
 * Dependencies for the funds catalog application service.
 */
export type FundsCatalogServiceDeps = {
  apiGet: HttpGetPort;
  shouldUseMockData: () => boolean;
  allowsMockFallback: () => boolean;
};

/**
 * Clears cached catalog pages (e.g. on pull-to-refresh).
 */
export function invalidateCatalogCache(): void {
  invalidateCache('catalog:');
}

function buildCatalogCacheKey(filters: FundCatalogFilters | undefined, page: number): string {
  return `catalog:${JSON.stringify(filters ?? {})}:${page}`;
}

function buildMockFundListPage(
  filters: FundCatalogFilters | undefined,
  page: number,
  limit: number,
): FundListResponse {
  const allFunds = filterCatalogFunds(CATALOG_FUNDS_MOCK, filters ?? {});
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

function getMockCatalogFunds(filters?: FundCatalogFilters): CatalogFund[] {
  return filterCatalogFunds(CATALOG_FUNDS_MOCK, filters ?? {});
}

function getMockCatalogMetrics(filters?: FundCatalogFilters): CatalogMetricsResponse {
  const funds = getMockCatalogFunds(filters);
  const groups = new Map<string, { label: string; funds: CatalogFund[] }>();

  for (const fund of funds) {
    const id = fund.investmentTheme ?? fund.categoryLabel.trim();

    if (id.length === 0) {
      continue;
    }

    const label =
      fund.themeLabel.trim().length > 0
        ? fund.themeLabel
        : fund.investmentTheme !== null
          ? formatRankingThemeLabel(fund.investmentTheme)
          : formatRankingThemeLabel(fund.categoryLabel);
    const existing = groups.get(id) ?? { label, funds: [] };
    existing.funds.push(fund);
    groups.set(id, existing);
  }

  return {
    total: funds.length,
    categories: [...groups.entries()]
      .map(([id, group]) => ({
        id,
        label: group.label,
        fundCount: group.funds.length,
        topScore: Math.max(...group.funds.map((fund) => fund.inversoraScore)),
      }))
      .sort((left, right) => left.label.localeCompare(right.label, 'es')),
  };
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  return error instanceof Error && error.name === 'AbortError';
}

function mapCatalogMetricsFiltersToApiQuery(
  filters?: FundCatalogFilters,
): Record<string, string | number | boolean | undefined> {
  const { minReturn1y: _minReturn1y, minReturn3y: _minReturn3y, ...baseQuery } =
    mapCatalogFiltersToApiQuery(filters);

  return baseQuery;
}

/**
 * Creates the funds catalog application service without React Native imports.
 *
 * @param deps - HTTP port and environment predicates.
 */
export function createFundsCatalogService(deps: FundsCatalogServiceDeps) {
  const { apiGet, shouldUseMockData, allowsMockFallback } = deps;

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

  async function loadFundsPageFromApi(
    filters: FundCatalogFilters | undefined,
    page: number,
    signal?: AbortSignal,
  ): Promise<FundListResponse> {
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
      if (allowsMockFallback() && !isAbortError(error)) {
        return buildMockFundListPage(filters, page, CATALOG_PAGE_SIZE);
      }

      throw toFundsFetchError(error);
    }
  }

  async function getFundsPage(
    filters: FundCatalogFilters | undefined,
    page: number,
    signal?: AbortSignal,
  ): Promise<FundListResponse> {
    if (shouldUseMockData()) {
      return buildMockFundListPage(filters, page, CATALOG_PAGE_SIZE);
    }

    if (signal) {
      return loadFundsPageFromApi(filters, page, signal);
    }

    return fetchWithCache(
      buildCatalogCacheKey(filters, page),
      CATALOG_CACHE_TTL_MS,
      () => loadFundsPageFromApi(filters, page),
    );
  }

  async function getCatalogMetrics(
    filters?: FundCatalogFilters,
    signal?: AbortSignal,
  ): Promise<CatalogMetricsResponse> {
    if (shouldUseMockData()) {
      return getMockCatalogMetrics(filters);
    }

    try {
      return await apiGet<CatalogMetricsResponse>({
        path: '/funds/catalog-metrics',
        searchParams: mapCatalogMetricsFiltersToApiQuery(filters),
        signal,
      });
    } catch (error) {
      if (allowsMockFallback() && !isAbortError(error)) {
        return getMockCatalogMetrics(filters);
      }

      throw toFundsFetchError(error);
    }
  }

  async function getCatalogBrowseIndex(signal?: AbortSignal): Promise<CatalogFund[]> {
    const response = await getFundsPage(undefined, 1, signal);
    return response.data;
  }

  async function getFunds(
    filters?: FundCatalogFilters,
    signal?: AbortSignal,
  ): Promise<CatalogFund[]> {
    if (shouldUseMockData()) {
      return getMockCatalogFunds(filters);
    }

    const response = await getFundsPage(filters, 1, signal);
    return response.data;
  }

  async function searchCatalogFunds(
    query: string,
    options?: { limit?: number; signal?: AbortSignal },
  ): Promise<CatalogFund[]> {
    const trimmedQuery = query.trim();
    const limit = options?.limit ?? CATALOG_SUGGESTIONS_LIMIT;

    if (trimmedQuery.length === 0) {
      return [];
    }

    if (shouldUseMockData()) {
      return getMockCatalogFunds({ query: trimmedQuery }).slice(0, limit);
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

  return {
    getFundsPage,
    getCatalogMetrics,
    getCatalogBrowseIndex,
    getFunds,
    searchCatalogFunds,
  };
}

export type { FundListMeta };
export { applyClientOnlyCatalogFilters } from '@/features/funds/utils/apply-client-only-catalog-filters';
