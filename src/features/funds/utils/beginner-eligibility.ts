import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { EducationalProfile } from '@/core/domain/educational-profile';
import { shouldUseInitialProfileGateForPlatform } from '@/core/storage/initial-profile-onboarding-policy';
import type { CatalogFund } from '@/core/domain/catalog';
import type { FeaturedFund } from '@/core/domain/fund';
import type { RankedFund, ScoringStatus } from '@/core/scoring/types';
import type { HomeRankingEntry, HomeSearchResult } from '@/features/onboarding/services/resolve-home-search';

/** Minimum Inversora Score for beginner-oriented surfaces (HU-16). */
export const BEGINNER_MIN_SCORE = 30;

type RankedFundEligibility = Pick<RankedFund, 'score'> & {
  readonly status?: ScoringStatus;
};

/**
 * Returns true when beginner-oriented ranking guards should apply (HU-16).
 *
 * MVP defaults to beginner surfaces when no profile exists. Intermediate and
 * advanced profiles see the full ranking without client-side score floors.
 *
 * @param profile - Stored educational profile, if any.
 */
export function shouldApplyBeginnerSurfaceGuards(
  profile: Pick<EducationalProfile, 'knowledgeLevel'> | null | undefined,
): boolean {
  if (!profile) {
    return true;
  }

  return profile.knowledgeLevel === 'beginner';
}

/**
 * Returns true when the Aprendizaje tab is the primary learn entry point.
 * Matches {@link shouldApplyBeginnerSurfaceGuards} (no profile or beginner level).
 *
 * @param profile - Stored educational profile, if any.
 */
export function shouldPreferLearnTabEntryPoint(
  profile: Pick<EducationalProfile, 'knowledgeLevel'> | null | undefined,
): boolean {
  return shouldApplyBeginnerSurfaceGuards(profile);
}

/**
 * Returns true when the user finished the questionnaire with a beginner profile.
 *
 * @param profile - Stored educational profile, if any.
 */
export function hasCompletedBeginnerProfile(
  profile: Pick<EducationalProfile, 'knowledgeLevel'> | null | undefined,
): boolean {
  return profile?.knowledgeLevel === 'beginner';
}

export type HomeStarterSectionVisibilityInput = {
  readonly platformOs: string;
  readonly hasSkippedInitialProfiling: boolean;
  readonly profile: Pick<EducationalProfile, 'knowledgeLevel'> | null | undefined;
  readonly isProfileLoading?: boolean;
};

/**
 * Returns true when the home "Para empezar" section should render.
 *
 * Web never shows this section. On native, it appears only after the user skips
 * the initial profiling gate and has not yet completed the questionnaire or
 * graduated to intermediate via the learn curriculum.
 *
 * @param input - Platform, skip state, and educational profile context.
 */
export function shouldShowHomeStarterSection(
  input: HomeStarterSectionVisibilityInput,
): boolean {
  if (!shouldUseInitialProfileGateForPlatform(input.platformOs)) {
    return false;
  }

  if (input.isProfileLoading) {
    return false;
  }

  if (input.profile !== null && input.profile !== undefined) {
    return false;
  }

  return input.hasSkippedInitialProfiling;
}

/**
 * Returns true when a catalog fund may appear in beginner-oriented surfaces.
 *
 * @param fund - Fund with score and visibility metadata.
 */
export function isBeginnerEligibleFund(
  fund: Pick<CatalogFund, 'inversoraScore' | 'catalogVisibility'>,
): boolean {
  return fund.inversoraScore >= BEGINNER_MIN_SCORE && fund.catalogVisibility !== 'blocked';
}

/**
 * Returns true when a featured fund card may appear in beginner highlights.
 *
 * @param fund - Featured fund card payload.
 */
export function isBeginnerEligibleFeaturedFund(
  fund: Pick<FeaturedFund, 'efficiencyScore'>,
): boolean {
  return fund.efficiencyScore >= BEGINNER_MIN_SCORE;
}

/**
 * Returns true when a ranked fund may appear on beginner-oriented ranking surfaces.
 *
 * @param fund - Ranked fund entry from the API.
 */
export function isBeginnerEligibleRankedFund(fund: RankedFundEligibility): boolean {
  if (fund.status === 'quarantined') {
    return false;
  }

  return fund.score >= BEGINNER_MIN_SCORE;
}

/**
 * Filters ranked funds for beginner-oriented surfaces and reindexes ranks.
 *
 * @param funds - Ranked funds from a single benchmark group or flattened list.
 */
export function filterBeginnerEligibleRankedFunds(funds: readonly RankedFund[]): RankedFund[] {
  return funds
    .filter(isBeginnerEligibleRankedFund)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1,
    }));
}

/**
 * Filters benchmark ranking groups for beginner-oriented surfaces (HU-16).
 *
 * @param groups - Benchmark groups from `GET /rankings`.
 */
export function filterBeginnerEligibleRankingGroups(
  groups: readonly BenchmarkRankingGroup[],
): BenchmarkRankingGroup[] {
  return groups
    .map((group) => {
      const funds = filterBeginnerEligibleRankedFunds(group.funds);

      return {
        ...group,
        funds,
        total: funds.length,
      };
    })
    .filter((group) => group.funds.length > 0);
}

/**
 * Filters home ranking rows for beginner-oriented surfaces.
 *
 * @param entries - Home ranking rows.
 * @param highlightedIsin - Optional ISIN to keep highlighted when still eligible.
 */
export function filterBeginnerEligibleHomeRankingEntries(
  entries: readonly HomeRankingEntry[],
  highlightedIsin?: string,
): HomeRankingEntry[] {
  const eligible = entries.filter(isBeginnerEligibleRankedFund);

  return eligible.map((entry, index) => ({
    ...entry,
    displayRank: index + 1,
    isHighlighted: highlightedIsin
      ? entry.isin === highlightedIsin
      : index === 0,
  }));
}

/**
 * Applies beginner-oriented ranking guards to a home search / ranking result.
 *
 * @param result - Resolved home ranking payload.
 * @param highlightedIsin - Optional ISIN to highlight when eligible.
 */
export function applyBeginnerGuardsToHomeSearchResult(
  result: HomeSearchResult | null,
  highlightedIsin?: string,
): HomeSearchResult | null {
  if (!result) {
    return null;
  }

  const highlight =
    highlightedIsin ??
    (result.kind === 'fund-match' ? result.funds.find((fund) => fund.isHighlighted)?.isin : undefined);

  return {
    ...result,
    funds: filterBeginnerEligibleHomeRankingEntries(result.funds, highlight),
  };
}
