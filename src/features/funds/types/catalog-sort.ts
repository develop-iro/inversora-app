/** Supported catalog sort fields mapped to `GET /funds`. */
export type CatalogSortBy = 'score' | 'ter' | 'return1y';

/** Sort direction for catalog queries. */
export type CatalogSortOrder = 'asc' | 'desc';

export type CatalogSortState = {
  readonly sortBy: CatalogSortBy;
  readonly sortOrder: CatalogSortOrder;
};

export const DEFAULT_CATALOG_SORT: CatalogSortState = {
  sortBy: 'score',
  sortOrder: 'desc',
};

export type CatalogSortOption = {
  readonly sortBy: CatalogSortBy;
  readonly sortOrder: CatalogSortOrder;
  readonly label: string;
};

/** User-facing catalog sort presets (HU-08). */
export const CATALOG_SORT_OPTIONS: readonly CatalogSortOption[] = [
  { sortBy: 'score', sortOrder: 'desc', label: 'Score' },
  { sortBy: 'ter', sortOrder: 'asc', label: 'Comisión' },
  { sortBy: 'return1y', sortOrder: 'desc', label: 'Rentab. 1 año' },
] as const;

/**
 * Returns true when the active sort matches a preset option.
 */
export function isCatalogSortOptionActive(
  current: CatalogSortState,
  option: CatalogSortOption,
): boolean {
  return current.sortBy === option.sortBy && current.sortOrder === option.sortOrder;
}
