import type { FundCatalogFiltersState } from '@/features/funds/components/fund-catalog-filters';

export type CatalogActiveFilterChip = {
  readonly id: string;
  readonly label: string;
};

/**
 * Counts non-default catalog filters (excludes free-text search).
 */
export function countActiveCatalogFilters(filters: FundCatalogFiltersState): number {
  let count = 0;

  if (filters.categoryLabel !== 'all') {
    count += 1;
  }

  if (filters.riskLevel !== 'all') {
    count += 1;
  }

  if (filters.maxTerPercent != null) {
    count += 1;
  }

  if (filters.minScore != null) {
    count += 1;
  }

  if (filters.idealForBeginnersOnly) {
    count += 1;
  }

  return count;
}

/**
 * Builds removable chip labels for the active catalog filters.
 */
export function buildCatalogActiveFilterChips(
  filters: FundCatalogFiltersState,
  categoryLabelById: ReadonlyMap<string, string>,
): readonly CatalogActiveFilterChip[] {
  const chips: CatalogActiveFilterChip[] = [];

  if (filters.categoryLabel !== 'all') {
    chips.push({
      id: 'category',
      label: categoryLabelById.get(filters.categoryLabel) ?? filters.categoryLabel,
    });
  }

  if (filters.riskLevel !== 'all') {
    const riskLabels = { low: 'Riesgo bajo', medium: 'Riesgo medio', high: 'Riesgo alto' } as const;
    chips.push({
      id: 'risk',
      label: riskLabels[filters.riskLevel],
    });
  }

  if (filters.maxTerPercent != null) {
    chips.push({
      id: 'ter',
      label: `TER ≤ ${filters.maxTerPercent.toString().replace('.', ',')}%`,
    });
  }

  if (filters.minScore != null) {
    chips.push({
      id: 'score',
      label: `Score ≥ ${filters.minScore}`,
    });
  }

  if (filters.idealForBeginnersOnly) {
    chips.push({
      id: 'beginners',
      label: 'Para empezar',
    });
  }

  return chips;
}

/**
 * Formats the catalog results headline for the browse toolbar.
 */
export function formatCatalogResultsHeadline(
  totalCount: number | null,
  loadedCount: number,
  options?: {
    categoryLabel?: string;
    query?: string;
  },
): string {
  const count = totalCount ?? loadedCount;
  const fundWord = count === 1 ? 'fondo' : 'fondos';
  const category = options?.categoryLabel?.trim();
  const query = options?.query?.trim();

  if (query) {
    return `${count.toLocaleString('es-ES')} ${fundWord} para «${query}»`;
  }

  if (category) {
    return `${count.toLocaleString('es-ES')} ${fundWord} en ${category}`;
  }

  return `${count.toLocaleString('es-ES')} ${fundWord} indexados`;
}

/**
 * Formats the primary CTA label inside the filters sheet.
 */
export function formatCatalogFiltersApplyLabel(totalCount: number | null): string {
  if (totalCount == null) {
    return 'Ver fondos';
  }

  const fundWord = totalCount === 1 ? 'fondo' : 'fondos';
  return `Ver ${totalCount.toLocaleString('es-ES')} ${fundWord}`;
}
