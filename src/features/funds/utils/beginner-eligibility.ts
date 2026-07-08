import type { CatalogFund } from '@/core/domain/catalog';
import type { FeaturedFund } from '@/core/domain/fund';

/** Minimum Inversora Score for beginner-oriented surfaces (HU-16). */
export const BEGINNER_MIN_SCORE = 30;

/**
 * Returns true when a fund may appear in beginner-oriented surfaces.
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
