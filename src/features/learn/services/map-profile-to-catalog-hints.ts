import type {
  EducationalProfile,
  FinancialReadiness,
  InvestorStyle,
} from '@/core/domain/educational-profile';
import type { FundCatalogFiltersState } from '@/features/funds/types/fund-catalog-filters';
import { DEFAULT_CATALOG_FILTERS } from '@/features/funds/types/fund-catalog-filters';
import { getEducationalProfileSummary } from '@/features/learn/services/build-educational-profile';

/** Suggested catalog filters derived from an orientative educational profile. */
export type ProfileCatalogHints = {
  readonly filters: FundCatalogFiltersState;
  readonly summary: string;
};

function shouldPreferBeginnerFunds(profile: EducationalProfile): boolean {
  return (
    profile.knowledgeLevel === 'beginner' ||
    profile.investorStyle === 'defensive' ||
    profile.financialReadiness === 'not-ready'
  );
}

function appendEnterprisingNote(summary: string, investorStyle: InvestorStyle): string {
  if (investorStyle !== 'enterprising') {
    return summary;
  }

  return `${summary} Inversora se centra en fondos indexados para comparar con calma; no cubre selección activa de acciones individuales.`;
}

function appendReadinessNote(summary: string, financialReadiness: FinancialReadiness): string {
  if (financialReadiness !== 'not-ready') {
    return summary;
  }

  return `${summary} Conviene reforzar colchón o deuda antes de ampliar exposición.`;
}

/**
 * Maps a stored educational profile to suggested catalog filters (HU-17–21).
 *
 * @param profile - Completed orientative profile.
 */
export function mapProfileToCatalogHints(profile: EducationalProfile): ProfileCatalogHints {
  const base: FundCatalogFiltersState = {
    ...DEFAULT_CATALOG_FILTERS,
  };

  const beginnerBoost = shouldPreferBeginnerFunds(profile);
  let summary = getEducationalProfileSummary(profile);
  summary = appendEnterprisingNote(summary, profile.investorStyle);
  summary = appendReadinessNote(summary, profile.financialReadiness);

  switch (profile.riskOrientation) {
    case 'conservative':
      return {
        filters: {
          ...base,
          riskLevel: 'low',
          idealForBeginnersOnly: true,
        },
        summary,
      };
    case 'dynamic':
      return {
        filters: {
          ...base,
          riskLevel: 'high',
          idealForBeginnersOnly: beginnerBoost,
        },
        summary,
      };
    case 'moderate':
    default:
      return {
        filters: {
          ...base,
          riskLevel: 'medium',
          idealForBeginnersOnly: beginnerBoost,
        },
        summary,
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
