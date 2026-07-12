import { useMemo } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import type { FundCatalogFiltersState } from '@/features/funds/types/fund-catalog-filters';
import { buildCatalogPreviewServiceFilters } from '@/features/funds/utils/catalog-filter-presentation';
import { countCatalogFunds } from '@/features/funds/utils/filter-catalog-funds';

export type CatalogFilterPreviewCountStatus = 'idle' | 'ready';

export type UseCatalogFilterPreviewCountOptions = {
  /** When false, the seed count is returned without client-side filtering. */
  enabled: boolean;
  /** Seed count shown before the in-memory catalog index is available. */
  initialCount: number | null;
};

export type UseCatalogFilterPreviewCountResult = {
  count: number | null;
  status: CatalogFilterPreviewCountStatus;
};

/**
 * Computes the filtered fund total for the catalog filters sheet from cached catalog data.
 *
 * Draft filter changes must not trigger HTTP requests; only explicit apply or the initial
 * paginated catalog load may call the API.
 *
 * @param catalogFunds - Full or partial in-memory catalog slice.
 * @param draft - In-progress filter selections inside the filters sheet.
 * @param searchQuery - Debounced catalog search query from the browse screen.
 * @param options - Preview lifecycle options.
 */
export function useCatalogFilterPreviewCount(
  catalogFunds: readonly CatalogFund[],
  draft: FundCatalogFiltersState,
  searchQuery: string,
  options: UseCatalogFilterPreviewCountOptions,
): UseCatalogFilterPreviewCountResult {
  const count = useMemo(() => {
    if (!options.enabled) {
      return options.initialCount;
    }

    if (catalogFunds.length === 0) {
      return options.initialCount;
    }

    const filters = buildCatalogPreviewServiceFilters(draft, searchQuery);
    return countCatalogFunds(catalogFunds, filters);
  }, [catalogFunds, draft, options.enabled, options.initialCount, searchQuery]);

  return {
    count,
    status: catalogFunds.length === 0 ? 'idle' : 'ready',
  };
}
