import type { EducationalProfile } from '@/core/domain/educational-profile';
import type { FundCatalogFiltersState } from '@/features/funds/types/fund-catalog-filters';
import { DEFAULT_CATALOG_FILTERS } from '@/features/funds/types/fund-catalog-filters';
import { getEducationalProfileSummary } from '@/features/learn/services/build-educational-profile';

/** Suggested catalog filters derived from an orientative educational profile. */
export type ProfileCatalogHints = {
  readonly filters: FundCatalogFiltersState;
  readonly summary: string;
};

/**
 * Maps a stored educational profile to suggested catalog filters (HU-17–21).
 *
 * @param profile - Completed orientative profile.
 */
export function mapProfileToCatalogHints(profile: EducationalProfile): ProfileCatalogHints {
  const base: FundCatalogFiltersState = {
    ...DEFAULT_CATALOG_FILTERS,
  };

  switch (profile.riskOrientation) {
    case 'conservative':
      return {
        filters: {
          ...base,
          riskLevel: 'low',
          idealForBeginnersOnly: true,
        },
        summary: getEducationalProfileSummary(profile),
      };
    case 'dynamic':
      return {
        filters: {
          ...base,
          riskLevel: 'high',
        },
        summary: getEducationalProfileSummary(profile),
      };
    case 'moderate':
    default:
      return {
        filters: {
          ...base,
          riskLevel: 'medium',
        },
        summary: getEducationalProfileSummary(profile),
      };
  }
}

/**
 * Returns true when catalog filters already match the suggested profile hints.
 *
 * @param current - Active catalog filters.
 * @param suggested - Profile-derived filter suggestions.
 */
export function areProfileHintsApplied(
  current: FundCatalogFiltersState,
  suggested: FundCatalogFiltersState,
): boolean {
  return (
    current.riskLevel === suggested.riskLevel &&
    current.idealForBeginnersOnly === suggested.idealForBeginnersOnly
  );
}
