import {
  DEFAULT_CATALOG_FILTERS,
  type FundCatalogFiltersState,
} from '@/features/funds/types/fund-catalog-filters';

/** Ephemeral catalog UI state cleared when the screen loses focus. */
export type CatalogScreenBlurResetState = {
  readonly filters: FundCatalogFiltersState;
  readonly isProfileHintsDismissed: boolean;
  readonly isFiltersVisible: boolean;
  readonly isSoraVisible: boolean;
};

/**
 * Default catalog screen state applied when the user leaves the funds catalog.
 */
export function resolveCatalogScreenBlurReset(): CatalogScreenBlurResetState {
  return {
    filters: DEFAULT_CATALOG_FILTERS,
    isProfileHintsDismissed: false,
    isFiltersVisible: false,
    isSoraVisible: false,
  };
}
