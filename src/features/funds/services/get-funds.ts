import type { CatalogFund } from '@/core/domain/catalog';
import type { RiskLevel } from '@/core/domain/fund';

import { apiGet } from '@/core/api/client';
import { parseFundListResponse } from '@/core/api/parse-fund-list-response';
import { AppError } from '@/core/errors/app-error';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';
import { matchesFundSearch } from '@/features/funds/utils/fund-search';

export type FundCatalogFilters = {
  query?: string;
  riskLevel?: RiskLevel | 'all';
  categoryLabel?: string | 'all';
  maxTerPercent?: number | null;
  minScore?: number | null;
  idealForBeginnersOnly?: boolean;
};

const CATALOG_PAGE_LIMIT = 100;

let catalogCache: CatalogFund[] | null = null;
let catalogPromise: Promise<CatalogFund[]> | null = null;

/**
 * Fetches every visible catalog page from `GET /funds`.
 *
 * @param signal - Optional abort signal for in-flight requests.
 */
async function fetchCatalogFromApi(signal?: AbortSignal): Promise<CatalogFund[]> {
  const funds: CatalogFund[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const payload = await apiGet<unknown>({
      path: '/funds',
      searchParams: {
        page,
        limit: CATALOG_PAGE_LIMIT,
        sortBy: 'score',
        sortOrder: 'desc',
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

/** Loads the visible catalog once and caches it for fast client-side search. */
export async function getCatalogFunds(signal?: AbortSignal): Promise<CatalogFund[]> {
  if (catalogCache) {
    return catalogCache;
  }

  catalogPromise ??= (async () => {
    try {
      const loaded = await fetchCatalogFromApi(signal);
      catalogCache = loaded;
      return loaded;
    } catch (error) {
      catalogPromise = null;
      throw error instanceof AppError
        ? error
        : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar el catálogo de fondos.', error);
    }
  })();

  return catalogPromise;
}

/** Clears the in-memory catalog cache (useful after retry flows). */
export function resetCatalogCache(): void {
  catalogCache = null;
  catalogPromise = null;
}

/** Synchronous filter for in-memory catalog search (target: well under 500 ms). */
export function filterCatalogFunds(
  funds: CatalogFund[],
  filters?: FundCatalogFilters,
): CatalogFund[] {
  if (!filters) {
    return [...funds].sort((a, b) => b.inversoraScore - a.inversoraScore);
  }

  const query = filters.query?.trim() ?? '';

  const filtered = funds.filter((fund) => {
    if (query && !matchesFundSearch(fund, query)) {
      return false;
    }

    if (filters.riskLevel && filters.riskLevel !== 'all' && fund.riskLevel !== filters.riskLevel) {
      return false;
    }

    if (
      filters.categoryLabel &&
      filters.categoryLabel !== 'all' &&
      fund.categoryLabel !== filters.categoryLabel
    ) {
      return false;
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

    return true;
  });

  return filtered.sort((a, b) => b.inversoraScore - a.inversoraScore);
}

/** Returns catalog funds with optional filters, sorted by Inversora score. No login required. */
export async function getFunds(
  filters?: FundCatalogFilters,
  signal?: AbortSignal,
): Promise<CatalogFund[]> {
  const catalog = await getCatalogFunds(signal);
  return filterCatalogFunds(catalog, filters);
}
