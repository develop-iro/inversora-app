import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { createFundsCatalogService } from '@/features/funds/services/get-funds.factory';

export {
  applyClientOnlyCatalogFilters,
  CATALOG_PAGE_SIZE,
  invalidateCatalogCache,
  type CatalogMetricsCategory,
  type CatalogMetricsResponse,
  type FundCatalogFilters,
  type FundListMeta,
} from '@/features/funds/services/get-funds.factory';

const fundsCatalogService = createFundsCatalogService({
  apiGet,
  shouldUseMockData,
  allowsMockFallback,
});

/**
 * Loads one paginated slice of the catalog from `GET /funds`.
 *
 * @param filters - Optional catalog filters.
 * @param page - 1-based page index.
 * @param signal - Optional abort signal.
 */
export const getFundsPage = fundsCatalogService.getFundsPage;

/**
 * Loads lightweight catalog totals and category metrics without fetching all funds.
 *
 * @param filters - Optional catalog filters.
 * @param signal - Optional abort signal.
 */
export const getCatalogMetrics = fundsCatalogService.getCatalogMetrics;

/** @deprecated Use getCatalogMetrics for counts and getFundsPage for list data. */
export async function getCatalogCategoryIndex(
  signal?: AbortSignal,
): Promise<Awaited<ReturnType<typeof fundsCatalogService.getCatalogBrowseIndex>>> {
  return fundsCatalogService.getCatalogBrowseIndex(signal);
}

/** @deprecated Use getCatalogMetrics for counts and getFundsPage for list data. */
export async function getCatalogFundsIndex(
  signal?: AbortSignal,
): Promise<Awaited<ReturnType<typeof fundsCatalogService.getCatalogBrowseIndex>>> {
  return fundsCatalogService.getCatalogBrowseIndex(signal);
}

/**
 * Loads the first catalog page for lightweight browse helpers.
 *
 * @param signal - Optional abort signal.
 */
export const getCatalogBrowseIndex = fundsCatalogService.getCatalogBrowseIndex;

/** Clears deprecated browse cache (kept for retry flows that still call reset). */
export function resetCatalogBrowseIndex(): void {
  // No-op: browse index is no longer cached client-side.
}

/**
 * @deprecated Use `getCatalogBrowseIndex` for suggestions/categories and `getFundsPage` for results.
 */
export async function getCatalogFunds(
  signal?: AbortSignal,
): Promise<Awaited<ReturnType<typeof fundsCatalogService.getCatalogBrowseIndex>>> {
  return fundsCatalogService.getCatalogBrowseIndex(signal);
}

/**
 * Returns the first page of catalog funds matching optional filters.
 *
 * Prefer `getFundsPage` for infinite scroll flows.
 *
 * @param filters - Optional catalog filters.
 * @param signal - Optional abort signal.
 */
export const getFunds = fundsCatalogService.getFunds;

/**
 * Searches catalog funds for typeahead suggestions via `GET /funds?q=…`.
 *
 * @param query - Raw search text.
 * @param options - Optional result limit and abort signal.
 */
export const searchCatalogFunds = fundsCatalogService.searchCatalogFunds;
